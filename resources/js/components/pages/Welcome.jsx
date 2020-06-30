import React from 'react';
import { isMobile } from '../../helper';
import Icon from '../Icon';

export default function Welcome() {
  return (
    <div className="Welcome">
      <div className="Welcome__title">
        <h1>
          {!isMobile() && 'Bienvenue sur'}
          {' '}
FlashcardStorm
        </h1>
      </div>
      <div className="Welcome__presentation-section">
        <h1 className="Welcome__presentation-title">Réconcilliez-vous avec votre mémoire</h1>
        <div className="Welcome__actions">
          <a href="/register" className="Button btn btn-primary Button--small">S'inscrire</a>
          <a href="/home" className="Button btn btn-primary Button--small">Découvrir</a>
        </div>
      </div>
      <div className="Welcome__easy-learning-section">
        <h2 className="Welcome__easy-learning-title">Apprenez facilement grâce à la répétition espacée</h2>
      </div>
    </div>
  );
}
