import React from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from '../../helper';
import ebbinghaussImage from '../../../images/ebbinghauss.png';
import progressImage from '../../../images/undraw_destinations_fpv7.svg';
import reachGoalsImage from '../../../images/reach_goals.svg';
import Button from '../atom/Button';

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
          <Link to="/register" className="Button btn btn-primary Button--small">C'est parti !</Link>
        </div>
      </div>
      <div className="Welcome__easy-learning-section">
        <h2 className="Welcome__easy-learning-title">Apprenez facilement grâce à la répétition espacée</h2>
        <div className="Welcome__cards">
          <div className="Welcome__card">
            <h3 className="Welcome__card-title">Maîtrisez la courbe de mémoire</h3>
            <img className="Welcome__card-image" src={ebbinghaussImage} alt="Ebbinghauss curve" />
          </div>
          <div className="Welcome__card">
            <h3 className="Welcome__card-title">Atteignez vos objectifs</h3>
            <img className="Welcome__card-image Welcome__card-image--faded" src={reachGoalsImage} alt="Goals" />
          </div>
          <div className="Welcome__card">
            <h3 className="Welcome__card-title">Consultez votre progression</h3>
            <img
              className="Welcome__card-image Welcome__card-image--faded"
              src={progressImage}
              alt="Progression curve"
            />
          </div>
        </div>
      </div>
      <div className="Welcome__features">
        <div className="Welcome__feature">
          <i className="Welcome__feature-illustration fas fa-calendar" />
          <div className="Welcome__feature-content">
            <h4 className="Welcome__feature-title">Programmation automatique des questions</h4>
            <div className="Welcome__feature-details">
              Espacement des questions jusqu'à 10 jours d'intervale.
            </div>
          </div>
        </div>
        <div className="Welcome__feature">
          <i className="Welcome__feature-illustration fas fa-play" />
          <div className="Welcome__feature-content">
            <h4 className="Welcome__feature-title">Mode d'initiation</h4>
            <div className="Welcome__feature-details">
              Pour les connaissances complexes, nous proposons un exercice qui consiste à créer des paires entre
              les questions et les réponses.
            </div>
          </div>
        </div>
        <div className="Welcome__feature">
          <i className="Welcome__feature-illustration fas fa-user" />
          <div className="Welcome__feature-content">
            <h4 className="Welcome__feature-title">Personnalisé</h4>
            <div className="Welcome__feature-details">
              Accompagnement personnalisé pour une prise en main immédiate
            </div>
          </div>
        </div>
        <div className="Welcome__feature">
          <i className="Welcome__feature-illustration fas fa-users" />
          <div className="Welcome__feature-content">
            <h4 className="Welcome__feature-title">Collaboratif</h4>
            <div className="Welcome__feature-details">
              Les questions sont libres d'accès et chacun est libre de créer son kit
            </div>
          </div>
        </div>
        <div className="Welcome__feature">
          <i className="Welcome__feature-illustration fas fa-chalkboard-teacher" />
          <div className="Welcome__feature-content">
            <h4 className="Welcome__feature-title">Adapté à l'enseignement</h4>
            <div className="Welcome__feature-details">
              Créez votre catégorie de questions et partagez-la avec vos apprenants pour garantir une révision
              parfaite et des connaissances sur le long terme.
            </div>
          </div>
        </div>
        <div className="Welcome__feature">
          <i className="Welcome__feature-illustration fas fa-lightbulb" />
          <div className="Welcome__feature-content">
            <h4 className="Welcome__feature-title">L'utilisateur placé au coeur du produit </h4>
            <div className="Welcome__feature-details">
              Les mises à jour sont communiquées en temps réel, et les utilisateurs peuvent suggérer des améliorations
              qui seront sélectionnées à chaque itération de développement en fonction des votes.
            </div>
          </div>
        </div>
        <div className="Welcome__feature">
          <i className="Welcome__feature-illustration fas fa-box" />
          <div className="Welcome__feature-content">
            <h4 className="Welcome__feature-title">(à venir) Mode aventure </h4>
            <div className="Welcome__feature-details">
              Partez à l'aventure et sauvez la planète en répondant à vos questions !
            </div>
          </div>
        </div>
        <div className="Welcome__link-container">
          <Link to="/register" className="Button btn btn-primary Button--small">S'inscrire gratuitement</Link>
        </div>
      </div>
      <div className="Welcome__footer">
        <div className="Welcome__footer-contact-information">
          <div className="Welcome__footer-contact-field">
            <i className="fas fa-at" />
            maxime.pie.mail@gmail.com
          </div>
          <div className="Welcome__footer-contact-field">
            <i className="fas fa-address-book" />
            186 Cours Emile Zola 69100
          </div>
          <div className="Welcome__footer-contact-field">
            <i className="fas fa-phone" />
            <a href="tel:0618548921">06 18 54 89 21</a>
          </div>
        </div>
        <div className="Welcome__footer-lower-band">
          <div className="Welcome__footer-actions-buttons">
            <h4 className="Welcome__footer-subtitle">En savoir plus</h4>
            <Button
              onClick={() => {}}
              text="Je m'inscris !"
            />
            <Button
              onClick={() => {}}
              text="Découvrir la méthode originale"
              variant="secondary"
            />
          </div>
          <div className="Welcome__footer-links">
            <h4 className="Welcome__footer-subtitle">Ressources</h4>
            <a className="Welcome__footer-link" href="http://educhub.herokuapp.com/">Educhub</a>
            <a className="Welcome__footer-link" href="https://maximepie.fr">maximepie.fr</a>
            <a className="Welcome__footer-link" href="https://www.youtube.com/watch?v=0Hlq42fQACw">
              Présentation de la courbe de la mémoire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
