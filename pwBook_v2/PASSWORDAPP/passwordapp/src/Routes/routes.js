import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Private from "./Private";
import NotFound from "./NoutFound";
import TableTrying from "../tabletrying";
import ForgotPassword from "./forgotpassword";
import ResetPassword from "./resetpassword";
import { Tab } from "react-bootstrap";
var loggedIn = true;
export default () => (
  <BrowserRouter className="cont">
    <Switch>
      <Route path="/" exact component={Login} />

      <Route path="/TableTrying" exact component={TableTrying} />
      <Route path="/forgotpassword" exact component={ForgotPassword} />
      <Route path="/resetpassword/:slug" exact component={ResetPassword} />
      <Route render={() => <NotFound />} />
    </Switch>
  </BrowserRouter>
);
