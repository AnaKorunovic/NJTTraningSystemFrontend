import {
  IonContent,
  IonHeader,
  IonPage,
} from "@ionic/react";
import React from "react";
import NavBar from "../components/navigation/NavBar";
import Trainers from "../components/trainer/Trainers";

const TrainersPage: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <NavBar />
      </IonHeader>
      <IonContent fullscreen>
         <Trainers/>
      </IonContent>
    </IonPage>
  );
};

export default TrainersPage;