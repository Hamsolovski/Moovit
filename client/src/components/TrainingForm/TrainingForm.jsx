/* eslint-disable import/no-unresolved */
import PropTypes from "prop-types";
import "./trainingForm.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import * as datefns from "date-fns";
import { useUser } from "../../contexts/User/User";

function TrainingForm({ id, training, handleClose, open }) {
  const { user } = useUser();

  const api = import.meta.env.VITE_API_URL;
  const { sports } = useOutletContext();

  const [title, setTitle] = useState(training?.title || "");
  const [date, setDate] = useState(
    training
      ? datefns.format(training.date, "yyyy-MM-dd")
      : datefns.format(new Date(), "yyyy-MM-dd")
  );
  const [timeOfDay, setTimeOfDay] = useState(training?.time_of_day || "");
  const [duration, setDuration] = useState(training?.duration || "");
  const [details, setDetails] = useState(training?.details || "");
  const [sport, setSport] = useState(training?.sport_id || "");
  const [templateId, setTemplateId] = useState("");
  const [templates, setTemplates] = useState([]);
  const [checked, setChecked] = useState(false);

  // state for managing errors in form
  const [error, setError] = useState({});

  const handleSave = () => {
    fetch(`${api}/api/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        title,
        duration,
        details,
        sport_id: sport,
      }),
    });
  };

  useEffect(() => {
    if (templateId && templates.length !== 0) {
      const selectedTemplate = templates.find(
        (template) => +template.id === +templateId
      );
      setTitle(selectedTemplate?.title);
      setDuration(selectedTemplate?.duration);
      setDetails(selectedTemplate?.details);
      setSport(selectedTemplate?.sport_id);
    }
  }, [templateId, templates]);

  useEffect(() => {
    fetch(`${api}/api/templates/all`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, [api]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checked) handleSave();
    setError({});
    if (!id) {
      await fetch(`${api}/api/trainings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          date,
          time_of_day: timeOfDay,
          duration,
          details,
          user_id: user.id,
          sport_id: sport,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.details) {
            data.details.forEach((detail) => {
              setError((prev) => ({
                ...prev,
                [detail.context.key]: [detail.message],
              }));
            });
          } else {
            handleClose();
            toast.success("Ton entraînement a bien été créé !", {
              style: {
                background: "rgba(145, 225, 166)",
                color: "black",
              },
            });
          }
        });
    } else if (id) {
      await fetch(`${api}/api/trainings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          date: datefns.format(date, "yyyy-MM-dd"),
          time_of_day: timeOfDay,
          duration,
          details,
          user_id: user.id,
          sport_id: sport,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.details)) {
            data.details.forEach((detail) => {
              setError((prev) => ({
                ...prev,
                [detail.context.key]: [detail.message],
              }));
            });
          } else {
            handleClose();
            toast.success("Tes modifications sont bien prises en compte !", {
              style: {
                background: "rgba(145, 225, 166)",
                color: "black",
              },
            });
          }
        });
    }
  };

  const variants = {
    open: {
      x: 0,
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
      x: "-100%",
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <motion.form
      className="trainingForm"
      onSubmit={handleSubmit}
      variants={variants}
      animate={open ? "open" : "closed"}
      initial="closed"
    >
      <h1>Créer une nouvelle activité</h1>

      <select
        type=""
        id="use-template"
        name="template"
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
      >
        <option value="" disabled>
          Est-ce que tu veux utiliser un modèle ?
        </option>
        {templates.length === 0
          ? null
          : templates.map((temp) => (
              <option key={temp.id} value={temp.id}>
                {temp.title}
              </option>
            ))}
      </select>
      <input
        type="text"
        id="title"
        name="title"
        placeholder="Titre de ton entraînement"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={error.title ? "input-error" : ""}
      />
      {error.title ? (
        <p className="error-message">
          Merci de donner un titre à ton entraînement
        </p>
      ) : null}
      <input
        type="date"
        id="date"
        name="date"
        placeholder="Quel jour ?"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={error.date ? "input-error" : ""}
      />
      <select
        type=""
        id="time-of-day-select"
        name="time-of-day"
        value={timeOfDay}
        onChange={(e) => setTimeOfDay(e.target.value)}
        className={error.time_of_day ? "input-error" : ""}
      >
        <option value="" disabled>
          Matin, Après-midi ou Soir ? 😉
        </option>
        <option>Matin</option>
        <option>Après-midi</option>
        <option>Soir</option>
      </select>
      {error.time_of_day ? (
        <p className="error-message">Merci de choisir une option</p>
      ) : null}
      <select
        id="sport-select"
        name="type"
        value={sport}
        onChange={(e) => setSport(e.target.value)}
        className={error.sport_id ? "input-error" : ""}
      >
        <option value="" disabled>
          Quel sport ? ⛹️
        </option>
        {sports
          ? sports.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))
          : null}
      </select>
      {error.sport_id ? (
        <p className="error-message">Merci de choisir un sport</p>
      ) : null}

      <input
        type="text"
        id="duration"
        name="duration"
        value={duration}
        placeholder="Combien de temps ?"
        onChange={(e) => setDuration(e.target.value)}
        className={error.duration ? "input-error" : ""}
      />
      {error.duration ? (
        <p className="error-message">
          Merci de renseigner une durée pour ton entraînement
        </p>
      ) : null}
      <textarea
        type="text"
        id="details"
        name="details"
        value={details}
        placeholder="Enregistre les détails de ton activité ici 👌"
        onChange={(e) => setDetails(e.target.value)}
      />
      {templateId ? null : (
        <div className="save-template">
          <input
            type="checkbox"
            className="save-button"
            id="save-button"
            name="save-button"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <label htmlFor="save-button" id="save-label">
            Enregistrer dans mes modèles
          </label>
        </div>
      )}
      <button type="submit" className="primary-button">
        Enregistrer
      </button>
      <button type="button" className="secondary-button" onClick={handleClose}>
        Annuler
      </button>
    </motion.form>
  );
}

export default TrainingForm;

TrainingForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([undefined])]),
  handleClose: PropTypes.func.isRequired, // ID de l'activité en cours d'édition
  training: PropTypes.shape({
    title: PropTypes.string, // Titre de l'activité
    date: PropTypes.string, // Date de l'activité
    time_of_day: PropTypes.string, // Moment de la journée de l'activité
    duration: PropTypes.string, // Durée de l'activité
    details: PropTypes.string, // Détails de l'activité
    sport_id: PropTypes.number, // ID du sport associé à l'activité
  }),
  open: PropTypes.bool.isRequired,
};

TrainingForm.defaultProps = {
  id: null,
  training: undefined,
};
