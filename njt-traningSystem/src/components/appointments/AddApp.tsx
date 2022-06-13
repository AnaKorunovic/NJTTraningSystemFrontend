import React, { Component, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonDatetime,
  IonGrid,
  IonItem,
  IonLabel,
  IonNote,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Group from "../../model/Group";
import { useHistory } from "react-router";

const apiAppUrl = "http://localhost:8080/api/appointments/add";
const apiGroupUrl="http://localhost:8080/api/groups";

const AddApp: React.FC<{}> = () => {
  const currentDate = new Date();
  const currentDateString = new String(currentDate.toISOString());
  const today = currentDateString.substring(0, currentDateString.indexOf("T"));
  // const maxDate=(new Date()).setDate(currentDate.getDate()+30);
  // const maxDateString=new String(maxDate);
  // const max=(maxDateString).substring(0, maxDateString.indexOf("T"));
  const workingHours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const datetimeValue = document.querySelector("#datetimeValue");
  const datetime = document.querySelector("#datetime");
  const [dateM, setDateM] = useState<String>("");

  const [group, setGroup] = useState<Group>();
  const [time, setTime] = useState(10);
  const [groups, setGroups] = useState(Array<Group>());
  const [present] = useIonAlert();
  const history=useHistory();

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

  function setDateTimeValue(val: string) {
    const text = new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
      Date.parse(val)
    );
    setDateM(val);
    document.getElementById("datetimeValue")!.innerText = text;
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (datetime != null) setDateTimeValue(String(datetime));
  });

  const addApp = () => {
    let warning = "";
    if (dateM == "") warning += "Niste izabrali datum termina.\n";
    if (group == null) warning += "Niste odredili grupu za termin.";
    if (warning != "") {
      present(warning, [{ text: "Ok" }]);
      return;
    }
    axios
      .post(
        apiAppUrl,
        {
          date: dateM ? new Date(dateM + "") : new Date(),
          time: time ? time + ":00:00" : "10:00:00",
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
        console.log("Appointment added.");
        present("Termin je uspešno sačuvan.", [{ text: "Ok" }]);
        history.push("/appointments")
      })
      .catch((error) => {
        present("Neuspešno čuvanje termina.", [{ text: "Ok" }]);
        console.log(
          "Error while adding Appointment. Erorr: " +
            error.response.request._response
        );
      });
  };

  return (
    <IonCard className="entityCardNoScroll">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding">
          <b>KREIRANJE TERMINA</b>
        </IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonAccordionGroup>
                  <IonAccordion value="start">
                    <IonItem slot="header">
                      <IonLabel>Datum:</IonLabel>
                      <IonNote slot="end" id="datetimeValue"></IonNote>
                    </IonItem>
                    <IonDatetime
                      id="datetime"
                      slot="content"
                      presentation="date"
                      min={today}
                      max="2022-10-20"
                      onIonChange={(e) => {
                        setDateTimeValue(e.detail.value!);
                      }}
                    ></IonDatetime>
                  </IonAccordion>
                </IonAccordionGroup>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Vreme:</IonLabel>
                <IonSelect
                  name="time"
                  onIonChange={(e) => setTime(e.detail.value!)}
                >
                  {workingHours.map((i, index) => (
                    <IonSelectOption value={group} key={index}>
                      {i}
                    </IonSelectOption>
                  ))}
                </IonSelect>
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
                onClick={addApp}
                color="grey"
                className="ion-padding"
              >
                Sačuvaj podatke
              </IonButton>
              <IonButton
                expand="full"
                type="submit"
                onClick={() =>{
                  history.push(`/appointments`)
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
export default AddApp;
