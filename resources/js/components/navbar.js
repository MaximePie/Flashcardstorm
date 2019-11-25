import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";


export default function Navbar() {

  return (
    <div className="Navbar">

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="Navbar__toggler navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Avatar className="Navbar__logo" alt="GIPSI Logo" src="/images/logo.png" />
        </button>
        <a className="navbar-brand" href="/home">FlashcardStorm</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="Navbar__item">
              <Link to="/home">Accueil</Link>
            </li>
            <li className="Navbar__item">
              <Link to="/add">Ajouter des questions</Link>
            </li>
            <li className="Navbar__item">
              <Link to="/questions">Questions</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
