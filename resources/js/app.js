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


import Home from "./components/Home"
import AddKnowledge from "./components/AddKnowledge"
import Navbar from "./components/Navbar";
import QuestionsList from "./components/QuestionsList";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import server from "./server";
import SoftTraining from "./components/SoftTraining";
import Users from "./components/Users";
import Welcome from "./components/pages/Welcome";
import Changelogs from "./components/Changelogs";

import { SnackbarProvider } from 'notistack';

export default function App() {

  const [user, setUser] = React.useState(undefined);
  const [countClassName, setCountClassName] = React.useState('');
  const is_connected = Cookies.get('Bearer') !== null && Cookies.get('Bearer') !== undefined;

  React.useEffect(() => {
    if (is_connected) {
      updateUser()
    }
  }, [is_connected]);

  return (
    <SnackbarProvider maxSnack={3} >
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
          </Switch>
        </div>
      </BrowserRouter>
    </SnackbarProvider>
  );

  function updateUser() {
    server.get('me/score').then(response => {
      if (!user) {
        setUser({initial_score: response.data.score, current_score: response.data.score});
      }
      else {
        setCountClassName('Navbar__counter-rising');
        setUser({initial_score: user.current_score, current_score: response.data.score})
      }
    });
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
} 