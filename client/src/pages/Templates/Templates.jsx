/* eslint-disable import/no-unresolved */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import CardTemplate from "../../components/CardTemplate/CardTemplate";
import PopUpTemplate from "../../components/PopUp/PopUpTemplate/PopUpTemplate";
import SideBar from "../../components/SideBar/SideBar";
import "./templates.css";
import { useUser } from "../../contexts/User/User";
import Validation from "../../components/Validation/Validation";

function Templates() {
  const api = import.meta.env.VITE_API_URL;
  const { user } = useUser();

  const [templates, setTemplates] = useState([]);
  const [statusTemplate, setStatusTemplate] = useState(false);

  const [currentTemplate, setCurrentTemplate] = useState(null);

  // Get template ID for edition
  const findCurrentTemplate = templates.find(
    (template) => template.id === currentTemplate
  );

  // Managing modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentTemplate(null);
  };

  const navigate = useNavigate();

  const [validation, setValidation] = useState(false);

  const handleCloseValidation = () => {
    setValidation(false);
    document.body.classList.remove("blocked");
  };

  const handleOpenValidation = () => {
    setValidation(true);
    document.body.classList.add("blocked");
  };

  const handleDelete = () => {
    fetch(`${api}/api/templates/${currentTemplate}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setStatusTemplate((prev) => !prev);
    handleCloseValidation();
    setCurrentTemplate(null);
    navigate("/templates");
    toast.success("Modèle supprimé avec succès", {
      style: {
        background: "rgba(145, 225, 166, 0.8)",
        color: "black",
      },
    });
  };

  useEffect(() => {
    if (!user) navigate("/login");
    fetch(`${api}/api/templates/all`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTemplates(data));
  }, [api, open, statusTemplate]);

  const variants = {
    open: {
      opacity: 1,
      y: 0,
    },
    closed: {
      opacity: 0,
      y: "100%",
    },
  };

  return (
    <>
      <section className="templates-container">
        <section className="templates">
          <h1>Mes modèles</h1>
          {templates ? (
            templates.map((template, i) => (
              <motion.div
                key={`template-${template.id}`}
                variants={variants}
                initial="closed"
                animate="open"
                transition={{
                  duration: 0.5,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.1 * (i - 1),
                }}
              >
                <CardTemplate
                  card={template}
                  setCurrentTemplate={setCurrentTemplate}
                  handleOpen={handleOpen}
                  setStatusTemplate={setStatusTemplate}
                  handleOpenValidation={handleOpenValidation}
                  handleCloseValidation={handleCloseValidation}
                />
              </motion.div>
            ))
          ) : (
            <p>Vous n'avez aucun modèle enregistré</p>
          )}
          <button
            type="button"
            className="journal-add-button"
            onClick={handleOpen}
          >
            <p>Ajouter un modèle</p>
            <FaPlus />
          </button>
          <PopUpTemplate
            setOpen={setOpen}
            handleOpen={handleOpen}
            handleClose={handleClose}
            open={open}
            id={currentTemplate}
            training={findCurrentTemplate}
          />
        </section>
        <Toaster />
        <SideBar />
      </section>
      {validation && (
        <Validation
          handleClose={handleCloseValidation}
          handleDeleteItem={handleDelete}
          message="Es-tu sûr de vouloir supprimer ce modèle ?"
        />
      )}
    </>
  );
}

export default Templates;
