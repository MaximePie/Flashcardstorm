import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import axios from 'axios';
import Cookies from 'js-cookie';

import CountTo from 'react-count-to';
import Drawer from '@material-ui/core/Drawer';
import Badge from '@material-ui/core/Badge';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import { PropTypes } from 'prop-types';
import Icon from './Icon';
import { AuthenticationContext } from '../Contexts/authentication';


Navbar.propTypes = {
  user: PropTypes.shape({
    numberOfMentalQuestions: PropTypes.number,
    numberOfQuestions: PropTypes.number,
    numberOfNewChangelogs: PropTypes.number,
    initial_score: PropTypes.number,
    current_score: PropTypes.number,
  }),
  onCountComplete: PropTypes.func.isRequired,
  countClassName: PropTypes.string,
};

Navbar.defaultProps = {
  countClassName: '',
  user: undefined,
};

export default function Navbar({ user, onCountComplete, countClassName }) {
  const { isConnected } = React.useContext(AuthenticationContext);
  const [isOpen, setOpen] = React.useState(false);


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(open);
  };


  const sideList = () => (
    <div
      className="Navbar__drawer"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List className="navbar-nav mr-auto Navbar__list">
        <Link className="Navbar__link" to="/">
          <ListItem button component="a" className="Navbar__item">
            <ListItemIcon>
              <i className="fas fa-home"/>
            </ListItemIcon>
            <ListItemText>
              Accueil
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
            <Link className="Navbar__link" to="/mental_training">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  {icon('mental')}
                </ListItemIcon>
                <ListItemText>
                  Mode de tête
                </ListItemText>
              </ListItem>
            </Link>
            <Link className="Navbar__link" to="/soft_training">
              <ListItem button component="a" className="Navbar__item">
                <ListItemIcon>
                  {icon('byHeart')}
                </ListItemIcon>
                <ListItemText>
                  Mode par coeur
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
            <Divider/>
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
        <Divider/>
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
        <Divider/>
        <Link className="Navbar__link" to="/about">
          <ListItem button component="a" className="Navbar__item">
            <ListItemIcon>
              {user?.numberOfNewChangelogs && user.numberOfNewChangelogs > 0 ? (
                <Badge color="secondary" badgeContent={user.numberOfNewChangelogs}>
                  <i className="fas fa-question-circle"/>
                </Badge>
              ) : (
                <>
                  <i className="fas fa-question-circle"/>
                </>
              )}
            </ListItemIcon>
            <ListItemText>
              Mises à jour
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
            (user?.numberOfNewChangelogs && user.numberOfNewChangelogs > 0)
            || (user?.numberOfQuestions && user?.numberOfQuestions > 0)
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
              {user && (
                <span className="Navbar__item-profile-score">
                  <CountTo
                    from={user.initial_score}
                    to={user.current_score}
                    speed={1000}
                    className={`Navbar__item-profile-score-counter ${countClassName}`}
                    onComplete={onCountComplete}
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
      .then(() => {
        Cookies.remove('Bearer');
        document.location = '/';
      });
  }

  /**
   * Generates the icon component on the menu based on the feature
   * @param feature
   */
  function icon(feature) {
    let isBadgeDisplayed = false;
    switch (feature) {
      case 'mental':
        isBadgeDisplayed = user?.numberOfMentalQuestions && user.numberOfMentalQuestions > 0
          && document.location.pathname !== '/mental_training';

        return (
          <>
            {isBadgeDisplayed ? (
                <Badge color="secondary" badgeContent={user.numberOfMentalQuestions}>
                  <i className="fas fa-headset"/>
                </Badge>
              )
              : <i className="fas fa-headset"/>
            }
          </>
        );
      case 'byHeart':
        isBadgeDisplayed = user?.numberOfQuestions && user.numberOfQuestions > 0
          && document.location.pathname !== '/soft_training';
        return (
          <>
            {isBadgeDisplayed ? (
              <Badge color="secondary" badgeContent={user.numberOfQuestions}>
                <i className="fas fa-calendar-alt"/>
              </Badge>
            ) : (
              <>
                <i className="fas fa-calendar-alt"/>
              </>
            )}
          </>
        );
      default:
        return (<></>)
    }
  }
}
