import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import axios from "axios";
import Cookies from "js-cookie";


export default function Navbar(props) {
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
        <button
          className="Navbar__toggler-wide"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Avatar className="Navbar__logo" alt="GIPSI Logo" src="/images/logo.png" />
        </button>
        <a className="navbar-brand" href="/home">FlashcardStorm</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <List className="navbar-nav mr-auto Navbar__list">
            <span className="Navbar__side-container">
              <ListItem button component="a" href="/home" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-edit"/>
                </ListItemIcon>
                <ListItemText>
                  Entraînement
                </ListItemText>
              </ListItem>
              <ListItem button component="a" href="/questions" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-list"/>
                </ListItemIcon>
                <ListItemText>
                  Questions
                </ListItemText>
              </ListItem>
              <ListItem button component="a" href="/add" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-folder-plus"/>
                </ListItemIcon>
                <ListItemText>
                  Ajouter des questions
                </ListItemText>
              </ListItem>
            </span>
          </List>
          <List>
            <span className="Navbar__side-container">
              <ListItem button component="a" href="/register" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-user-plus"/>
                </ListItemIcon>
                <ListItemText>
                  S'enregistrer
                </ListItemText>
              </ListItem>
              <ListItem button component="a" href="/login" className="Navbar__item">
                <ListItemIcon>
                  <i className="fas fa-sign-in-alt"/>
                </ListItemIcon>
                <ListItemText>
                  Se connecter
                </ListItemText>
              </ListItem>
              {props.is_connected && (
                <ListItem button component="a" onClick={logout} className="Navbar__item">
                  <ListItemIcon>
                    <i className="fas fa-sign-out-alt"/>
                  </ListItemIcon>
                  <ListItemText>
                    Se déconnecter
                  </ListItemText>
                </ListItem>
              )}
            </span>
          </List>
          {props.is_connected && (
            <div className="Navbar__item-profile">
              <a href="/profile" className="Navbar__item-profile-icon-link">
                <i className="Navbar__item-profile-icon fas fa-user-circle"/>
              </a>
              <span className="Navbar__item-profile-score">{props.user && props.user.score}</span>
            </div>
          )}
        </div>
      </nav>
    </div>
  )

  function logout() {
    axios.get('/logout').then(response => {
      Cookies.remove('Bearer');
      document.location = "/home";
    })
  }
}
