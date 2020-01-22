import React from 'react';
import { isMobile } from '../../helper';

export default function Welcome() {

  return (
    <div className="Welcome">
      <div className="jumbotron Welcome__title">
        <h1>{!isMobile() && "Bienvenue sur"} FlashcardStorm</h1>
      </div>
      <div className="Welcome__presentation-section">
        <h1 className="Welcome__presentation-title">Réconcilliez-vous avec votre mémoire</h1>
        <div className="Welcome__actions">
            <a href="/register" className="Button btn btn-primary Button--small">Débuter l'aventure</a>
            <a href="/home" className="Button btn btn-primary Button--small">Maîtriser la tempête</a>
        </div>
      </div>
      <div className="Welcome__text">
        <p>Pour commencer, cliquez sur le menu en haut à gauche, et sélectionnez un choix</p>
        <ul> Pour...
          <li>Consulter les dernières fonctionnalités et les prochaines mises à jour : A propos</li>
          <li>Répondre aux questions déjà enregistrées : Mode Tempête</li>
          <li>Consulter les questions enregistrées : Liste des questions</li>
          <li>Ajouter des questions : Ajouter des questions </li>
          <li>
            Si vous créez un compte et vous connectez, vous pouvez accéder à la partie personnalisable incluant un
            score personnel, vos questions personnelles, et un mode de révisions planifiées plus efficace.
          </li>
        </ul>
      </div>
    </div>
  );
}

