import {
    IonContent,
    IonHeader,
    IonPage,
  } from "@ionic/react";
  import React from "react";
import Members from "../components/member/Members";
  import NavBar from "../components/navigation/NavBar";

  const MembersPage: React.FC = () => {
  
    return (
      <IonPage>
        <IonHeader>
          <NavBar />
        </IonHeader>
        <IonContent fullscreen>
           <Members/>
        </IonContent>
      </IonPage>
    );
  };
  
  export default MembersPage;