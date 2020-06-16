import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect,Router } from "react-router-dom";

import history from "./components/login/history"
import './index.css';
import App from './App.jsx';
import Navbaar2 from "components/Home/navbaar2";
import Profile from "components/Home/Profile";
import ReactAbout from "components/Home/reactAbout";
import LandingPage from "components/Home/LandingPage";
import NewFooter from "components/Home/NewFooter";





ReactDOM.render(
  <div >
    <Navbaar2 />  
  <div>
     <Router history={history} >
     <Switch>
     <Route
       exact path= "/profile"
        render={props => <Profile {...props} />}
      />
         <Route
        exact path="/About"
        render={props => <ReactAbout {...props} />}
      />     
      <Route
        exact path="/"
        render={props => <LandingPage {...props} />}
      />
      
       <Route
        path="/Login"
        render={props => <App {...props} />}
      />
       <Route
        path="/Register"
        render={props => <App {...props} />}
      />
      <Route path="/">
        <br /><br /><br />  
        <h3>404 Page Not Found!</h3>
      </Route>
        
      </Switch>
      </Router>
  </div>
  <div>
    <NewFooter />
  </div>
</div>,document.getElementById("root")
 );
