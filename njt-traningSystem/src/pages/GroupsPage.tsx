import {
    IonContent,
    IonHeader,
    IonPage,
  } from "@ionic/react";
  import React from "react";
import Groups from "../components/group/Groups";
  import NavBar from "../components/navigation/NavBar";

  const GroupsPage: React.FC = () => {
  
    return (
      <IonPage>
        <IonHeader>
          <NavBar />
        </IonHeader>
        <IonContent fullscreen>
           <Groups/>
        </IonContent>
      </IonPage>
    );
  };
  
  export default GroupsPage;