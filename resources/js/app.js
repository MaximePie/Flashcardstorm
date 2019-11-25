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
require ("../sass/QuestionCard.scss");
require ("../sass/Home.scss");
require ("../sass/Button.scss");
require ("../sass/Navbar.scss");
require ("../sass/Addknowledge.scss");
require ("../sass/QuestionsList.scss");


import Home from "./components/Home"
import AddKnowledge from "./components/AddKnowledge"
import Navbar from "./components/navbar";
import QuestionsList from "./components/QuestionsList";
import Register from "./components/Register";
import Login from "./components/Login";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar is_connected={Cookies.get('auth') === 'true'}/>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/logout">
            <Home />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/add">
            <AddKnowledge />
          </Route>
          <Route path="/questions">
            <QuestionsList />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
} 