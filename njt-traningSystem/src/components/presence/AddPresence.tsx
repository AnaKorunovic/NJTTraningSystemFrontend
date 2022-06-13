import React, { useRef, useState } from "react";
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
  IonInput,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Appointment from "../../model/Appointment";
import Presence from "../../model/Presence";
import { useHistory, useParams } from "react-router";
import NavBar from "../navigation/NavBar";
import Member from "../../model/Member";


const AddPresence: React.FC<{
  appointment: Appointment;
  presences: Array<Presence>;
}> = ({ appointment, presences }) => {
  const [present] = useIonAlert();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  let index = new Number(id);
  let appToUse: Appointment;
  let members = Array<Member>();
  const [presenceYN, setPresenceYN] = useState<String>();
  let groupID = 0;
  const messageRef = useRef<HTMLIonInputElement>(null);

  function AddPresence() {
    console.log(presences);
    let modify = new Array();
    presences.map((p, i) => {
      const presenceDB = {
        message: p.message,
        presence: p.presence,
        member: p.member.id,
        appointment: p.appointment.id,
        user: localStorage.getItem("id"),
      };
      modify.push(presenceDB);
    });

    axios
      .post(
        "http://localhost:8080/api/presences/addList",
        {
          toAdd: modify,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        console.log("list of preseces added: " + response.data);
        present("Lista prisustva je uspešno sačuvana.", [{ text: "Ok" }]);
        history.push("/appointments");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        present("Neuspešno čuvanje liste prisustva.", [{ text: "Ok" }]);
        console.log(
          "Error while adding presences. Erorr: " +
            error.response.request._response
        );
      });
  }

  function ourDate(date: Date) {
    const dateS = String(date).substring(0, String(date).indexOf("T"));
    const year = dateS.substring(0, 4);
    const month = dateS.substring(6, 7);
    const day = parseInt(dateS.substring(8, 10)) + 1;
    return day + "/" + +month + "/" + year;
  }
  return (
    <IonPage>
      <IonHeader>
        <NavBar />
      </IonHeader>
      <IonContent fullscreen>
        <IonCard className="entityCardNoScroll">
          <IonCardTitle>
            <IonToolbar color="grey" className="ion-text-center ion-padding">
              <b>PRISUSTVO</b>
              <br />
              Datum: {ourDate(appointment.date)}
              <br />
              Vreme: {appointment.time}
              <br />
              Grupa: {appointment.groupId.name}
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
                    <IonSelect
                      name="presence"
                      onIonChange={(e) => {
                        if (e.detail.value! == "prisutan")
                          presences[i].presence = true;
                        if (e.detail.value! == "nije prisutan")
                          presences[i].presence = false;
                      }}
                    >
                      <IonSelectOption value={presenceYN} key={1}>
                        {"prisutan"}
                      </IonSelectOption>
                      <IonSelectOption value={presenceYN} key={2}>
                        {"nije prisutan"}
                      </IonSelectOption>
                    </IonSelect>
                  </IonCol>
                  <IonCol>
                    <IonInput
                      type="text"
                      ref={messageRef}
                      clearInput
                      onIonChange={(e) => {
                        presences[i].message = messageRef.current!.value
                          ? (messageRef.current!.value as string)
                          : "nema komentara";
                      }}
                    ></IonInput>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
            <IonRow id="btnPersistance">
              <IonCol>
                <IonButton
                  color="grey"
                  expand="full"
                  className="ion-padding "
                  onClick={() => AddPresence()}
                >
                  Sačuvaj
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  color="grey"
                  expand="full"
                  className="ion-padding "
                  onClick={() => {
                    history.push("/appointments")
                  window.location.reload()}
                  }>
                  Odustani
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
  
};
export default AddPresence;
