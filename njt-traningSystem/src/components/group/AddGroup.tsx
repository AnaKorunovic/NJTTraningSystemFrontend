import React, { useEffect, useState } from "react";
import axios from "axios";
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
  IonSelectOption,
  IonRow,
  IonSelect,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Trainer from "../../model/Trainer";
import { useHistory } from "react-router";

const apiGroupUrl = "http://localhost:8080/api/groups/add";
const apiTrainerUrl="http://localhost:8080/api/trainers";

const AddGroup: React.FC<{}> = () => {

  const [name, setName] = useState<string>();
  const [trainer, setTrainer] = useState<Trainer>();
  const [present] = useIonAlert();
  const [trainers, setTrainers] = useState(Array<Trainer>());
  const history=useHistory();

  useEffect(() => {
    //ucitavanje trenera
    axios
      .get(apiTrainerUrl, {
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

  const addGroup = () => {
    if(name=="" || trainer==null) {
      present("Potrebno je da popunite sva zahtevana polja.", [{ text: "Ok" }]);
    return;
    }
    axios
      .post(
        apiGroupUrl,
        {
          name: name!,
          trainer: trainer!.id,
          user: localStorage.getItem('id'),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        console.log("group added " + name);
        present("Grupa "+ name+" je uspešno sačuvana.", [{ text: "Ok" }]);
        history.push("/groups");
      })
      .catch((error) => {
        present("Neuspešno čuvanje grupe. U bazi već postoji grupa sa unetim nazivom.", [{ text: "Ok" }]);
        console.log(
          "Error while adding group. Erorr: " + error.response.request._response
        );
      });
  };

  return (
    <IonCard className="entityCardNoScroll">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding"><b>KREIRAJ GRUPU</b></IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Naziv:</IonLabel>
                <IonInput
                  type="text"
                  onIonChange={(e) => setName(e.detail.value!)}
                  clearInput
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Trener</IonLabel>
                <IonSelect
                  name="stage"
                  onIonChange={(e) => setTrainer(e.detail.value!)}
                >
                  {trainers.map((trainer, index) => (
                    <IonSelectOption value={trainer} key={index}>
                      {trainer.name + " " + trainer.lastname}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonButton
                expand="full"
                type="submit"
                onClick={addGroup}
                color="grey"
                className="ion-padding"
              >
                Sačuvaj podatke
              </IonButton>
              <IonButton
                expand="full"
                type="submit"
                onClick={() =>{
                  history.push(`/groups`)
                  window.location.reload();
                } }
                color="grey"
                className="ion-padding"
              >
                Odustani
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};
export default AddGroup;
