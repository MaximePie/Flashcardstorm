import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const $ = require('jquery');
require ('popper.js');
require('bootstrap');


import React from "react";
import {
  Switch,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";

import Home from "./components/Home"
import AddKnowledge from "./components/AddKnowledge"

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/add">Add Knowledge</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/add">
            <AddKnowledge />
          </Route>
          <Route path="/train">
            <Home />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
} 