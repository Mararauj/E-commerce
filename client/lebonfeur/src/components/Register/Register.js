import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import Nav from "../../style/nav/nav.js";
import Foot from "../../style/foot/foot.js";
import "./register.css";
import toast from 'react-hot-toast';

const Register = () => {
  let user = secureLocalStorage.getItem("user");

  const navigate = useNavigate();
  const [isRegisterForm, setIsRegisterForm] = useState(true);

  useEffect(() => {
    const syncCartWithDB = async () => {
      if (user) {
        try {
          let cart = JSON.parse(secureLocalStorage.getItem("cart"));
          
          if (cart && cart.length > 0) {
            await axios.delete(`http://127.0.0.1:8000/api/cart/user/${user}`);
            for (const item of cart) {
              await axios.post("http://127.0.0.1:8000/api/addpanier", {
                product_id: item.product_id,
                user_id: user,
                quantity: item.quantity,
              });
            }
          }
  
          secureLocalStorage.removeItem("cart");
          navigate("/");
        } catch (error) {
          console.error("Erreur lors de la synchronisation du panier: ", error);
        }
      }
    };
  
    syncCartWithDB();
  }, [user, navigate]);
  

  const [registerFormData, setRegisterFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mdp: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    mdp: "",
  });

  const handleRegisterChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };
  const toggleForm = () => {
    setIsRegisterForm(!isRegisterForm);
  };
  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/register", registerFormData);
      toast.success("Merci pour votre inscription, veuillez vous connecter !");
      setRegisterFormData({
        nom: "",
        prenom: "",
        email: "",
        mdp: "",
      });
      setIsRegisterForm(false)
    } catch (error) {
      console.error("Registration error:", error.response.data);
      toast.error("Erreur veuillez vérifier vos infos");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        loginFormData
      );
      secureLocalStorage.setItem("user", response.data.id);
      secureLocalStorage.setItem("prenom", response.data.prenom);
      secureLocalStorage.setItem("nom", response.data.nom);
      secureLocalStorage.setItem("email", response.data.email);
      secureLocalStorage.setItem("admin", response.data.admin);
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error.response.data);
      toast.error("Erreur veuillez vérifier vos informations");
    }
  };

  if (user) {
    return null;
  }

  return (
    <div>
      <Nav />
      <div className="content">
        {isRegisterForm ? (
          <form className="register" onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={registerFormData.nom}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prenom"
              value={registerFormData.prenom}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerFormData.email}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="password"
              name="mdp"
              placeholder="Mot de passe"
              value={registerFormData.mdp}
              onChange={handleRegisterChange}
              required
            />
            <button type="submit">Register</button>
            <p>
              Déjà un compte ?{" "}
              <span onClick={toggleForm} className="toggle-form-link">
                Connecte toi !
              </span>
            </p>
          </form>
        ) : (
          <form className="login" onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginFormData.email}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="mdp"
              placeholder="Mot de passe"
              value={loginFormData.mdp}
              onChange={handleLoginChange}
              required
            />
            <button type="submit">Login</button>
            <p>
              Tu n'as pas de Compte ?{" "}
              <span onClick={toggleForm} className="toggle-form-link">
                Inscris toi !
              </span>
            </p>
          </form>
        )}
      </div>
      <Foot />
    </div>
  );
};

export default Register;
