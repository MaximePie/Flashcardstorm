import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {Link} from "react-router-dom";


export default function Navbar() {

  return (
    <div className="Navbar">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">FlashcardStorm</a>

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
