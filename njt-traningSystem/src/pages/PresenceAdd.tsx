import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import {IonContent, IonHeader, IonPage, IonTitle, useIonAlert} from "@ionic/react";
import Appointment from "../model/Appointment";
import axios from "axios";
import Presence from "../model/Presence";
import NavBar from "../components/navigation/NavBar";
import Member from "../model/Member";
import AddPresence from "../components/presence/AddPresence";

const apiUrl = "http://localhost:8080/api/presences/appointment";
const apiAppUrl="http://localhost:8080/api/appointments";

const PresenceAdd: React.FC = () => {
    const [presences, setPresences] = useState(Array<Presence>());
    const [present] = useIonAlert();
    const history = useHistory();
    const [app,setApp]=useState<Appointment>(); 
    const {id} = useParams<{ id: string }>(); //this is appointement id
    let index=new Number(id);
    let appToUse:Appointment;
    let groupID=0;
    let members=Array<Member>();

    useEffect(() => {
        console.log('add pres '+index)
        axios
          .get<Appointment>(apiAppUrl+"/"+index, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Access-Control-Allow-Origin": "*",
            },
          })
          .then((response) => {
            setApp(response.data);
            appToUse=response.data;
            console.log(response.data.groupId.id)
            groupID=response.data.groupId.id;
            console.log("Returned app with group id: "+groupID)
            getMembers(groupID);
            
          })
          .catch((error) => {
            console.log("Error while sending get request for Appointment:" + error);
          });
    }, []);

    function getMembers(id:number) {
        console.log("loading memebers" );
        axios
          .get<Array<Member>>(`http://localhost:8080/api/members/group/${id}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Access-Control-Allow-Origin": "*",
            },
          })
          .then((response) => {
            console.log(response.data);
            members=response.data;;
            if (response.data.length == 0) {
              present("Ne postoje članovi u grupi.", [
                { text: "Ok" },
              ]);
              console.log("members list is empty")
              history.push(`\appointments`);
    
            }else{
                members.map((m, i) => addMemberToPresence(m))
                console.log(presences)
            }
          })
          .catch((error) => {
            console.log("Error while sending get request for Members:" + error);
          });
      }
      function addMemberToPresence(m: Member) {
        let newPresence: Presence = {
          member: m,
          appointment: appToUse,
          message: "",
          presence: false,
          user: Math.floor(Math.random() * 10),
        };
        if (presences.length == 0) {
          const list = new Array<Presence>();
          list.push(newPresence);
          setPresences(list);
        } else presences.push(newPresence);
      }
    

    if (app && presences)
        return (
            <IonPage>
            <IonHeader>
              <NavBar/>
            </IonHeader>
            <IonContent fullscreen>
                    <AddPresence appointment={app} presences={presences}/>
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
}

export default PresenceAdd;