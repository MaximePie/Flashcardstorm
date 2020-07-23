import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import axios from 'axios';
import Cookies from 'js-cookie';

import CountTo from 'react-count-to';
import Drawer from '@material-ui/core/Drawer';
import Badge from '@material-ui/core/Badge';
import Icon from './Icon';
import { isMobile } from '../helper';
import { AuthenticationContext } from '../Contexts/authentication';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

export default function Navbar(props) {

  const isConnected = React.useContext(AuthenticationContext);

  const number_of_new_questions = props.user?.numberOfQuestions;
  const numberOfNewChangelogs = props.user?.numberOfNewChangelogs;

  const [isOpen, setOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(open);
  };


  const sideList = (side) => (
    <div
      className="Navbar__drawer"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List className="navbar-nav mr-auto Navbar__list">
        <Link className="Navbar__link" to="/home">
          <ListItem button component="a" className="Navbar__item">
            <ListItemIcon>
              <i className="fas fa-home"/>
            </ListItemIcon>
            <ListItemText>
              Accueil
            </ListItemText>
          </ListItem>
        </Link>
        <Link className="Navbar__link" to="/home">
          <ListItem button component="a" className="Navbar__item">
            <ListItemIcon>
              <i className="fas fa-cloud-meatball"/>
            </ListItemIcon>
            <ListItemText>
              Mode tempête
            </ListItemText>
          </ListItem>
        </Link>
        {isConnected && (
          <>
            <Link className="Navbar__link" to="/initiate">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-play"/>
                </ListItemIcon>
                <ListItemText>
                  Mode initiation
                </ListItemText>
              </ListItem>
            </Link>
            <Link className="Navbar__link" to="/soft_training">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  {number_of_new_questions && number_of_new_questions > 0 ? (
                    <Badge color="secondary" badgeContent={number_of_new_questions}>
                      <i className="fas fa-calendar-alt"/>
                    </Badge>
                  ) : (
                    <>
                      <i className="fas fa-calendar-alt"/>
                    </>
                  )}
                </ListItemIcon>
                <ListItemText>
                  Mode révisions
                </ListItemText>
              </ListItem>
            </Link>
            <Link className="Navbar__link" to="/rough_training">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-fire"/>
                </ListItemIcon>
                <ListItemText>
                  Mode rapide
                </ListItemText>
              </ListItem>
            </Link>
            <Divider />
            <Link className="Navbar__link" to="/add">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-folder-plus"/>
                </ListItemIcon>
                <ListItemText>
                  Ajouter des questions
                </ListItemText>
              </ListItem>
            </Link>
            <Link className="Navbar__link" to="/add_category">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-folder-plus"/>
                </ListItemIcon>
                <ListItemText>
                  Ajouter des categories
                </ListItemText>
              </ListItem>
            </Link>
          </>
        )}
        <Link className="Navbar__link" to="/questions">
          <ListItem button component="a" className="Navbar__item">
            <ListItemIcon>
              <i className="fas fa-list"/>
            </ListItemIcon>
            <ListItemText>
              Afficher toutes les questions
            </ListItemText>
          </ListItem>
        </Link>
        <Divider />
        {!isConnected && (
          <>
            <Link className="Navbar__link" to="/register">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-user-plus"/>
                </ListItemIcon>
                <ListItemText>
                  S'enregistrer
                </ListItemText>
              </ListItem>
            </Link>
            <Link className="Navbar__link" to="/login">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-sign-in-alt"/>
                </ListItemIcon>
                <ListItemText>
                  Se connecter
                </ListItemText>
              </ListItem>
            </Link>
          </>
        )}
        {isConnected && (
          <>
            <Link className="Navbar__link" to="/users">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-users"/>
                </ListItemIcon>
                <ListItemText>
                  Afficher les utilisateurs
                </ListItemText>
              </ListItem>
            </Link>
            <Link className="Navbar__link" to="/profile">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-user"/>
                </ListItemIcon>
                <ListItemText>
                  Mon profil
                </ListItemText>
              </ListItem>
            </Link>
            <ListItem button component="a" onClick={logout} className="Navbar__item">
              <ListItemIcon>
                <i className="fas fa-sign-out-alt"/>
              </ListItemIcon>
              <ListItemText>
                Se déconnecter
              </ListItemText>
            </ListItem>
          </>
        )}
        <Divider />
        <Link className="Navbar__link" to="/about">
          <ListItem button component="a" className="Navbar__item">
            <ListItemIcon>
              {numberOfNewChangelogs && numberOfNewChangelogs > 0 ? (
                <Badge color="secondary" badgeContent={numberOfNewChangelogs}>
                  <i className="fas fa-question-circle"/>
                </Badge>
              ) : (
                <>
                  <i className="fas fa-question-circle"/>
                </>
              )}
            </ListItemIcon>
            <ListItemText>
              Consulter les mises à jours
            </ListItemText>
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <div className="Navbar">
      <nav className="Navbar__nav navbar navbar-expand-lg navbar-light bg-light">
        <button
          className="Navbar__toggler navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpen(true)}
        >
          <Icon name="bars" className="Navbar__drawer-icon"/>
        </button>
        <button
          className="Navbar__toggler-wide"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpen(true)}
        >
          {
            (numberOfNewChangelogs && numberOfNewChangelogs > 0)
            || (number_of_new_questions && number_of_new_questions > 0)
              ? (
                <Badge color="secondary" variant="dot">
                  <Icon name="bars" className="Navbar__drawer-icon"/>
                </Badge>
              ) : (
                <Icon name="bars" className="Navbar__drawer-icon"/>
              )
          }
        </button>
        <Drawer open={isOpen} onClose={toggleDrawer(false)}>
          {sideList('left')}
        </Drawer>
        <div className="Navbar__item-profile">
          {isConnected && (
            <div className="Navbar__item-profile-container">
              <a href="/profile" className="Navbar__item-profile-icon-link">
                <i className="Navbar__item-profile-icon fas fa-user-circle"/>
              </a>
              {props.user && (
                <span className="Navbar__item-profile-score">
                  <CountTo
                    from={props.user.initial_score}
                    to={props.user.current_score}
                    speed={1000}
                    className={`Navbar__item-profile-score-counter ${props.countClassName}`}
                    onComplete={props.onCountComplete}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );

  function logout() {
    axios.get('/logout')
      .then((response) => {
        Cookies.remove('Bearer');
        document.location = '/home';
      });
  }
}
