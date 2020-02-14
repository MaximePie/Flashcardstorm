import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free';
import React from 'react';
import Cookies from 'js-cookie';
import {
  Switch,
  Route,
  BrowserRouter,
} from 'react-router-dom';


import moment from 'moment';
import { SnackbarProvider } from 'notistack';
import AddKnowledge from './components/pages/AddKnowledge';
import Navbar from './components/Navbar';
import QuestionsList from './components/pages/QuestionsList';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Profile from './components/Profile';
import server from './server';
import Training from './components/pages/Training';
import Users from './components/Users';
import Welcome from './components/pages/Welcome';
import Changelogs from './components/pages/Changelogs';


import AddChangelog from './components/pages/AddChangelog';
import AddCategory from './components/pages/AddCategory';
import { isMobile } from './helper';

const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('../sass/Icon.scss');
require('../sass/QuestionCard.scss');
require('../sass/Home.scss');
require('../sass/Navbar.scss');
require('../sass/Addknowledge.scss');
require('../sass/QuestionsList.scss');
require('../sass/Snackbar.scss');
require('../sass/Changelogs.scss');
require('../sass/AddCategory.scss');
require('../sass/Profile.scss');
require('../sass/Register.scss');
require('../sass/Login.scss');
require('../sass/Welcome.scss');

export default function App() {
  const [user, setUser] = React.useState(undefined);
  const [countClassName, setCountClassName] = React.useState('');
  const isConnected = Cookies.get('Bearer') !== null && Cookies.get('Bearer') !== undefined;


  React.useEffect(() => {
    moment.locale('fr_FR');
    if (isConnected) {
      updateUser();
    }
  }, [isConnected]);

  React.useEffect(() => {
    if (isMobile()) {
      const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      $('html, body, .App').css({ width, height });
    }
  }, []);

  const snackbarConfig = {
    maxSnack: isMobile() ? 1 : 3,
    dense: isMobile(),
  };

  // add action to all snackbars
  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      {...snackbarConfig}
      ref={notistackRef}
      action={(key) => (
        <span role="button" onClick={onClickDismiss(key)}>
          X
        </span>
      )}
    >
      <BrowserRouter>
        <div className="App">
          <Navbar
            is_connected={isConnected}
            user={user}
            countClassName={countClassName}
            onCountComplete={() => setCountClassName('')}
          />
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/" strict exact>
              <Welcome />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/soft_training">
              <Training mode="soft" updateUserScore={updateUser} />
            </Route>
            <Route path="/logout">
              <Training updateUserScore={updateUser} is_connected={isConnected} />
            </Route>
            <Route path="/home">
              <Training mode="storm" updateUserScore={updateUser} />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/add">
              <AddKnowledge isConnected={isConnected} />
            </Route>
            <Route path="/questions">
              <QuestionsList is_connected={isConnected} />
            </Route>
            <Route path="/about">
              <Changelogs isConnected={isConnected} />
            </Route>
            {isConnected && (
              <>
                <Route path="/profile">
                  <Profile />
                </Route>
                <Route path="/add_changelog">
                  <AddChangelog />
                </Route>
                <Route path="/add_category">
                  <AddCategory />
                </Route>
              </>
            )}
          </Switch>
        </div>
      </BrowserRouter>
    </SnackbarProvider>
  );

  function updateUser() {
    server.get('me/score').then((response) => {

      const { number_of_questions: numberOfQuestions, number_of_new_changelogs } = response.data;
      const newUser = {};
      if (!user) {
        newUser.initial_score = response.data.score;
        newUser.current_score = response.data.score;
      } else {
        setCountClassName('Navbar__counter-rising');
        newUser.initial_score = user.current_score;
        newUser.current_score = response.data.score;
      }
      if (window.location.pathname !== '/soft_training') {
        newUser.numberOfQuestions = numberOfQuestions;
      }
      if (window.location.pathname !== '/about') {
        newUser.numberOfNewChangelogs = number_of_new_changelogs;
      }

      setUser(newUser);
    });
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
