import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useContext } from "react";
import DarkModeContext from "../../services/DarkModeContext";
import "./validation.css";

export default function Validation({ handleClose, handleDeleteItem, message }) {
  const { mode } = useContext(DarkModeContext);
  return (
    <section className="validation-modal">
      <motion.div
        className={`validation-container-${mode}`}
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.1,
          ease: "easeInOut",
          scale: {
            type: "spring",
            stiffness: 300,
            restDelta: 0.001,
          },
        }}
      >
        <p>{message}</p>
        <div className="validation-button-container">
          <button
            type="button"
            className="validation-yes"
            onClick={handleDeleteItem}
          >
            OUI
          </button>
          <button type="button" className="validation-no" onClick={handleClose}>
            NON
          </button>
        </div>
      </motion.div>
    </section>
  );
}

Validation.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
