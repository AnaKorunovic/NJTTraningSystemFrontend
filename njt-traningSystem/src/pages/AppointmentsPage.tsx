import {
    IonContent,
    IonHeader,
    IonPage,
  } from "@ionic/react";
  import React from "react";
import Apps from "../components/appointments/Appointments";
  import NavBar from "../components/navigation/NavBar";

  const AppointmentsPage: React.FC = () => {
  
    return (
      <IonPage>
        <IonHeader>
          <NavBar />
        </IonHeader>
        <IonContent fullscreen>
           <Apps/>
        </IonContent>
      </IonPage>
    );
  };
  
  export default AppointmentsPage;