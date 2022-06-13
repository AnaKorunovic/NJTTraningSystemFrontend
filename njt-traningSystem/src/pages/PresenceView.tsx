import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  useIonAlert,
} from "@ionic/react";
import Appointment from "../model/Appointment";
import axios from "axios";
import Presence from "../model/Presence";
import NavBar from "../components/navigation/NavBar";
import Presences from "../components/presence/Presences";
import Group from "../model/Group";

const apiUrl = "http://localhost:8080/api/presences/appointment";
const apiAppUrl="http://localhost:8080/api/appointments";

const PresenceView: React.FC = () => {
  const [presences, setPresences] = useState(Array<Presence>());
  const [present] = useIonAlert();
  const history = useHistory();
  const [app, setApp] = useState<Appointment>();
  const { id } = useParams<{ id: string }>(); //this is appointement id
  let index = new Number(id);

  useEffect(() => {
    axios
      .get<Appointment>(apiAppUrl + "/" + index, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
          setApp(response.data);
         
        
      })
      .catch((error) => {
        console.log("Error while sending get request for app:" + error);
      });
    axios
      .get<Array<Presence>>(apiUrl + "/" + index, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        console.log("id: " + { index });
        if (response.data.length == 0) {
          present("Ne postoji evidentirano prisustvo za ovaj termin.", [
            { text: "Ok" },
          ]);
          history.push(`/presences/add/${id}`);
          
        } else {
          setPresences(response.data);
          console.log("sadds" + presences);
          present("Postoji evidentirano prisustvo za ovaj termin.", [
            { text: "Ok" },
          ]);
        }
      })
      .catch((error) => {
        console.log("Error while sending get request for presences:" + error);
      });
     
  }, []);

  if (presences.length>0 && app)
    return (
      <IonPage>
        <IonHeader>
          <NavBar />
        </IonHeader>
        <IonContent fullscreen>
          <Presences presences={presences} app={app} />
        </IonContent>
      </IonPage>
    );

  return (
    <IonPage>
      <IonHeader>
        <NavBar />
      </IonHeader>
      <IonContent>
        {/* <IonTitle>Cannot load presences with appointement: {id}</IonTitle> */}
      </IonContent>
    </IonPage>
  );
};

export default PresenceView;
