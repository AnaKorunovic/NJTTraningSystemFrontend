import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSlide,
  IonSlides,
  IonText,
  IonTitle,
  useIonAlert,
} from "@ionic/react";
import axios from "axios";
import React, { useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router";
import NavBar from "../components/navigation/NavBar";

const registerUrl = "http://127.0.0.1:8080/api/users";

const Register: React.FC = () => {
  const [name, setName] = useState<string>();
  const [lastname, setLastname] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<string>();
  const [linkVisible, setLinkVisible] = useState<boolean>(false);
  

  const [present] = useIonAlert();
  const history = useHistory();
  const location = useLocation();

  function register() {
    if (!location.state) location.state = { from: { pathname: "/" } };
    axios
      .post(registerUrl, {
        name:name,
        lastname:lastname,
        email:email,
        username: username,
        password: password,
      })
      .then((response) => {
        setLinkVisible(true);

        present("Uspešno ste se registrovali.", [
          { text: "Ok" },
        ]);

        history.push("/login");
        console.log(response.data);
      })
      .catch((error) => {
        
        present("Registracija nije uspela.", [{ text: "Ok" }]);
        
        console.log(error);
      });
  }

  return (
    <IonPage className="ion-padding ion-text-center ion-center loginPage">
      <IonHeader>
        <IonTitle><b>REGISTRUJ SE</b></IonTitle>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol text-center color="grey">
              <IonList>
              <IonItem>
                  <IonLabel position="floating">Ime</IonLabel>
                  <IonInput
                    value={name}
                    onIonChange={(e) => setName(e.detail.value!)}
                    clearInput
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Prezime</IonLabel>
                  <IonInput
                    value={lastname}
                    onIonChange={(e) => setLastname(e.detail.value!)}
                    clearInput
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    clearInput
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Korisničko ime</IonLabel>
                  <IonInput
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                    clearInput
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Šifra</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton color="grey" onClick={register}>
                Kreiraj nalog!
              </IonButton>
            </IonCol>
            
          </IonRow>
        </IonGrid>
        {localStorage.getItem("token") && <Redirect to="/products" />}
      </IonContent>
    </IonPage>
  );
};

export default Register;
