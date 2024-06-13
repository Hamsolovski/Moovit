import PropTypes from 'prop-types'
import "./trainingForm.css";
import { useState } from "react";

function TrainingForm({getEditForm, id, training}) {
  const api = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState(training.title);
  const [date, setDate] = useState(training.date);
  const [timeOfDay, setTimeOfDay] = useState(training.timeOfDay);
  const [duration, setDuration] = useState(training.duration);
  const [details, setDetails] = useState(training.details);
  const [sport, setSport] = useState(training.sport)

  // Fonction qui gère l'affichage du formulaire selon que l'utilisateur crée ou édite son activité.

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!getEditForm) { 
    fetch(`${api}/api/trainings`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title, date, time_of_day: timeOfDay, duration, details, user_id: 3, sport_id: sport})
    })
  } else if (getEditForm) {
    fetch(`${api}/api/trainings/${id}`, {
      method: "PUT",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title, date, time_of_day: timeOfDay, duration, details, user_id: 3, sport_id: sport})
    })
  }
  };

  const handleTitle = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const handleDate = (e) => {
    e.preventDefault();
    setDate(e.target.value);
  };

  const handleSport = (e) => {
    e.preventDefault();
    setSport(parseInt(e.target.value, 10))
  }

  const handleTime = (e) => {
    e.preventDefault();
    setTimeOfDay(e.target.value);
  };
  const handleDuration = (e) => {
    e.preventDefault();
    setDuration(e.target.value);
  };
  const handleDetails = (e) => {
    e.preventDefault();
    setDetails(e.target.value);
  };

  return (
    <form className="trainingForm" onSubmit={handleSubmit}>
      <h1>Créer une nouvelle activité</h1>

      <input
        type="text"
        id="title"
        name="title"
        placeholder="Titre de ton entraînement"
        value={title}
        onChange={handleTitle}
      />
      <input
        type="date"
        id="date"
        name="date"
        placeholder="Quel jour ?"
        value={date}
        onChange={handleDate}
      />
      <select
        type=""
        id="time-of-day-select"
        name="time-of-day"
        value={timeOfDay}
        onChange={handleTime}
      >
        <option>Matin, Après-midi ou Soir ? 😉</option>
        <option>Matin</option>
        <option>Après-midi</option>
        <option>Soir</option>
      </select>
      <select id="sport-select" name="type" value={sport} onChange={handleSport}>
        <option>Quel sport ? ⛹️</option>
        <option value="4">Fitness</option>
        <option value="5">Running</option>
        <option value="6">Poney</option>
      </select>
      <input
        type="text"
        id="duration"
        name="duration"
        value={duration}
        placeholder="Combien de temps ?"
        onChange={handleDuration}
      />
      <textarea
        type="text"
        id="details"
        name="details"
        value={details}
        placeholder="Enregistre les détails de ton activité ici 👌"
        onChange={handleDetails}
      />

      <button type="submit" className="primary-button">
        Enregistrer
      </button>
    </form>
  );
}

export default TrainingForm;

TrainingForm.propTypes = {
  getEditForm: PropTypes.bool.isRequired, // Indique si le formulaire est utilisé pour éditer une activité existante
  id: PropTypes.number.isRequired, // ID de l'activité en cours d'édition
  training: PropTypes.shape({
    title: PropTypes.string.isRequired, // Titre de l'activité
    date: PropTypes.string.isRequired, // Date de l'activité
    timeOfDay: PropTypes.string.isRequired, // Moment de la journée de l'activité
    duration: PropTypes.string.isRequired, // Durée de l'activité
    details: PropTypes.string.isRequired, // Détails de l'activité
    sport: PropTypes.number.isRequired // ID du sport associé à l'activité
  }).isRequired
};