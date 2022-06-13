import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonAlert,
  IonModal,
} from "@ionic/react";
import Member from "../../model/Member";
import UpdateMemberModal from "./UpdateMemberModal";
import { Redirect, useHistory } from "react-router";

const apiMemberUrl="http://localhost:8080/api/members";

const Members: React.FC = () => {
  const [present] = useIonAlert();
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const history=useHistory();

  const [members, setMembers] = useState(Array<Member>());
  const [filteredMembers, setFilteredMembers] = useState(Array<Member>());
  const [selectedMember, setSelectedMember] = useState<Member>();

  useEffect(() => {
    axios
      .get(apiMemberUrl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        setMembers(response.data);
        setFilteredMembers(response.data);
        console.log("Members after get request-Length: " + members.length);
      })
      .catch((error) => {
        console.log("Error while sending get request for members:" + error);
      });
  }, []);

  const deletemember = (memberToDelete: Member) => {
    const currentMembers = members;
    setMembers(
      currentMembers.filter((member) => member.id !== memberToDelete.id)
    );

    axios
      .delete(apiMemberUrl+"/" + memberToDelete.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        present(
          "Član" +
            memberToDelete.name +
            " " +
            memberToDelete.lastname +
            " je uspešno obrisan",
          [{ text: "Ok" }]
        );
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        setMembers(currentMembers);
        present(
          "Neuspešno brisanje člana " +
            memberToDelete.name +
            " " +
            memberToDelete.lastname,
          [{ text: "Ok" }]
        );
      });
  };

  const filterMembers = (filter: String, id: number) => {
    //id=1 za filtriraj dugme
    //id-2 za ukloni filter
    const original = members.slice();
    if (filter === "") {
      setFilteredMembers(original);
      setSearch("");
      if (id == 1)
        present("Morate uneti vrednost za pretragu.", [{ text: "Ok" }]);
    } else {
      if(id=2) setSearch("");
      console.log("search je " + filter);
      let filtered = [];
      filtered = members.filter((member) => {
        return member.name.toLowerCase().includes(filter.toLowerCase());
      });
      setFilteredMembers(filtered);
      if (filtered.length == 0) present("Ne postoje članovi sa unetom vrednošću.", [{ text: "Ok" }]);

      console.log("posle filter duzina je " + filteredMembers.length);
    }
  };

  return (
    <>
      <IonToolbar className="ion-margin">
        <IonTitle id="entityPageTitle" class="ion-text-center">
          Clanovi
        </IonTitle>
        <IonRow id="entityFilter">
          <IonCol>
            <IonInput
              id="inputSearch"
              type="text"
              value={search}
              onIonChange={(e) => {
                const target = e.target as HTMLInputElement;
                setSearch(target.value);
              }}
              placeholder="Pretražite po imenu"
            />
          </IonCol>
          <IonCol>
            <IonButton
              style={{ margin: "0.2em", marginLeft: "-15.5em" }}
              color="grey"
              onClick={() => filterMembers(search, 1)}
            >
              Filtriraj
            </IonButton>
            <IonButton
              style={{ margin: "0.2em", marginLeft: "1em" }}
              color="grey"
              onClick={() => filterMembers("", 2)}
            >
              Ukloni filter
            </IonButton>
          </IonCol>

          <IonCol size="3">
          <IonButton
             onClick={() =>{
              history.push("/members/add")
              window.location.reload();
             }}
              color="grey"
              class="ion-text-end"
              className="entityPageButton"
            >
              Dodaj novog člana
            </IonButton>
            
          </IonCol>
        </IonRow>
      </IonToolbar>

      <IonGrid id="entityTable" class="ion-text-center">
        <IonRow id="entityTableHeader">
          <IonCol>Id</IonCol>
          <IonCol>Ime</IonCol>
          <IonCol>Prezime</IonCol>
          <IonCol>JMBG</IonCol>
          <IonCol>Broj telefona</IonCol>
          <IonCol>Grupa</IonCol>
          <IonCol>Izmeni</IonCol>
          <IonCol>Obrisi</IonCol>
        </IonRow>
        {filteredMembers.map((member, i) => (
          <IonRow id="entityTableRows" key={i}>
            <IonCol>{member.id}</IonCol>
            <IonCol>{member.name}</IonCol>
            <IonCol>{member.lastname}</IonCol>
            <IonCol>{member.jmbg}</IonCol>
            <IonCol>{member.number}</IonCol>
            <IonCol>{member.groupId.name}</IonCol>

            <IonModal
              onIonModalDidDismiss={() => {
                setShowModalUpdate(false);
              }}
              isOpen={showModalUpdate}
            >
              <UpdateMemberModal
                member={
                  selectedMember == undefined ? member : selectedMember
                }
              />
              <IonButton
                color="grey"
                id="btnCloseModal"
                onClick={() => {
                  setShowModalUpdate(false)
                  window.location.reload();
                }}
              >
                Zatvori
              </IonButton>
            </IonModal>
            <IonCol>
              <IonButton
                color="medium"
                onClick={() => {
                  setShowModalUpdate(true);
                  console.log("click update sa id " + member.id);
                  setSelectedMember(member);
                }}
              >
                Izmeni
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color="danger" onClick={() => deletemember(member)}>
                Obriši
              </IonButton>
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>

          {localStorage.getItem('token') === null && <Redirect to="login" />}
    </>
  );
};
export default Members;
