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

export default function Navbar(props) {
  const number_of_new_questions = Cookies.get('number_of_new_questions');

  const numberOfNewChangelogs = Cookies.get('number_of_new_changelogs');

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
        <ListItem button component="a" href="/home" className="Navbar__item">
          <ListItemIcon>
            <i className="fas fa-cloud-meatball" />
          </ListItemIcon>
          <ListItemText>
            Mode tempête
          </ListItemText>
        </ListItem>
        {props.is_connected && (
          <ListItem button component="a" href="/soft_training" className="Navbar__item">
            <ListItemIcon>
              {number_of_new_questions && number_of_new_questions > 0 ? (
                <Badge color="secondary" badgeContent={number_of_new_questions}>
                  <i className="fas fa-calendar-alt" />
                </Badge>
              ) : (
                <>
                  <i className="fas fa-calendar-alt" />
                </>
              )}
            </ListItemIcon>
            <ListItemText>
              Mode entraînement planifié
            </ListItemText>
          </ListItem>
        )}
        <ListItem button component="a" href="/questions" className="Navbar__item">
          <ListItemIcon>
            <i className="fas fa-list" />
          </ListItemIcon>
          <ListItemText>
            Questions
          </ListItemText>
        </ListItem>
        <ListItem button component="a" href="/add" className="Navbar__item">
          <ListItemIcon>
            <i className="fas fa-folder-plus" />
          </ListItemIcon>
          <ListItemText>
            Ajouter des questions
          </ListItemText>
        </ListItem>
        {!props.is_connected && (
          <>
            <ListItem button component="a" href="/register" className="Navbar__item">
              <ListItemIcon>
                <i className="fas fa-user-plus" />
              </ListItemIcon>
              <ListItemText>
                S'enregistrer
              </ListItemText>
            </ListItem>
            <ListItem button component="a" href="/login" className="Navbar__item">
              <ListItemIcon>
                <i className="fas fa-sign-in-alt" />
              </ListItemIcon>
              <ListItemText>
                Se connecter
              </ListItemText>
            </ListItem>
          </>
        )}
        {props.is_connected && (
          <>
            <ListItem button component="a" href="/users" className="Navbar__item">
              <ListItemIcon>
                <i className="fas fa-users" />
              </ListItemIcon>
              <ListItemText>
                Utilisateurs
              </ListItemText>
            </ListItem>
            <ListItem button component="a" onClick={logout} className="Navbar__item">
              <ListItemIcon>
                <i className="fas fa-sign-out-alt" />
              </ListItemIcon>
              <ListItemText>
                Se déconnecter
              </ListItemText>
            </ListItem>
          </>
        )}
        <ListItem button component="a" href="/about" className="Navbar__item">
          <ListItemIcon>
            {numberOfNewChangelogs && numberOfNewChangelogs > 0 ? (
              <Badge color="secondary" badgeContent={numberOfNewChangelogs}>
                <i className="fas fa-question-circle" />
              </Badge>
            ) : (
              <>
                <i className="fas fa-question-circle" />
              </>
            )}
          </ListItemIcon>
          <ListItemText>
            à propos
          </ListItemText>
        </ListItem>
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
          <Icon name="bars" className="Navbar__drawer-icon" />
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
                  <Icon name="bars" className="Navbar__drawer-icon" />
                </Badge>
              ) : (
                <Icon name="bars" className="Navbar__drawer-icon" />
              )
}
        </button>
        <Drawer open={isOpen} onClose={toggleDrawer(false)}>
          {sideList('left')}
        </Drawer>
        <div className="Navbar__item-profile">
          <a className="navbar-brand Navbar__home-link" href="/home">
            <Avatar className="Navbar__logo" alt="GIPSI Logo" src="/images/logo.png" />
            <div className="Navbar__logo-text">
              FlashcardStorm
            </div>
          </a>
          {props.is_connected && (
            <div className="Navbar__item-profile-container">
              <a href="/profile" className="Navbar__item-profile-icon-link">
                <i className="Navbar__item-profile-icon fas fa-user-circle" />
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

  function logout() {
    axios.get('/logout').then((response) => {
      Cookies.remove('Bearer');
      document.location = '/home';
    });
  }
}
