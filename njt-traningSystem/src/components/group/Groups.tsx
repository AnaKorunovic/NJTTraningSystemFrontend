import React, { useEffect, useState } from "react";
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
import UpdateGroupModal from "./UpdateGroupModal";
import AddGroupModal from "./AddGroup";
import Group from "../../model/Group";
import { Link, useHistory } from "react-router-dom";

const apiGroupUrl = "http://localhost:8080/api/groups";

const Groups: React.FC = () => {
  const [present] = useIonAlert();
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const history = useHistory();

  const [groups, setGroups] = useState(Array<Group>());
  const [filteredGroups, setFilteredGroups] = useState(Array<Group>());
  const [selectedGroup, setSelectedGroup] = useState<Group>();

  useEffect(() => {
    axios
      .get(apiGroupUrl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        setGroups(response.data);
        setFilteredGroups(response.data);
        console.log("Groups after get request-Length: " + groups.length);
      })
      .catch((error) => {
        console.log("Error while sending get request for Groups:" + error);
      });
  }, []);

  const deleteGroup = (groupToDelete: Group) => {
    const currentGroups = groups;
    setGroups(currentGroups.filter((group) => group.id !== groupToDelete.id));
    axios
      .delete(apiGroupUrl + "/" + groupToDelete.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        present("Grupa " + groupToDelete.name + " je uspešno obrisana.", [
          { text: "Ok" },
        ]);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        setGroups(currentGroups);
        present(
          "Neuspešno brisanje grupe " +
            groupToDelete.name +
            ". Grupa sadrzi članove.",
          [{ text: "Ok" }]
        );
      });
  };

  const filterGroups = (filter: String, id: number) => {
    //id=1 za filtriraj dugme
    //id-2 za ukloni filter
    //filtriranje
    const original = groups.slice();
    if (filter === "") {
      setFilteredGroups(original);
      setSearch("");
      if (id == 1)
        present("Morate uneti vrednost za pretragu.", [{ text: "Ok" }]);
    } else {
      console.log("search je " + filter);
      let filtered = [];
      filtered = groups.filter((group) => {
        return group.name.toLowerCase().includes(filter.toLowerCase());
      });
      setFilteredGroups(filtered);
      if (filtered.length == 0)
        present("Ne postoje grupe sa unetom vrednošću.", [{ text: "Ok" }]);
      console.log("posle filter duzina je " + filterGroups.length);
    }
  };

  return (
    <>
      <IonToolbar className="ion-margin">
        <IonTitle id="entityPageTitle" class="ion-text-center">
          Grupe
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
              placeholder="Pretražite po nazivu"
            />
          </IonCol>
          <IonCol>
            <IonButton
              style={{ margin: "0.2em", marginLeft: "-15.5em" }}
              color="grey"
              onClick={() => filterGroups(search, 1)}
            >
              Filtriraj
            </IonButton>
            <IonButton
              style={{ margin: "0.2em", marginLeft: "1em" }}
              color="grey"
              onClick={() => filterGroups("", 2)}
            >
              Ukloni filter
            </IonButton>
          </IonCol>

          <IonCol size="3">
            <IonButton
              onClick={() => {
                history.push("/groups/add");
                window.location.reload();
              }}
              color="grey"
              class="ion-text-end"
              className="entityPageButton"
            >
              Dodaj novu grupu
            </IonButton>
          </IonCol>
        </IonRow>
      </IonToolbar>

      <IonGrid id="entityTable" class="ion-text-center">
        <IonRow id="entityTableHeader">
          <IonCol>Id</IonCol>
          <IonCol>Naziv</IonCol>
          <IonCol>Trener</IonCol>
          <IonCol>Izmeni</IonCol>
          <IonCol>Obrisi</IonCol>
        </IonRow>
        {filteredGroups.map((group, i) => (
          <IonRow id="entityTableRows" key={i}>
            <IonCol>{group.id}</IonCol>
            <IonCol>{group.name}</IonCol>
            <IonCol>{group.trainer.name + " " + group.trainer.lastname}</IonCol>

            <IonModal
              onIonModalDidDismiss={() => {
                setShowModalUpdate(false);
              }}
              isOpen={showModalUpdate}
            >
              <UpdateGroupModal
                group={selectedGroup == undefined ? group : selectedGroup}
              />
              <IonButton
                color="grey"
                id="btnCloseModal"
                onClick={() => {
                  setShowModalUpdate(false);
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
                  console.log("click update sa id " + group.id);
                  setSelectedGroup(group);
                }}
              >
                Izmeni
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color="danger" onClick={() => deleteGroup(group)}>
                Obriši
              </IonButton>
            </IonCol>
          </IonRow>
        ))}
      </IonGrid>
      {localStorage.getItem("token") === null && <Link to="login" />}
    </>
  );
};
export default Groups;
