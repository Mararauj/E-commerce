import React from "react";
import { useNavigate } from "react-router-dom";
import "./nav.css";

function Nav() {
  const navigate = useNavigate();

  function redirectHome() {
    navigate("/");
  }

  return (
    <div className="nosearchnavbar">
      <div>
        <h2 className="no-margin pointer mouseHover" onClick={redirectHome}>
          LeBonFeuxRouge
        </h2>
      </div>
    </div>
  );
}

export default Nav;
