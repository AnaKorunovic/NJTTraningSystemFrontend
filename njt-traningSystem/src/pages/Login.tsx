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
  IonText,
  IonTitle,
  useIonAlert,
} from "@ionic/react";
import React, { useState } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";

const loginUrl = "http://127.0.0.1:8080/authenticate";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<string>();

  const [present] = useIonAlert();

  const history = useHistory();
  const location = useLocation();

  function login() {
    if (!location.state) location.state = { from: { pathname: "/" } };
    axios
      .post(loginUrl, {
        username: username,
        password: password,
      })
      .then((response) => {
        setToken(response.data.token );
        console.log(response.data.token)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('id', response.data.id);

        present("Uspešno ste se ulogovali. Dobrodošao "+username+".", [{ text: "Ok" }]);

        history.push('/trainers');
        console.log("Going back after login");
      console.log(response.data)
    }).catch((error) => {
      setError("Credentials not valid");
      present("Neispravno uneti podaci.", [{ text: "Ok" }]);
      setTimeout(() => {
        setError('' );
      }, 1500);
      console.log(error);

    })
  }

  return (
    <IonPage className="ion-padding ion-text-center ion-center loginPage">

      <IonHeader>
        <IonTitle className="ion-padding"><b>PRIJAVI SE</b></IonTitle>
      </IonHeader>
      <IonContent fullscreen>

        <IonGrid >
          <IonRow >
            <IonCol text-center color="grey">
              <IonList>
                <IonItem >
                  <IonLabel position="floating">Korisničko ime</IonLabel>
                  <IonInput
                    value={username}
                    onIonChange={(e) => setUsername(e.detail.value!)}
                    clearInput
                  ></IonInput>
                </IonItem>
                <IonItem >
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
            <IonButton color="grey" onClick={login}>
                  Prijavi se!
                </IonButton>
            </IonCol>
            <IonCol id="registerLink">
              <IonText>
                Ukoliko nemate nalog,
                <a href="/register"> registrujte se ovde.</a></IonText></IonCol>
          </IonRow>
        </IonGrid>
        {localStorage.getItem('token') && <Redirect to="/trainers" />}
      </IonContent>
    </IonPage>
  );
};

export default Login;
