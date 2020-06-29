import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free';
import React from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


import moment from 'moment';
import { SnackbarProvider } from 'notistack';
import { AuthenticationContext } from './Contexts/authentication';
import AddKnowledge from './components/pages/AddKnowledge';
import Navbar from './components/Navbar';
import QuestionsList from './components/pages/QuestionsList';
import Quest from './components/pages/Quest';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import ErrorPage from './components/pages/Error';
import Profile from './components/Profile';
import server from './server';
import Training from './components/pages/Training';
import RoughTraining from './components/pages/RoughTraining';
import Initiate from './components/pages/Initiate';
import Users from './components/Users';
import Welcome from './components/pages/Welcome';
import Changelogs from './components/pages/Changelogs';


import AddChangelog from './components/pages/AddChangelog';
import AddCategory from './components/pages/AddCategory';
import { isMobile } from './helper';

const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('../sass/AddCategory.scss');
require('../sass/Addknowledge.scss');
require('../sass/Changelogs.scss');
require('../sass/Error.scss');
require('../sass/HintDialog.scss');
require('../sass/Home.scss');
require('../sass/Icon.scss');
require('../sass/Initiate.scss');
require('../sass/Login.scss');
require('../sass/Navbar.scss');
require('../sass/Profile.scss');
require('../sass/Quest.scss');
require('../sass/QuestionCard.scss');
require('../sass/QuestionsList.scss');
require('../sass/QuestionRow.scss');
require('../sass/Register.scss');
require('../sass/RoughTraining.scss');
require('../sass/Snackbar.scss');
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
    <AuthenticationContext.Provider value={isConnected}>
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
          <div className="App" id="App">
            <Navbar
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
              <Route path="/initiate">
                <Initiate />
              </Route>
              <Route path="/logout">
                <Training updateUserScore={updateUser} />
              </Route>
              <Route path="/home">
                <Training mode="storm" updateUserScore={updateUser} />
              </Route>
              <Route path="/users">
                <Users />
              </Route>
              <Route path="/questions">
                <QuestionsList />
              </Route>
              <Route path="/about">
                <Changelogs />
              </Route>
              <Route path="/rough_training">
                {isConnected && <RoughTraining />}
                {!isConnected && <ErrorPage code={403} />}
              </Route>
              {isConnected && (
                <>
                  <Route path="/add">
                    <AddKnowledge />
                  </Route>
                  <Route path="/soft_training">
                    <Training mode="soft" updateUserScore={updateUser} />
                  </Route>
                  <Route path="/profile">
                    <Profile />
                  </Route>
                  <Route path="/quest">
                    <Quest />
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
    </AuthenticationContext.Provider>
  );

  function updateUser() {
    server.get('me/score')
      .then((response) => {
        const { number_of_questions: numberOfQuestions, number_of_new_changelogs: numberOfNewChangelogs } = response.data;
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
          newUser.numberOfNewChangelogs = numberOfNewChangelogs;
        }

        setUser(newUser);
      });
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
