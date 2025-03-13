import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../../style/nav/nav.js";
import Foot from "../../style/foot/foot.js";
import "./tracking.css";

const Tracking = () => {
  const { trackingNumber } = useParams();
  const [status, setStatus] = useState("");
  const [destination, setDestination] = useState("");
  const [delivery, setDelivery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/track/${trackingNumber}`
        );
        setStatus(response.data.status);
        let destinationArray = response.data.country.split(";");
        setDestination(destinationArray[3]);
        setDelivery(response.data.delivery);
        setLoading(false);
      } catch (err) {
        setError("Le numéro de suivi n'a pas été trouvé");
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [trackingNumber]);
  const navigate = useNavigate();
  if (loading) {
    return (
      <div>
        <Nav />
        <div className="tracking-page">
          <h2>Suivi du colis</h2>
          <p>Chargement...</p>
        </div>
        <Foot />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Nav />
        <div className="tracking-page">
          <h2>Suivi du colis</h2>
          <p>{error}</p>
        </div>
        <Foot />
      </div>
    );
  }
  function redirectAccount() {
    navigate("/account");
  }
  const trackingSteps = [
    {
      status: "En préparation",
      completed:
        status === "En préparation" ||
        status === "Remis au transporteur" ||
        status === "Arrivé à votre centre de distribution" ||
        status === "En cours de livraison" ||
        status === "Livré",
      additionalInfo: "France",
    },
    {
      status: "Remis au transporteur",
      completed:
        status === "Remis au transporteur" ||
        status === "Arrivé à votre centre de distribution" ||
        status === "En cours de livraison" ||
        status === "Livré",
    },
    {
      status: "Arrivé à votre centre de distribution",
      completed:
        status === "Arrivé à votre centre de distribution" ||
        status === "En cours de livraison" ||
        status === "Livré",
    },
    {
      status: "En cours de livraison",
      completed: status === "En cours de livraison" || status === "Livré",
    },
    {
      status: "Livré",
      completed: status === "Livré",
      additionalInfo: destination,
    },
  ];

  return (
    <div>
      <Nav />
      <div className="tracking-page">
        <h2>Suivi du colis</h2>
        <p className="tracking-number">Numéro de suivi : {trackingNumber}</p>
        <p className="delivery-mode">Mode de livraison : {delivery}</p>
        <button className="user-return-button" onClick={redirectAccount}>
          Revenir au profil
        </button>
        <div className="tracking-steps">
          {trackingSteps.map((step, index) => (
            <div
              key={index}
              className={`order-tracking ${step.completed ? "completed" : ""}`}
            >
              <span className="is-complete"></span>
              <p>
                {step.status}
                {step.additionalInfo && <br />}
                {step.additionalInfo && <span>{step.additionalInfo}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Foot />
    </div>
  );
};

export default Tracking;
