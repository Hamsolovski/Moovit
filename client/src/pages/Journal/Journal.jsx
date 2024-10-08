/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./journal.css";
import * as datefns from "date-fns";
import { toast } from "sonner";
import Days from "../../components/Days/Days";
import Card from "../../components/Card/Card";
import TipsCard from "../../components/TipsCard/TipsCard";
import SideBar from "../../components/SideBar/SideBar";
import PopUp from "../../components/PopUp/PopUpTraining/PopUp";
import FeedbackCard from "../../components/FeedbackCard/FeedbackCard";
import { useUser } from "../../contexts/User/User";
import Validation from "../../components/Validation/Validation";
import MonthCalendar from "../../components/MonthCalendar/MonthCalendar";

export default function Journal() {
  // Import user
  const { user } = useUser();
  const [currentTraining, setCurrentTraining] = useState(null);
  const [statusTraining, setStatusTraining] = useState(false);

  // Managing modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentTraining(null);
  };

  // Managing calendar modal
  const [openCalendar, setOpenCalendar] = useState(false);
  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };
  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  // Current date
  const [currentDate, setCurrentDate] = useState(new Date());

  // All the trainings for a given date
  const [trainings, setTrainings] = useState([]);
  // Loading state trainings
  const [loadingTrainings, setLoadingTrainings] = useState(false);

  // State for the day clicked formated "yyyy-MM-dd"
  const [dayTraining, setDayTraining] = useState(
    datefns.format(new Date(), "yyyy-MM-dd")
  );

  // State to count (for the week display)
  const [weekCounter, setWeekCounter] = useState(0);

  // State to get all Tips for a giving type
  const [tips, setTips] = useState([]);
  // Tips repos
  const tipsRepos = tips.filter((tip) => tip.type === "Repos");
  // Tips trainings
  const tipsTraining = tips.filter((tip) => tip.type === "Entraînement");
  // Loading state tips
  const [loadingTips, setLoadingTips] = useState(false);

  // State to get all Feedbacks for a givind day
  const [feedbacks, setFeedbacks] = useState([]);
  // Loading state feedbacks
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  // State pour gestion de toast
  const [statusFeedback, setStatusFeedback] = useState(false);

  // Validation modal managing
  const [validation, setValidation] = useState(false);

  const handleCloseValidation = () => {
    setValidation(false);
    document.body.classList.remove("blocked");
  };

  const handleOpenValidation = () => {
    setValidation(true);
    document.body.classList.add("blocked");
  };

  // State to get Training or Feedback id
  const [idFeedback, setIdFeedback] = useState("");
  const [trainingFeedback, setTrainingFeedback] = useState("");
  // State to know wich one should be deleted or uppdated
  const [boolFeed, setBoolFeed] = useState(false);
  const [boolTrain, setBoolTrain] = useState(false);

  // State to get clicked id training
  const [idTraining, setIdTraining] = useState("");

  // State to get all training for a week
  const [getInterval, setGetInterval] = useState([]);

  // Delete feedback if yes is clicked
  const handleDeleteFeedback = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedbacks/${idFeedback}/${trainingFeedback}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("Feedback supprimé avec succès", {
          style: {
            background: "rgba(145, 225, 166, 1)",
            color: "black",
          },
        });
      } else {
        toast.error(
          "Une erreur est survenue, le feedback n'a pas pu être supprimé"
        );
      }
      handleCloseValidation();
      setStatusFeedback(!statusFeedback);
    } catch (err) {
      toast.error("Une erreur est survenue, veuillez réessayer plus tard");
    }
  };

  // Delete training with the cardMenu
  const handleDeleteTraining = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/trainings/${idTraining}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setStatusTraining((prev) => !prev);
    handleCloseValidation();
    toast.success("Entraînement supprimé avec succès", {
      style: {
        background: "rgba(145, 225, 166, 1)",
        color: "black",
      },
    });
  };

  // Days of the week
  const daysWeek = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  // Months of the year
  const monthList = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  // Formated day function "yyyy-MM-dd"
  const formated = (daysList) => {
    const resultList = [];
    for (let i = 0; i < daysList.length; i += 1) {
      resultList.push({
        date: datefns.format(daysList[i], "yyyy-MM-dd"),
        day: daysWeek[i],
      });
    }
    return resultList;
  };

  // Function that convert a date from yyyy-MM-dd to an object with 3 string (Ex: 2024-06-11 -> {'Tuesday', '11', 'June')
  const convert = (date) => {
    const newDate = new Date(
      date.slice(0, 4),
      date.slice(5, 7) - 1,
      date.slice(8, 10)
    );
    let day = newDate.getDay();
    if (day === 0) {
      day = 7;
    }
    const month = newDate.getMonth();
    return {
      day: daysWeek[day - 1],
      month: monthList[month],
      numb: date.slice(8, 10),
    };
  };

  // Function convert apply on the state activeButton which refer to the day clicked
  const { day, month, numb } = convert(dayTraining);

  // First day of the week
  const firstDay = datefns.startOfWeek(currentDate, { weekStartsOn: 1 });
  // Last day of the week
  const lastDay = datefns.endOfWeek(currentDate, { weekStartsOn: 1 });
  // List of days
  const daysOfWeek = formated(
    datefns.eachDayOfInterval({ start: firstDay, end: lastDay })
  );

  // Get datas to get trainings for a giving day
  useEffect(() => {
    setLoadingTips(false);
    setLoadingTrainings(false);
    setLoadingFeedbacks(false);
    fetch(`${import.meta.env.VITE_API_URL}/api/trainings/day/${dayTraining}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setTrainings(response);
        setLoadingTrainings(true);
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/tips`)
      .then((response) => response.json())
      .then((response) => {
        setTips(response);
        setLoadingTips(true);
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/feedbacks/${dayTraining}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setFeedbacks(response);
        setLoadingFeedbacks(true);
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/trainings/interval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        firstDay: datefns.format(firstDay, "yyyy-MM-dd"),
        lastDay: datefns.format(lastDay, "yyyy-MM-dd"),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const newArray = [];
        res.forEach((value) =>
          newArray.push(datefns.format(value.date, "yyyy-MM-dd"))
        );
        setGetInterval(newArray);
      });
  }, [dayTraining, open, statusTraining, statusFeedback, currentDate]);

  // Display the previous week
  const handlePrev = () => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 7
    );
    const dateFirstPrev = datefns.startOfWeek(date, { weekStartsOn: 1 });
    setCurrentDate(date);
    setWeekCounter((prev) => prev - 1);
    setDayTraining(datefns.format(dateFirstPrev, "yyyy-MM-dd"));
  };

  // Display the next week
  const handleNext = () => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 7
    );
    const dateFirstNext = datefns.startOfWeek(date, { weekStartsOn: 1 });
    setCurrentDate(date);
    setWeekCounter((prev) => prev + 1);
    setDayTraining(datefns.format(dateFirstNext, "yyyy-MM-dd"));
  };

  // Function to return to today
  const handleReturnToday = () => {
    setDayTraining(datefns.format(new Date(), "yyyy-MM-dd"));
    setCurrentDate(new Date());
    setWeekCounter(0);
  };
  // Get training ID for edition
  const findCurrentTraining = trainings.find(
    (training) => training.id === currentTraining
  );

  return (
    <section className="journal">
      <MonthCalendar
        open={openCalendar}
        setOpen={setOpenCalendar}
        handleClose={handleCloseCalendar}
        setCurrentDate={setCurrentDate}
        setDayTraining={setDayTraining}
        statusFeedback={statusFeedback}
        statusTraining={statusTraining}
      />
      <div className="journal-first-container">
        <div className="journal-orange-block">
          <div className="journal-elements">
            <h1 className="journal-day-desktop">
              {day} {numb} {month}
            </h1>
          </div>
          {dayTraining === datefns.format(new Date(), "yyyy-MM-dd") && (
            <p className="journal-motivation">
              {trainings.length === 0
                ? "Aujourd’hui, tu n'as rien de prévu ! Profites en pour te reposer."
                : `Aujourd’hui, tu as ${trainings.length} entraînement${trainings.length > 1 ? "s" : ""} de prévu ! Courage, tu peux le
              faire.`}
            </p>
          )}
          {dayTraining < datefns.format(new Date(), "yyyy-MM-dd") && (
            <p className="journal-motivation">
              {feedbacks.length > 0 || trainings.length > 0
                ? `Tu avais ${feedbacks.length + trainings.length} entraînement${feedbacks.length + trainings.length > 1 ? "s" : ""} de prévu ce jour là ! Bravo à toi`
                : "Tu n'avais rien de prévu ce jour là !"}
            </p>
          )}
          {dayTraining > datefns.format(new Date(), "yyyy-MM-dd") && (
            <p className="journal-motivation">
              {trainings.length === 0
                ? "Tu n'as rien de prévu ce jour là ! Profites en pour te reposer"
                : `Tu as ${trainings.length} entraînement${trainings.length > 1 ? "s" : ""} de prévu ce jour là ! Courage tu peux le faire !`}
            </p>
          )}
        </div>
        <button
          type="button"
          className="journal-add-button"
          onClick={handleOpen}
        >
          <p>Ajouter une activité</p>
          <FaPlus />
        </button>
        {loadingFeedbacks && (
          <div className="journal-card">
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                setStatusFeedback={setStatusFeedback}
                setIdFeedback={setIdFeedback}
                setTrainingFeedback={setTrainingFeedback}
                handleOpenValidation={handleOpenValidation}
                setBoolFeed={setBoolFeed}
                setBoolTrain={setBoolTrain}
              />
            ))}
          </div>
        )}
        {loadingTrainings && (
          <div className="journal-card">
            {trainings.map((card) => (
              <Card
                key={card.id}
                card={card}
                handleOpen={handleOpen}
                setCurrentTraining={setCurrentTraining}
                setStatusFeedback={setStatusFeedback}
                setIdTraining={setIdTraining}
                handleOpenValidation={handleOpenValidation}
                setBoolTrain={setBoolTrain}
                setBoolFeed={setBoolFeed}
                statusFeedback={statusFeedback}
              />
            ))}
          </div>
        )}
        {trainings.length > 0 && loadingTips && (
          <div className="journal-card">
            <TipsCard
              tip={tipsTraining[Math.ceil(Math.random() * tipsTraining.length)]}
            />
          </div>
        )}
        {trainings.length === 0 && loadingTips && (
          <div className="journal-card">
            <TipsCard
              tip={tipsRepos[Math.ceil(Math.random() * tipsRepos.length)]}
            />
          </div>
        )}
        {dayTraining !== datefns.format(new Date(), "yyyy-MM-dd") && (
          <button
            type="button"
            className="days-button-today-mobile"
            onClick={handleReturnToday}
          >
            Retour à aujourd'hui
          </button>
        )}
      </div>
      <div className="journal-second-container">
        <div className="journal-days-container">
          <Days
            daysOfWeek={daysOfWeek}
            handlePrev={handlePrev}
            handleNext={handleNext}
            dayTraining={dayTraining}
            setDayTraining={setDayTraining}
            weekCounter={weekCounter}
            handleReturnToday={handleReturnToday}
            getInterval={getInterval}
            handleOpenCalendar={handleOpenCalendar}
          />
        </div>
      </div>
      <SideBar />
      <PopUp
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        open={open}
        training={findCurrentTraining}
        id={currentTraining}
        dayTraining={dayTraining}
      />
      {boolFeed && validation && (
        <Validation
          handleClose={handleCloseValidation}
          handleDeleteItem={handleDeleteFeedback}
          message="Es-tu sûr de vouloir supprimer ce feedback ?"
        />
      )}
      {boolTrain && validation && (
        <Validation
          handleClose={handleCloseValidation}
          handleDeleteItem={handleDeleteTraining}
          message="Es-tu sûr de vouloir supprimer cet entraînement ?"
        />
      )}
    </section>
  );
}
