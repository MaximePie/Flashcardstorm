import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free';
import React from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import '../sass/imports.scss';


import moment from 'moment';
import { SnackbarProvider } from 'notistack';
import { AuthenticationContext } from './Contexts/authentication';
import { UserContext } from './Contexts/user';
import { viewportContext } from './Contexts/viewport';

import AddKnowledge from './components/pages/AddKnowledge';
import Navbar from './components/Navbar';
import QuestionsList from './components/pages/QuestionsList';
import Quest from './components/pages/Quest';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import ErrorPage from './components/pages/Error';
import Profile from './components/pages/Profile';
import server from './server';
import ByHeartTraining from './components/pages/ByHeartTraining';
import RoughTraining from './components/pages/RoughTraining';
import Initiate from './components/pages/Initiate';
import Users from './components/Users';
import Welcome from './components/pages/Welcome';
import Changelogs from './components/pages/Changelogs';

import AddChangelog from './components/pages/AddChangelog';
import AddCategory from './components/pages/AddCategory';
import MentalTraining from './components/pages/MentalTraining';

const $ = require('jquery');
require('popper.js');
require('bootstrap');

export default function App() {
  const [user, setUser] = React.useState(undefined);
  const [countClassName, setCountClassName] = React.useState('');
  const isConnected = Cookies.get('Bearer') !== null && Cookies.get('Bearer') !== undefined;
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const [isMobile, setMobileStatus] = React.useState(viewportWidth < 1000);
  const [byHeartQuestionsCount, setByHeartQuestionsCount] = React.useState(0);

  window.onresize = () => {
    const newViewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    setMobileStatus(newViewportWidth < 1000);
  };


  const browserHistory = createBrowserHistory();

  React.useEffect(() => {
    moment.locale('fr_FR');
    if (isConnected) {
      updateUser();
    }
  }, [isConnected]);

  const snackbarConfig = {
    maxSnack: isMobile ? 1 : 3,
    dense: isMobile,
  };

  // add action to all snackbars
  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  /**
   * Decrements the Mental Questions Count
   */
  function decrementMentalQuestionsCount() {
    if (user) {
      let updatedMentalQuestionsCount = user.numberOfMentalQuestions - 1;
      if (user.numberOfMentalQuestions === 0) {
        updatedMentalQuestionsCount = 0;
      }
      setUser({
        ...user,
        mentalQuestionsCount: updatedMentalQuestionsCount,
      })
    }
  }

  return (
    <AuthenticationContext.Provider value={{ isConnected, userId: user?.id}}>
      <UserContext.Provider value={{
        mentalQuestionsCount: user?.numberOfMentalQuestions,
        byHeartQuestionsCount: byHeartQuestionsCount,
        decrementHeartQuestionsCount: decrementMentalQuestionsCount,
        decrementMentalQuestionsCount: () => {setMentalQuestionsCount(mentalQuestionsCount - 1)}
      }}>
        <viewportContext.Provider value={isMobile}>
        <SnackbarProvider
          {...snackbarConfig}
          ref={notistackRef}
          action={(key) => (
            <span role="button" onClick={onClickDismiss(key)}>
              X
            </span>
          )}
        >
          <BrowserRouter history={browserHistory}>
            <div className="App" id="App">
              <Navbar
                user={user}
                countClassName={countClassName}
                onCountComplete={() => setCountClassName('')}
              />
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
                  <ByHeartTraining updateUserScore={updateUser} />
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
                <Route path="/add">
                  {isConnected && <AddKnowledge />}
                  {!isConnected && <ErrorPage code={403} />}
                </Route>
                <Route path="/soft_training">
                  {isConnected && <ByHeartTraining updateUserScore={updateUser} />}
                  {!isConnected && <ErrorPage code={403} />}
                </Route>
                <Route path="/mental_training">
                  {isConnected && <MentalTraining updateUserScore={updateUser} />}
                  {!isConnected && <ErrorPage code={403} />}
                </Route>
                <Route path="/profile">
                  {isConnected && <Profile />}
                  {!isConnected && <ErrorPage code={403} />}
                </Route>
                <Route path="/quest">
                  {isConnected && <Quest />}
                  {!isConnected && <ErrorPage code={403} />}
                </Route>
                <Route path="/add_changelog">
                  {isConnected && <AddChangelog />}
                  {!isConnected && <ErrorPage code={403} />}
                </Route>
                <Route path="/add_category">
                  {isConnected && <AddCategory />}
                  {!isConnected && <ErrorPage code={403} />}
                </Route>
              </Switch>
            </div>
          </BrowserRouter>
        </SnackbarProvider>
      </viewportContext.Provider>
      </UserContext.Provider>
    </AuthenticationContext.Provider>
  );

  function updateUser() {
    server.get('me/score')
      .then((response) => {
        const {
          number_of_questions: numberOfQuestions,
          numberOfMentalQuestions,
          number_of_new_changelogs: numberOfNewChangelogs,
          userId,
        } = response.data;
        const newUser = {};
        if (!user) {
          newUser.initial_score = response.data.score;
          newUser.current_score = response.data.score;
        } else {
          setCountClassName('Navbar__counter-rising');
          newUser.initial_score = user.current_score;
          newUser.current_score = response.data.score;
        }
        if (window.location.pathname !== '/about') {
          newUser.numberOfNewChangelogs = numberOfNewChangelogs;
        }

        newUser.numberOfQuestions = numberOfQuestions;
        newUser.numberOfMentalQuestions = numberOfMentalQuestions;
        newUser.id = userId;

        setUser(newUser);
      });
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}
