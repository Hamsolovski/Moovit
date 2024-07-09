/* eslint-disable import/no-unresolved */
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { IoMdFitness } from "react-icons/io";
import { TbSunset2 } from "react-icons/tb";
import { CiClock2 } from "react-icons/ci";
import { toast } from "sonner";
import DarkModeContext from "../../services/DarkModeContext";
import "./card.css";
import CardMenu from "../CardMenu/CardMenu";

import Feedback from "../Feedback/Feedback";
import { useUser } from "../../contexts/User/User";

export default function Card({
  card,
  handleOpen,
  setCurrentTraining,
  setStatusTraining,
  setStatusFeedback,
}) {
  const { user } = useUser();
  const { mode } = useContext(DarkModeContext);
  const api = import.meta.env.VITE_API_URL;

  // Open feedback State
  const [openFeedback, setOpenFeedback] = useState(false);

  // Managing opening and closing Modal (feedback)
  const handleOpenFeedback = () => {
    setOpenFeedback(true);
  };
  const handleCloseFeedback = () => {
    setOpenFeedback(false);
  };

  // Delete training with the cardMenu
  const handleDelete = () => {
    fetch(`${api}/api/trainings/${card.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setStatusTraining((prev) => !prev);
    toast.success("Entraînement supprimé avec succès", {
      style: {
        background: "rgba(145, 225, 166, 0.8)",
        color: "black",
      },
    });
  };

  // Edit training with the cardMenu
  const handleEdit = () => {
    setCurrentTraining(card.id);
    handleOpen();
  };

  return (
    <section id={`card-${mode}`}>
      <section className="trainingCard-title">
        <h1 className="card-title">{card.title}</h1>
        <CardMenu handleEdit={handleEdit} handleDelete={handleDelete} />
      </section>
      <div className="card-type-training">
        <IoMdFitness />
        <p>Entraînement | {card.name}</p>
      </div>
      <div className="card-time-training">
        <div className="card-plus">
          <TbSunset2 />
          <p>{card.time_of_day}</p>
        </div>
        <div className="card-plus">
          <CiClock2 />
          <p>{card.duration}</p>
        </div>
      </div>
      <section className="trainingCard-title">
        <button
          type="button"
          className="card-button-validate"
          onClick={handleOpenFeedback}
        >
          Valider
        </button>
        {card.details && <Link to={`/training/${card.id}`}>Détails</Link>}
      </section>
      <Feedback
        handleClose={handleCloseFeedback}
        open={openFeedback}
        id={card.id}
        setStatusFeedback={setStatusFeedback}
      />
    </section>
  );
}

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    time_of_day: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    details: PropTypes.string,
  }).isRequired,
  handleOpen: PropTypes.func.isRequired,
  setCurrentTraining: PropTypes.func.isRequired,
  setStatusFeedback: PropTypes.func.isRequired,
  setStatusTraining: PropTypes.func.isRequired,
};
