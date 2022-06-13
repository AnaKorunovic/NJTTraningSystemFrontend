import React, {  useRef} from "react";
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
import { useHistory } from "react-router";

const apiTrainerUrl = "http://localhost:8080/api/trainers";


const AddTrainer: React.FC<{}> = () => {

  const nameRef = useRef<HTMLIonInputElement>(null);
  const lastnameRef = useRef<HTMLIonInputElement>(null);
  const emailRef = useRef<HTMLIonInputElement>(null);
  const numberRef = useRef<HTMLIonInputElement>(null);
  const [present] = useIonAlert();
  const history = useHistory();

  const AddTrainer = () => {
    let trainerToAdd: Trainer = {
      id: 0,
      name: nameRef.current!.value ? (nameRef.current!.value as string) : "",
      lastname: lastnameRef.current!.value
        ? (lastnameRef.current!.value as string)
        : "",
      email: emailRef.current!.value ? (emailRef.current!.value as string) : "",
      number: numberRef.current!.value
        ? (numberRef.current!.value as string)
        : "",
      user: Math.floor(Math.random() * 10),
    };

    let warning="";
    if(trainerToAdd.name=="" || trainerToAdd.lastname=="" ||
    trainerToAdd.email=="" || trainerToAdd.number=="") {warning+="Nisu popunjeni svi zahtevani podaci za trenera. \n";
    present(
      warning,
      [{ text: "Ok" }]
    );

    return;
    }

    axios
      .post(
        apiTrainerUrl,
        {
          name: trainerToAdd.name,
          lastname: trainerToAdd.lastname,
          number: trainerToAdd.number,
          email: trainerToAdd.email,
          user: localStorage.getItem('id'),
         
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        console.log("Trainer added " + trainerToAdd.name);
        present(
            "Trener "+nameRef.current!.value+" "+lastnameRef.current!.value+" je uspešno sačuvan.",
            [{ text: "Ok" }]
          );
          history.push("/trainers")
        
         
      })
      .catch((error) => {
        console.log(
          "Error while adding trainer. Erorr: " +
            error.response.request._response
        );
        present(
          "Neuspešno čuvanje trenera. U bazi već postoji trener sa istim brojem telefona i email-om",
          [{ text: "Ok" }]
        );
      });
  };

  return (
    <IonCard className="entityCardNoScroll">
      <IonCardTitle>
        <IonToolbar color="grey" className="ion-text-center ion-padding"><b>KREIRAJ TRENERA</b></IonToolbar>
      </IonCardTitle>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Ime:</IonLabel>
                <IonInput
                  type="text"
                  ref={nameRef}
                  //onIonChange={(e) => setName(e.detail.value! )}
                  clearInput
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Prezime:</IonLabel>
                <IonInput
                  type="text"
                  ref={lastnameRef}
                  // onIonChange={(e) => setLastname(e.detail.value!)}
                  clearInput
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Email:</IonLabel>
                <IonInput
                  type="text"
                  ref={emailRef}
                  // onIonChange={(e) => setEmail(e.detail.value!)}
                  clearInput
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Broj telefona:</IonLabel>
                <IonInput
                  type="text"
                  ref={numberRef}
                  // onIonChange={(e) => setNumber(e.detail.value!)}
                  clearInput
                ></IonInput>
              </IonItem>

              <IonButton
                expand="full"
                type="submit"
                onClick={AddTrainer}
                color="grey"
                className="ion-padding"
              >
                Sačuvaj podatke
              </IonButton>
              <IonButton
                expand="full"
                type="submit"
                onClick={() => history.push(`/trainers`)}
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
export default AddTrainer;
