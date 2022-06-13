import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Member from "../../model/Member";
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
import Group from "../../model/Group";

const UpdateMemberModal: React.FC<{ member: Member }> = ({ member }) => {

  useEffect(() => {
    console.log("Member send to update: " + member.id);
  }, []);

  const nameRef = useRef<HTMLIonInputElement>(null);
  const lastnameRef = useRef<HTMLIonInputElement>(null);
  const jmbgRef = useRef<HTMLIonInputElement>(null);
  const numberRef = useRef<HTMLIonInputElement>(null);

  const [group, setGroup] = useState<Group>();
const [groups, setGroups] = useState(Array<Group>());
const [present] = useIonAlert();

useEffect(() => {
  axios
    .get("http://localhost:8080/api/groups", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Access-Control-Allow-Origin": "*",
      },
    })
    .then((response) => {
      setGroups(response.data);

      console.log("Groups after get request-Length: " + groups.length);
    })
    .catch((error) => {
      console.log("Error while sending get request for Groups:" + error);
    });

    
}, []);

  const updateMember = () => {
    let memberToUpdate: Member = {
      id: member.id,
      name: nameRef.current!.value
        ? (nameRef.current!.value as string)
        : member.name,
      lastname: lastnameRef.current!.value
        ? (lastnameRef.current!.value as string)
        : member.lastname,
      jmbg: jmbgRef.current!.value
        ? (jmbgRef.current!.value as string)
        : member.jmbg,
      number: numberRef.current!.value
        ? (numberRef.current!.value as string)
        : member.number,
      //  user: authentication.authenticatedUser?.id ||
      //      Math.floor(Math.random() * 10),
      user: member.user,
      groupId:group ? group :member.groupId
    };

    let warning="Promenjeni su sledeći podaci: \n";
    if(member.name!=memberToUpdate.name) warning+="[ime] "+member.name +"=>"+memberToUpdate.name+"\n";
    if(member.lastname!=memberToUpdate.lastname) warning+="[prezime] "+member.lastname +"=>"+memberToUpdate.lastname+"\n";
    if(member.jmbg!=memberToUpdate.jmbg) warning+="[jmbg] "+member.jmbg +"=>"+memberToUpdate.jmbg+"\n";
    if(member.number!=memberToUpdate.number) warning+="[broj telefona] "+member.number +"=>"+memberToUpdate.number+"\n";
    if(member.groupId.id!=memberToUpdate.groupId.id) warning+="[grupa] "+member.groupId.name +"=>"+memberToUpdate.groupId.name+"\n";
   

    const apiUrl = "http://localhost:8080/api/members";
    axios
      .put<Member>(
        apiUrl + "/" + member.id,
        {
          id: memberToUpdate.id,
          name: memberToUpdate.name,
          lastname: memberToUpdate.lastname,
          number: memberToUpdate.number,
          jmbg: memberToUpdate.jmbg,
          groupId:memberToUpdate.groupId.id,
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
        if(warning.includes("[")) present(
          "Član je uspešno ažuriran.\n"+ warning,
          [{ text: "Ok" }]
        );else present(
          "Član je uspešno ažuriran.",
          [{ text: "Ok" }]
        );
        console.log("member updated: " + member);
      })
      .catch((error) => {
        console.log("Error while update member.Erorr: " + error);
      });
  };

  return (
    <IonCard className="entityCard">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding"><b>AŽURIRAJ ČLANA</b> <br/>
         ime:{member.name}<br/>
          prezime:{member.lastname}<br/>
          grupa:{member.groupId.name}</IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Ime:</IonLabel>
                <IonInput
                  type="text"
                  ref={nameRef}
                  clearInput
                  value={member.name}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Prezime:</IonLabel>
                <IonInput
                  type="text"
                  ref={lastnameRef}
                  clearInput
                  value={member.lastname}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">jmbg:</IonLabel>
                <IonInput
                  type="text"
                  ref={jmbgRef}
                  clearInput
                  value={member.jmbg}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Broj telefona:</IonLabel>
                <IonInput
                  type="text"
                  ref={numberRef}
                  clearInput
                  value={member.number}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Grupa:</IonLabel>
                <IonSelect
                  name="group"
                 
                  onIonChange={(e) => setGroups(e.detail.value!)}
                  
                >
                  {groups.map((group, index) => (
                   
                      <IonSelectOption value={group} key={index} >
                        
                        {group.name}
                      </IonSelectOption>
                    ))}
                </IonSelect>
              </IonItem>

              <IonButton
                expand="full"
                type="submit"
                onClick={updateMember}
                color="grey"
              >
                Sacuvaj podatke
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};
export default UpdateMemberModal;
