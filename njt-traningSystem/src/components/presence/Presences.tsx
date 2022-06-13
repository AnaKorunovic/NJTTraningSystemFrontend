import React, { Component, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Appointment from "../../model/Appointment";
import Presence from "../../model/Presence";
import { useHistory} from "react-router";

const apiUrl = "http://localhost:8080/api/presences/appointment";

const Presences: React.FC<{ presences: Array<Presence>,app:Appointment }> = ({ presences,app }) => {
  const [present] = useIonAlert();
  const history = useHistory();

  function ourDate(date: Date) {
    const dateS = String(date).substring(0, String(date).indexOf("T"));
    const year = dateS.substring(0, 4);
    const month = dateS.substring(6, 7);
    const day = parseInt(dateS.substring(8, 10))+1;
    return day + "/" + +month + "/" + year;
  }
    return (
      <IonCard className="entityCardNoScroll">
        <IonCardTitle>
          <IonToolbar color="grey" className="ion-text-center ion-padding">
            <b>PRISUSTVO</b>
            <br />
            Datum: {ourDate(app.date)}
            <br />
            Vreme: {app.time}
            <br />
            Grupa: {app.groupId.name}
          </IonToolbar>
        </IonCardTitle>

        <IonCardContent>
          <IonGrid id="entityTable" class="ion-text-center">
            <IonRow id="entityTableHeader">
              <IonCol>Član</IonCol>
              <IonCol>Prisutan</IonCol>
              <IonCol>Opravdanje</IonCol>
            </IonRow>
            {presences.map((presence, i) => (
              <IonRow id="entityTableRows" key={i}>
                <IonCol>
                  {presence.member.name} {presence.member.lastname}
                </IonCol>
                <IonCol>
                  {presence.presence == false ? "nije prisutan" : "prisutan"}
                </IonCol>
                <IonCol>{presence.message}</IonCol>
              </IonRow>
            ))}
          
          </IonGrid>

          <IonRow>
          <IonCol size="2"></IonCol>
          <IonCol size="8">
            <IonButton
              color="grey"
              expand="full"
                className="ion-padding "
              onClick={() =>{
                history.push("/appointments")
                window.location.reload();
              } }
            >
              Zatvori
            </IonButton>
            </IonCol>
            <IonCol size="2"></IonCol>
            
          </IonRow>
        </IonCardContent>
      </IonCard>
    
    );
 
}
export default Presences;
