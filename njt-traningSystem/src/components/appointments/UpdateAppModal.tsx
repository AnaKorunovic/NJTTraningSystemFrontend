import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Group from "../../model/Group";
import Appointment from "../../model/Appointment";

const apiGroupUrl = "http://localhost:8080/api/groups";
const apiAppUrl = "http://localhost:8080/api/appointments";


const UpdateAppModal: React.FC<{ appointment: Appointment }> = ({
  appointment,
}) => {
  const workingHours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const [dateM, setDateM] = useState<String>(ourDate(appointment.date));
  const [group, setGroup] = useState<Group>(appointment.groupId);
  const [time, setTime] = useState(appointment.time);

  const [groups, setGroups] = useState(Array<Group>());
  const [present] = useIonAlert();

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

  const updateAppointment = () => {
    console.log(appointment.time + " " + time);
    console.log(appointment.groupId.id + " " + group.id);
    let warning = "Promenjeni su sledeći podaci: \n";
    if (time + ":00:00" != appointment.time)
      warning += "[vreme] " + appointment.time + "=>" + time + ":00:00" + "\n";
    if (appointment.groupId.id != group?.id)
      warning +=
        "[grupa] " + appointment.groupId.name + "=>" + group!.name + "\n";

    axios
      .put<Appointment>(
        apiAppUrl + "/" + appointment.id,
        {
          id: appointment.id,
          date: appointment.date,
          time: time != appointment.time ? time + ":00:00" : appointment.time,
          groupId: group.id,
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
        console.log("appointment updated: " + appointment);
        if (warning.includes("["))
          present("Termin je uspešno ažuriran.\n" + warning, [{ text: "Ok" }]);
        else present("Termin je uspešno ažuriran.", [{ text: "Ok" }]);
      })
      .catch((error) => {
        present("Neuspešno ažuriranje termina.", [{ text: "Ok" }]);
        console.log("Error while update appointment.Erorr: " + error);
      });
  };

  // function setDateTimeValue(val: string) {
  //   const text = new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
  //     Date.parse(val)
  //   );
  //   setDateM(val);
  //   document.getElementById("datetimeValue")!.innerText = text;

  // }

  // document.addEventListener("DOMContentLoaded", () => {
  //   if (datetime != null) setDateTimeValue(String(datetime));
  // });
  function ourDate(date: Date): String {
    const dateS = String(date).substring(0, String(date).indexOf("T"));
    const year = dateS.substring(0, 4);
    const month = dateS.substring(6, 7);
    const day = parseInt(dateS.substring(8, 10))+1;
    return day + "/" + +month + "/" + year;
  }

  return (
    <IonCard className="entityCard">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding">
          <b>Ažuriraj termin</b>
          <br />
          datum: {dateM}
          <br></br>
          vreme: {appointment.time}
          <br />
          grupa: {appointment.groupId.name}
        </IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Datum: {dateM} </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Vreme:</IonLabel>

                <IonSelect
                  name="time"
                  onIonChange={(e) => setTime(e.detail.value!)}
                  //value={appointment.time}
                >
                  {workingHours.map((i, index) => (
                    <IonSelectOption key={index}>{i}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Grupa:</IonLabel>
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
                onClick={updateAppointment}
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
export default UpdateAppModal;
