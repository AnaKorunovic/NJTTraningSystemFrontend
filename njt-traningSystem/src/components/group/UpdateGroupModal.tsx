import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Group from "../../model/Group";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Trainer from "../../model/Trainer";

const UpdateGroupModal: React.FC<{ group: Group}> = ({ group }) => {

  const [trainers, setTrainers] = useState(Array<Trainer>());

  const nameRef = useRef<HTMLIonInputElement>(null);
  const [trainer, setTrainer] = useState<Trainer>();
  const [present] = useIonAlert();

  useEffect(() => {
    console.log("Group send to update: " + group.id);

    //ucitavanje trenera
    axios
    .get("http://localhost:8080/api/trainers", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((response) => {
      setTrainers(response.data);
    })
    .catch((error) => {
      console.log("Error while sending get request for trainers:" + error);
    });
  }, []);

  

  const updateGroup = () => {
    let groupToUpdate: Group = {
      id: group.id,
      name: nameRef.current!.value as string,
      trainer: trainer ? trainer : group.trainer,
      //  user: authentication.authenticatedUser?.id ||
      //      Math.floor(Math.random() * 10),
      user: group.user,
    };
    let warning="Promenjeni su sledeći podaci: \n";
    if(group.name!=groupToUpdate.name) warning+="[ime] "+group.name +"=>"+groupToUpdate.name+"\n";
    if(group.trainer.id!=groupToUpdate.trainer.id) warning+="[trener] "+group.trainer.name+" "+group.trainer.lastname +"=>"+groupToUpdate.trainer.name+" "+groupToUpdate.trainer.lastname+"\n";
    

    const apiUrl = "http://localhost:8080/api/groups";
    axios
      .put<Group>(
        apiUrl + "/" + group.id,
        {
          id: groupToUpdate.id,
          name: groupToUpdate.name,
          trainer:groupToUpdate.trainer.id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        if(warning.includes("[")) present(
          "Grupa je uspešno ažurirana.\n"+ warning,
          [{ text: "Ok" }]
        );else present(
          "Grupa je uspešno ažurirana.",
          [{ text: "Ok" }]
        );
        console.log("group updated: " + group);
      })
      .catch((error) => {
        console.log("Error while update group.Erorr: " + error);
      });
  };

  return (
    <IonCard className="entityCard">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding"><b>AŽURIRAJ GRUPU <br></br>ime: {group.name}<br></br>trener: {group.trainer.name} {group.trainer.lastname}</b></IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Naziv:</IonLabel>
                <IonInput
                  type="text"
                  ref={nameRef}
                  //onIonChange={(e) => setName(e.detail.value! )}
                  clearInput
                  value={group.name}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Trener:</IonLabel>
                <IonSelect
                  name="stage"
                 
                  onIonChange={(e) => setTrainer(e.detail.value!)}
                  
                >
                  {trainers.map((trainer, index) => (
                   
                      <IonSelectOption value={trainer} key={index} >
                        
                        {trainer.name+" "+trainer.lastname}
                      </IonSelectOption>
                    ))}
                </IonSelect>
              </IonItem>

              <IonButton
                expand="full"
                type="submit"
                onClick={updateGroup}
                color="grey"
                className="ion-padding"
              >
                Sačuvaj podatke
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};
export default UpdateGroupModal;
