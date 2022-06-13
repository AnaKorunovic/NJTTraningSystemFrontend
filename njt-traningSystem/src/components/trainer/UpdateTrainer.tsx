import React, { useEffect, useRef } from "react";
import axios from "axios";
import Trainer from "../../model/Trainer";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useParams } from "react-router";

const apiTrainerUrl = "http://localhost:8080/api/trainers";

const UpdateTrainerModal: React.FC<{ trainer: Trainer }> = ({ trainer }) => {


  useEffect(() => {
    console.log("Trainer send to update: " + trainer.id);
  }, []);


  const nameRef = useRef<HTMLIonInputElement>(null);
  const lastnameRef = useRef<HTMLIonInputElement>(null);
  const emailRef = useRef<HTMLIonInputElement>(null);
  const numberRef = useRef<HTMLIonInputElement>(null);
  const [present] = useIonAlert();

  const updateTrainer = () => {
    let trainerToUpdate: Trainer = {
      id: trainer.id,
      name: nameRef.current!.value
        ? (nameRef.current!.value as string)
        : trainer.name,
      lastname: lastnameRef.current!.value
        ? (lastnameRef.current!.value as string)
        : trainer.lastname,
      email: emailRef.current!.value
        ? (emailRef.current!.value as string)
        : trainer.email,
      number: numberRef.current!.value
        ? (numberRef.current!.value as string)
        : trainer.number,
     
      user: trainer.user,
    };

    let warning="Promenjeni su sledeći podaci: \n";
    if(trainer.name!=trainerToUpdate.name) warning+="[ime] "+trainer.name +"=>"+trainerToUpdate.name+"\n";
    if(trainer.lastname!=trainerToUpdate.lastname) warning+="[prezime] "+trainer.lastname +"=>"+trainerToUpdate.lastname+"\n";
    if(trainer.email!=trainerToUpdate.email) warning+="[email] "+trainer.email +"=>"+trainerToUpdate.email+"\n";
    if(trainer.number!=trainerToUpdate.number) warning+="[broj telefona] "+trainer.number +"=>"+trainerToUpdate.number+"\n";
   

   
    axios
      .put<Trainer>(
        apiTrainerUrl + "/" + trainer.id,
        {
          id: trainerToUpdate.id,
          name: trainerToUpdate.name,
          lastname: trainerToUpdate.lastname,
          number: trainerToUpdate.number,
          email: trainerToUpdate.email,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        if(warning.includes("[")) present(
          "Trener je uspešno ažuriran.\n"+ warning,
          [{ text: "Ok" }]
        );else present(
          "Trener je uspešno ažuriran.",
          [{ text: "Ok" }]
        );
        console.log("Trainer updated: " + trainer);
      })
      .catch((error) => {
        present(
          "Neuspešno ažuriranje trenera.",
          [{ text: "Ok" }]
        );
        console.log("Error while update trainer.Erorr: " + error);
      });
  };

  return (
    <IonCard className="entityCard">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding"><b>Ažuriraj trenera</b><br/>
          ime: {trainer.name}<br></br> 
          prezime:{trainer.lastname}<br/></IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Ime:</IonLabel>
                <IonInput
                  type="text"
                  ref={nameRef}
                  clearInput
                  value={trainer.name}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Prezime:</IonLabel>
                <IonInput
                  type="text"
                  ref={lastnameRef}
                  clearInput
                  value={trainer.lastname}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Email:</IonLabel>
                <IonInput
                  type="text"
                  ref={emailRef}
                  clearInput
                  value={trainer.email}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Broj telefona:</IonLabel>
                <IonInput
                  type="text"
                  ref={numberRef}
                  clearInput
                  value={trainer.number}
                ></IonInput>
              </IonItem>

              <IonButton
                expand="full"
                type="submit"
                onClick={updateTrainer}
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
export default UpdateTrainerModal;
