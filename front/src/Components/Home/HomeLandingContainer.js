import React from "react";
import { Link } from "react-router-dom";
import heroImage from "./images/1.jpg";

const HomeLandingContainer = (props) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="home-content">
        <div className="home-text-container">
          <h1 className="home-title">
            Adoptez votre nouveau compagnon
          </h1>
          <p className="home-second-para">
            {props.description || "La SPA recueille chaque année des milliers d'animaux abandonnés. Trouvez celui qui saura vous apporter bonheur et affection."}
          </p>
          <div className="adopt-btn">
            <Link to='./pets'>
              <button className="Home-button" onClick={scrollToTop}>
                Voir les animaux à adopter
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLandingContainer;