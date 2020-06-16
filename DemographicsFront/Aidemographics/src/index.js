import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import './index.css';
import Navbaar2 from "components/Home/navbaar2";
import NewFooter from "components/Home/NewFooter";
import Aidemohome from "components/Demographics/Aidemohome";





ReactDOM.render(
  <div >
    <Navbaar2 />  
  <div>
     <Router>
     <Switch>      
      <Route
        path="/"
        render={props => <Aidemohome {...props} />}
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