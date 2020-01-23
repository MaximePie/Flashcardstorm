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
import Changelogs from './components/Changelogs';


import AddChangelog from './components/pages/AddChangelog';
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
      Cookies.remove('number_of_new_questions');
      Cookies.remove('number_of_new_changelogs');
      updateUser(true);
    }
  }, [isConnected]);

  React.useEffect(() => {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    $('html, body, .App').css({ width, height });
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
              <AddKnowledge is_connected={isConnected} />
            </Route>
            <Route path="/questions">
              <QuestionsList is_connected={isConnected} />
            </Route>
            <Route path="/about">
              <Changelogs />
            </Route>
            {isConnected && (
              <Route path="/profile">
                <Profile />
              </Route>
            )}
            {isConnected && (
              <Route path="/add_changelog">
                <AddChangelog />
              </Route>
            )}
          </Switch>
        </div>
      </BrowserRouter>
    </SnackbarProvider>
  );

  function updateUser(isInitial = false) {
    server.get(`me/score/${Cookies.get('last_checked_at')}`).then((response) => {
      if (!user) {
        setUser({ initial_score: response.data.score, current_score: response.data.score });
      } else {
        setCountClassName('Navbar__counter-rising');
        setUser({ initial_score: user.current_score, current_score: response.data.score });
      }
      if (isInitial) {
        if (window.location.pathname !== '/soft_training') {
          Cookies.set(
            'number_of_new_questions',
            response.data.number_of_questions > 0 ? response.data.number_of_questions : undefined,
          );
        }
        if (window.location.pathname !== '/about') {
          Cookies.set(
            'number_of_new_changelogs',
            response.data.number_of_new_changelogs > 0 && response.data.number_of_new_changelogs,
          );
        }
      }
    });
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
