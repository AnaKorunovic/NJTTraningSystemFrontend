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
  IonNavLink,
} from "@ionic/react";
import UpdateTrainer from "./UpdateTrainer";
import AddTrainer from "./AddTrainer";
import Trainer from "../../model/Trainer";
import { Link, useHistory } from "react-router-dom";

const apiTrainerUrl = "http://localhost:8080/api/trainers";

const Trainers: React.FC = () => {
  const [present] = useIonAlert();
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const history = useHistory();

  const [trainers, setTrainers] = useState(Array<Trainer>());
  const [filteredTrainers, setFilteredTrainers] = useState(Array<Trainer>());
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer>();

  useEffect(() => {
    axios
      .get(apiTrainerUrl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        setTrainers(response.data);
        setFilteredTrainers(response.data);
        console.log("Trainers successfuly returned from DB");
      })
      .catch((error) => {
        console.log("Error while sending get request for trainers:" + error);
      });
  }, []);

  const deleteTrainer = (trainerToDelete: Trainer) => {
    const currentTrainers = trainers;
    setTrainers(
      currentTrainers.filter((trainer) => trainer.id !== trainerToDelete.id)
    );

    axios
      .delete(apiTrainerUrl + "/" + trainerToDelete.id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        present(
          "Trener " +
            trainerToDelete.name +
            " " +
            trainerToDelete.lastname +
            " je uspešno obrisan",
          [{ text: "Ok" }]
        );
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        setTrainers(currentTrainers);
        present(
          "Neuspešno brisanje trenera. Trener " +
            trainerToDelete.name +
            " " +
            trainerToDelete.lastname +
            " sadrži svoju grupu.",
          [{ text: "Ok" }]
        );
      });
  };

  const filterTrainers = (filter: String, id: number) => {
    //id=1 za filtriraj dugme
    //id-2 za ukloni filter
    const original = trainers.slice();
    if (filter === "") {
      setFilteredTrainers(original);
      setSearch("");
      if (id == 1)
        present("Morate uneti vrednost za pretragu.", [{ text: "Ok" }]);
    } else {
      console.log("search je " + filter);
      let filtered = [];
      filtered = trainers.filter((trainer) => {
        return trainer.name.toLowerCase().includes(filter.toLowerCase());
      });
      setFilteredTrainers(filtered);
      if (filtered.length == 0)
        present("Ne postoje treneri sa unetom vrednošću.", [{ text: "Ok" }]);

      console.log("posle filter duzina je " + filterTrainers.length);
    }
  };

  return (
    <>
      <IonToolbar className="ion-margin">
        <IonTitle id="entityPageTitle" class="ion-text-center">
          Treneri
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
              onClick={() => filterTrainers(search, 1)}
            >
              Filtriraj
            </IonButton>
            <IonButton
              style={{ margin: "0.2em", marginLeft: "1em" }}
              color="grey"
              onClick={() => filterTrainers("", 2)}
            >
              Ukloni filter
            </IonButton>
          </IonCol>

          <IonCol size="3">
            <IonButton
             onClick={() =>{
              history.push("/trainers/add")
              window.location.reload();
             }}
              color="grey"
              class="ion-text-end"
              className="entityPageButton"
            >
              
                Dodaj novog trenera
            </IonButton>
          </IonCol>
        </IonRow>
      </IonToolbar>

      <IonGrid id="entityTable" class="ion-text-center">
        <IonRow id="entityTableHeader">
          <IonCol>Id</IonCol>
          <IonCol>Ime</IonCol>
          <IonCol>Prezime</IonCol>
          <IonCol>Email</IonCol>
          <IonCol>Broj telefona</IonCol>
          <IonCol>Izmeni</IonCol>
          <IonCol>Obrisi</IonCol>
        </IonRow>
        {filteredTrainers.map((trainer, i) => (
          <IonRow id="entityTableRows" key={i}>
            <IonCol>{trainer.id}</IonCol>
            <IonCol>{trainer.name}</IonCol>
            <IonCol>{trainer.lastname}</IonCol>
            <IonCol>{trainer.email}</IonCol>
            <IonCol>{trainer.number}</IonCol>

            <IonModal
              onIonModalDidDismiss={() => {
                setShowModalUpdate(false);
              }}
              isOpen={showModalUpdate}
            >
              <UpdateTrainer
                trainer={
                  selectedTrainer == undefined ? trainer : selectedTrainer
                }
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
                  console.log("click update sa id " + trainer.id);
                  setSelectedTrainer(trainer);
                }}
              >
                Izmeni
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color="danger" onClick={() => deleteTrainer(trainer)}>
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
export default Trainers;
