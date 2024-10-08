/* eslint-disable import/no-unresolved */
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { Toaster } from "sonner";
import Logo from "../../assets/images/Logo.svg";
import "../Register/register.css";
import { useUser } from "../../contexts/User/User";
import PrivacyPolicy from "../../components/PrivacyPolicy/PrivacyPolicy";
import DarkModeContext from "../../services/DarkModeContext";


function Login() {
  const api = import.meta.env.VITE_API_URL;

  const { mode } = useContext(DarkModeContext);

  const email = useRef();
  const password = useRef();

  const { setUser } = useUser();

  const [error, setError] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.current.value,
          password: password.current.value,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const token = response.headers.get("Authorization");
        const auth = await response.json();
        auth.token = token;
        setUser(auth);
        navigate("/journal");
      } else setError(true);
    } catch (err) {
      console.error(err);
    }
  };

// Managin modal for privacy policy
const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => {
  setOpen(false);
};

  return (
    <main className="loginPage">
      <img src={Logo} alt="logo" className="login-logo" />
      <section className="login">
        <h1>J'ai déjà un compte</h1>
        <p className="loginIntro">
          Entre ton email et connecte toi à Moov'it !
        </p>
        <form className="loginForm" onSubmit={handleSubmit}>
          <input
            ref={email}
            placeholder="Adresse mail"
            className={error ? "input-error" : ""}
          />
          {error.email ? (
            <p className="error-message">Veuillez renseigner un email valide</p>
          ) : null}
          <section id="password-input">
            {!visiblePass ? (
              <IoEyeOutline
                className="eye-password"
                onClick={() => setVisiblePass(!visiblePass)}
              />
            ) : (
              <IoEyeOffOutline
                className="eye-password"
                onClick={() => setVisiblePass(!visiblePass)}
              />
            )}
            <input
              ref={password}
              placeholder="Mot de passe"
              type={visiblePass ? "input" : "password"}
              className={error ? "input-error" : ""}
            />
          </section>
          {error.password ? (
            <p className="error-message">
              Le mot de passe doit contenir 1 minuscule, 1 majuscule, 1
              caractère spécial, 1 nombre.
            </p>
          ) : null}

          {error ? (
            <p className="error-message">
              Votre email ou votre mot de passe est incorrect. Veuillez
              réessayer.
            </p>
          ) : null}
          <button type="submit" className="primary-button">
            Je me connecte
          </button>
          <Link className={`policy-link-${mode}`} to="/register">Je n'ai pas de compte</Link>
        </form>
        <section className="login-privacy">
          <p>
            En cliquant sur Je m’inscris, vous certifiez avoir pris connaissance
            de notre <button className={`policy-link-${mode}`} type="button" onClick={handleOpen}>politique de confidentialité</button>
          </p>
        </section>
      </section>
      <PrivacyPolicy open={open} handleClose={handleClose}/>
      <Toaster />
    </main>
  );
}

export default Login;
