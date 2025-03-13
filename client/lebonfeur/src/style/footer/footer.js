import React from "react";
import "./footer.css";
import { useNavigate } from 'react-router-dom';

function Footer() {

  const navigate = useNavigate();

  return (
    <div class="footer">
      <div className="logo">
        <h2 class="no-margin">LeBonFeuxRouge</h2>
        <small>@2024</small>
      </div>
      <div className="footlinks">
        <span className="span-direct" onClick={() => navigate("/cgv")}>CGV</span>
        <span className="span-direct" onClick={() => navigate("/garantie-legale-et-assurance")}>Garantie légale et assurance</span>
        <span className="span-direct" onClick={() => navigate("/support")}>Support</span>
      </div>
    </div>
  );
}

export default Footer;
