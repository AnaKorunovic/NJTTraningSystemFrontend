import React, { useEffect } from "react";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonMenuButton,
  IonRouterLink,
  IonNavLink,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import {
  logoFacebook,
  logoInstagram,
  logoTiktok,
  logoWhatsapp,
  logoYoutube,
} from "ionicons/icons";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import Trainers from "../trainer/Trainers";
import Groups from "../group/Groups";
import Members from "../member/Members";
import Appointments from "../appointments/Appointments";
//import { AccountPopover } from "../account/AccountPopover";

const NavBar: React.FC = () => {
  const [mQuery, setMQuery] = React.useState<any>({
    matches: window.innerWidth > 760,
  });
  const history = useHistory();
  const [present] = useIonAlert();

  useEffect(() => {
    let mediaQuery = window.matchMedia("(min-width: 760px)");
    mediaQuery.addListener(setMQuery);

    return () => mediaQuery.removeListener(setMQuery);
  }, []);
  const handleClick = () => {
    present("Uspešno ste se odjavili. Pozdrav.", [{ text: "Ok" }]);
   
    setTimeout(() => {
    localStorage.clear();
    history.push('/');
    }, 2500);
    

  };

  return (
    <div>
      
      <IonToolbar color="grey">
        <IonTitle size="large" slot="start" id="headertitle">
          <IonRouterLink color={"light"} href={"/home"}>
            <b>Teretana HIT</b>
          </IonRouterLink>
        </IonTitle>

        
            <IonButtons slot="start">
              <IonButton routerLink={"/trainers"}>
                <IonNavLink component={Trainers}><b>TRENERI </b></IonNavLink>
              </IonButton>
              <IonButton routerLink={"/groups"}>
              <IonNavLink component={Groups}><b>GRUPE </b></IonNavLink>
              </IonButton>
              <IonButton routerLink={"/members"}>
              <IonNavLink component={Members}> <b>ČLANOVI </b></IonNavLink>
              </IonButton>
              <IonButton routerLink={"/appointments"}>
              <IonNavLink component={Appointments}>  <b>TERMINI</b></IonNavLink>
              </IonButton>
              
            </IonButtons>
            <IonButton color="light" slot="end" onClick={() => handleClick()}>
                <b>Izloguj se</b>
              </IonButton>
      
      </IonToolbar>
    </div>
  );
};

export default NavBar;
