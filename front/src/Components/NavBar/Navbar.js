import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";

const Navbar = (props) => {
  return (
    <nav className="navbar-container">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="SPA Logo" />
          <p>{props.title || "SPA"}</p>
        </Link>
      </div>
      <div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/pets">Adoption</Link>
          </li>
          <li>
            <Link to="/services">Nos refuges</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
      <div>
        <Link to="/don">
          <button className="Navbar-button">Faire un don</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;