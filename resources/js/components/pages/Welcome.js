import React from 'react';

export default function Welcome() {

  return (
    <div className="jumbotron Welcome__title">
      <h1>Bienvenue sur FlashcardStorm</h1>
      <p>Pour commencer, cliquez sur le menu en haut à gauche, et sélectionnez un choix</p>
      <ul> Pour...
        <li>Consulter les dernières fonctionnalités et les prochaines mises à jour : A propos</li>
        <li>Répondre aux questions déjà enregistrées : Mode Tempête</li>
        <li>Consulter les questions enregistrées : Liste des questions</li>
        <li>Ajouter des questions : Ajouter des questions </li>
        <li>Si vous créez un compte et vous connectez, vous pouvez accéder à la partie personnalisable incluant un score personnel, vos questions personnelles, et un mode de révisions planifiées plus efficace.</li>
      </ul>
    </div>
  );
}

