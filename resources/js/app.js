import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free'
import React from "react";
import Cookies from "js-cookie";
import {
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";

const $ = require('jquery');
require ('popper.js');
require('bootstrap');
require ("../sass/Icon.scss");
require ("../sass/QuestionCard.scss");
require ("../sass/Home.scss");
require ("../sass/Button.scss");
require ("../sass/Navbar.scss");
require ("../sass/Addknowledge.scss");
require ("../sass/QuestionsList.scss");
require ("../sass/Snackbar.scss");
require ("../sass/Changelogs.scss");


import Button from "./components/Button"
import Home from "./components/Home"
import AddKnowledge from "./components/pages/AddKnowledge"
import Navbar from "./components/Navbar";
import QuestionsList from "./components/pages/QuestionsList";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import server from "./server";
import SoftTraining from "./components/pages/SoftTraining";
import Users from "./components/Users";
import Welcome from "./components/pages/Welcome";
import Changelogs from "./components/Changelogs";

import moment from 'moment'

import { SnackbarProvider } from 'notistack';
import AddChangelog from "./components/pages/AddChangelog";

export default function App() {

  const [user, setUser] = React.useState(undefined);
  const [countClassName, setCountClassName] = React.useState('');
  const is_connected = Cookies.get('Bearer') !== null && Cookies.get('Bearer') !== undefined;

  React.useEffect(() => {
    moment.locale('fr_FR');
    if (is_connected) {
      Cookies.remove('number_of_new_questions');
      Cookies.remove('number_of_new_changelogs');
      updateUser(true)
    }
  }, [is_connected]);

  const isMobile = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) < 768;
  const snackbarConfig = {
    maxSnack: isMobile ? 1 : 3,
    dense: isMobile
  };

  // add action to all snackbars
  const notistackRef = React.createRef();
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      {...snackbarConfig}
      ref={notistackRef}
      action={(key) => (
        <span onClick={onClickDismiss(key)}>
          X
        </span>
      )}
    >
      <BrowserRouter>
        <div className="App">
          <Navbar
            is_connected={is_connected}
            user={user}
            countClassName={countClassName} onCountComplete={() => setCountClassName('')}
          />
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/" strict={true} exact={true}>
              <Welcome />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/soft_training">
              <SoftTraining updateUserScore={updateUser}/>
            </Route>
            <Route path="/logout">
              <Home updateUserScore={updateUser} is_connected={is_connected}/>
            </Route>
            <Route path="/home">
              <Home updateUserScore={updateUser} is_connected={is_connected}/>
            </Route>
            <Route path="/users">
              <Users/>
            </Route>
            <Route path="/add">
              <AddKnowledge is_connected={is_connected}/>
            </Route>
            <Route path="/questions">
              <QuestionsList is_connected={is_connected}/>
            </Route>
            <Route path="/about">
              <Changelogs/>
            </Route>
            {is_connected && (
              <Route path="/profile">
                <Profile />
              </Route>
            )}
            {is_connected && (
              <Route path="/add_changelog">
                <AddChangelog />
              </Route>
            )}
          </Switch>
        </div>
      </BrowserRouter>
    </SnackbarProvider>
  );

  function updateUser(is_initial = false) {
    server.get('me/score/' + Cookies.get('last_checked_at')).then(response => {
      if (!user) {
        setUser({initial_score: response.data.score, current_score: response.data.score});
      }
      else {
        setCountClassName('Navbar__counter-rising');
        setUser({initial_score: user.current_score, current_score: response.data.score})
      }
      if (is_initial) {
        if (window.location.pathname !== '/soft_training') {
          Cookies.set('number_of_new_questions', response.data.number_of_questions > 0 ? response.data.number_of_questions : undefined);
        }
        if (window.location.pathname !== '/about') {
          Cookies.set('number_of_new_changelogs', response.data.number_of_new_changelogs > 0 && response.data.number_of_new_changelogs);
        }
      }
    });
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
} 