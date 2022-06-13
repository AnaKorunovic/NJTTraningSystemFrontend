import React, { Component, useEffect, useRef, useState } from "react";
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
import { useHistory } from "react-router";

const apiMemberUrl = "http://localhost:8080/api/members/add";
const apiGroupUrl = "http://localhost:8080/api/groups";

const AddMember: React.FC<{}> = () => {
  const nameRef = useRef<HTMLIonInputElement>(null);
  const lastnameRef = useRef<HTMLIonInputElement>(null);
  const numberRef = useRef<HTMLIonInputElement>(null);
  const jmbgRef = useRef<HTMLIonInputElement>(null);
  const [group, setGroup] = useState<Group>();

  const [groups, setGroups] = useState(Array<Group>());
  const [present] = useIonAlert();
  const history = useHistory();

  useEffect(() => {
    axios
      .get(apiGroupUrl, {
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

  const addMember = () => {
    let memberToAdd: Member = {
      id: 0,
      name: nameRef.current!.value ? (nameRef.current!.value as string) : "",
      lastname: lastnameRef.current!.value
        ? (lastnameRef.current!.value as string)
        : "",
      number: numberRef.current!.value
        ? (numberRef.current!.value as string)
        : "",
      jmbg: jmbgRef.current!.value ? (jmbgRef.current!.value as string) : "",
      user: Math.floor(Math.random() * 10),
      groupId: group!,
    };

    let warning = "";
    if (
      memberToAdd.name == "" ||
      memberToAdd.lastname == "" ||
      memberToAdd.jmbg == "" ||
      memberToAdd.number == "" ||
      memberToAdd.groupId == null
    ) {
      warning += "Nisu popunjeni svi zahtevani podaci za člana. \n";
      present(warning, [{ text: "Ok" }]);
      return;
    }

    axios
      .post(
        apiMemberUrl,
        {
          name: memberToAdd.name,
          lastname: memberToAdd.lastname,
          jmbg: memberToAdd.jmbg,
          number: memberToAdd.number,
          groupId: group!.id,
          user: localStorage.getItem("id"),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        console.log("member added " + memberToAdd.name);
        present(
          "Član " +
            memberToAdd.name +
            " " +
            memberToAdd.lastname +
            "je uspešno sačuvan.",
          [{ text: "Ok" }]
        );
        history.push(`/members`)
      })
      .catch((error) => {
        present("Neuspešno čuvanje člana. U bazi već postoji član sa unetim jmbg-om", [{ text: "Ok" }]);
        console.log(
          "Error while adding member. Erorr: " +
            error.response.request._response
        );
      });
  };

  return (
    <IonCard className="entityCardNoScroll">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding">
          <b>KREIRAJ ČLANA</b>
        </IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Ime:</IonLabel>
                <IonInput type="text" ref={nameRef} clearInput></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Prezime:</IonLabel>
                <IonInput type="text" ref={lastnameRef} clearInput></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Broj telefona:</IonLabel>
                <IonInput type="text" ref={numberRef} clearInput></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">JMBG:</IonLabel>
                <IonInput type="text" ref={jmbgRef} clearInput></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Grupa:</IonLabel>
                <IonSelect
                  name="group"
                  onIonChange={(e) => setGroup(e.detail.value!)}
                >
                  {groups.map((group, index) => (
                    <IonSelectOption value={group} key={index}>
                      {group.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonButton
                expand="full"
                type="submit"
                onClick={addMember}
                color="grey"
                className="ion-padding"
              >
                Sačuvaj podatke
              </IonButton>
              <IonButton
                expand="full"
                type="submit"
                onClick={() =>{
                  history.push(`/members`)
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
export default AddMember;
