import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonAlert,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonAccordionGroup,
  IonNote,
  IonLabel,
  IonDatetime,
  IonAccordion,
} from "@ionic/react";
import Appointment from "../../model/Appointment";
import { Link, useHistory } from "react-router-dom";
import AddAppModal from "./AddApp";
import UpdateAppModal from "./UpdateAppModal";
import Group from "../../model/Group";

const apiAppUrl = "http://localhost:8080/api/appointments";
const apiGroupUrl = "http://localhost:8080/api/groups";

const Appointments: React.FC = () => {
  const [present] = useIonAlert();
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [groups, setGroups] = useState(Array<Group>());

  const [apps, setApps] = useState(Array<Appointment>());
  const [filteredApps, setFilteredApps] = useState(Array<Appointment>());
  const [selectedApp, setSelectedApp] = useState<Appointment>();
  //const [searchDate, setSearchDate] = useState<String>("");
  const [searchGroup, setSearchGroup] = useState<Group>();
  const history = useHistory();

  // const currentDateString = new String((new Date()).toISOString());
  // const today = currentDateString.substring(0, currentDateString.indexOf("T"));

  // const datetimeValue = document.querySelector("#datetimeValue");
  // const datetime = document.querySelector("#datetime");

  useEffect(() => {
    axios
      .get<Array<Appointment>>(apiAppUrl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        console.log(
          "Returned Appontments from database. Array: " + response.data
        );
        setApps(response.data);
        setFilteredApps(response.data);
      })
      .catch((error) => {
        console.log(
          "Error while sending get request for Appointments:" + error
        );
        setApps([]);
        setFilteredApps([]);
      });

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

  const deleteApp = (appToDelete: Appointment) => {
    const currentAppointments = apps;
    setApps(
      currentAppointments.filter(
        (appointment) => appointment.id !== appToDelete.id
      )
    );

    axios
      .delete(apiAppUrl + "/" + appToDelete.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        present(
          "Termin " +
            appToDelete.date +
            "[" +
            appToDelete.time +
            "] " +
            " je uspešno obrisan",
          [{ text: "Ok" }]
        );
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      })
      .catch((error) => {
        setApps(currentAppointments);
        present(
          "Neuspešno brisanje termina " +
            appToDelete.date +
            "[" +
            appToDelete.time +
            "]",
          [{ text: "Ok" }]
        );
      });
  };

  const filterApps = (date: number, group: number, id: number) => {
    //id=1 za filtriraj dugme
    //id-2 za ukloni filter
    //date/number =0 nije uljuceno =1ukljuceno
    const original = apps;
    if (id == 2) {
      setFilteredApps(original);
    }
    if (group == 1 && id == 1 && searchGroup == null) {
      present("Nije izabrana grupa za pretragu.", [{ text: "Ok" }]);
      return;
    }
    if (group == 1) {
      let filtered = [];
      filtered = apps.filter((appointment) => {
        return appointment.groupId.name == searchGroup?.name;
      });
      setFilteredApps(filtered);
      if (filtered.length == 0)
        present("Ne postoje termini sa unetom grupom.", [{ text: "Ok" }]);
    }
    // if(date==1){
    //   let filtered = [];
    //       filtered = apps.filter((appointment) => {
    //         return appointment.date==new Date(searchDate+"");
    //       });
    //       setFilteredApps(filtered);

    // }
  };
  // function setDateTimeValue(val: string) {

  //   const text = new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
  //     Date.parse(val)
  //   );
  //   setSearchDate(val);
  //   document.getElementById("datetimeValue")!.innerText = text;
  // }

  // document.addEventListener("DOMContentLoaded", () => {
  //   if (datetime != null) setDateTimeValue(String(datetime));
  // });

  function ourDate(date: Date) {
    const dateS = String(date).substring(0, String(date).indexOf("T"));
    const year = dateS.substring(0, 4);
    const month = dateS.substring(5, 7);
    const day = parseInt(dateS.substring(8, 10))+1;
    return day + "/" + month + "/" + year;
  }

  return (
    <>
      <IonToolbar className="ion-margin">
        <IonTitle id="entityPageTitle" class="ion-text-center">
          Termini
        </IonTitle>
        <IonRow id="entityFilter">
          <IonCol>
            {/* <IonItem  id="inputSearch" >
                <IonAccordionGroup>
                  <IonAccordion value="start">
                    <IonItem slot="header">
                      <IonLabel>Datum</IonLabel>
                      <IonNote slot="end" id="datetimeValue"></IonNote>
                    </IonItem>
                    <IonDatetime 
                      id="datetime"
                      className="searchDate"
                      slot="content"
                      presentation="date"
                      min={today}
                      max="2022-10-20"
                      onIonChange={(e) => {
    
                        setDateTimeValue(e.detail.value!)
                      }}
                    ></IonDatetime>
                  </IonAccordion>
                </IonAccordionGroup>
              </IonItem>
             */}
            <IonItem id="search">
              <IonSelect
                name="group"
                id="inputSearchGroup"
                placeholder="grupa"
                onIonChange={(e) => setSearchGroup(e.detail.value!)}
              >
                {groups.map((group, index) => (
                  <IonSelectOption value={group} key={index}>
                    {group.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonCol>
          <IonCol>
            {/* <IonButton
              style={{ margin: "0.2em", marginLeft: "-15.5em" }}
              color="grey"
              onClick={() => filterApps(1,0, 1,)}
            >
              Filtriraj po datumu
            </IonButton> */}
            <IonButton
              style={{ margin: "0.2em", marginLeft: "-15.5em" }}
              color="grey"
              onClick={() => filterApps(0, 1, 1)}
            >
              Filtriraj po grupi
            </IonButton>
            <IonButton
              style={{ margin: "0.2em", marginLeft: "1em" }}
              color="grey"
              onClick={() => filterApps(1, 0, 2)}
            >
              Ukloni filter
            </IonButton>
          </IonCol>

          <IonCol size="3">
            <IonButton
              onClick={() => {
                history.push("/appointments/add");
                window.location.reload();
              }}
              color="grey"
              class="ion-text-end"
              className="entityPageButton"
            >
              Dodaj novi termin
            </IonButton>
          </IonCol>
        </IonRow>
      </IonToolbar>

      <IonGrid id="entityTable" class="ion-text-center">
        <IonRow id="entityTableHeader">
          <IonCol>Id</IonCol>
          <IonCol>Datum</IonCol>
          <IonCol>Vreme</IonCol>
          <IonCol>Grupa</IonCol>
          <IonCol>Prisustvo</IonCol>
          <IonCol>Izmeni</IonCol>
          <IonCol>Obrisi</IonCol>
        </IonRow>
        {filteredApps.map((appointment, i) => (
          <IonRow id="entityTableRows" key={i}>
            <IonCol>{appointment.id}</IonCol>
            <IonCol>{ourDate(appointment.date)}</IonCol>
            <IonCol>{appointment.time}</IonCol>
            <IonCol>{appointment.groupId.name}</IonCol>
            {/* <IonModal
              onIonModalDidDismiss={() => {
                setShowModalPresence(false);
              }}
              isOpen={showModalPresence}
            >
               <Presences
                appointment={
                  selectedApp == undefined ?appointment : selectedApp
                }
              /> 
              <IonButton
                color="grey"
                id="btnCloseModal"
                onClick={() => {
                  setShowModalPresence(false)
                  window.location.reload();
                }}
              >
                Zatvori
              </IonButton>
            </IonModal>  */}
            <IonCol>
              {/* <IonButton
                color="medium"
                onClick={() => {
                  setSelectedApp(appointment);
                  setShowModalPresence(true);
                  
                }}
              > 
                Pogledaj
              </IonButton> */}
              <IonButton
                color="medium"
                onClick={() => history.push(`presences/${appointment.id}`)}
              >
                Pogledaj
              </IonButton>
            </IonCol>

            <IonModal
              onIonModalDidDismiss={() => {
                setShowModalUpdate(false);
              }}
              isOpen={showModalUpdate}
            >
              <UpdateAppModal
                appointment={
                  selectedApp == undefined ? appointment : selectedApp
                }
              />
              <IonButton
                color="grey"
                id="btnCloseModal"
                onClick={() => {
                  setShowModalUpdate(false);
                  window.location.reload();
                }}
              >
                Zatvori
              </IonButton>
            </IonModal>
            <IonCol>
              <IonButton
                color="medium"
                onClick={() => {
                  setShowModalUpdate(true);
                  console.log("click update sa id " + appointment.id);
                  setSelectedApp(appointment);
                }}
              >
                Izmeni
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color="danger" onClick={() => deleteApp(appointment)}>
                Obriši
              </IonButton>
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>

      {localStorage.getItem("token") === null && <Link to="/login" />}
    </>
  );
};
export default Appointments;
