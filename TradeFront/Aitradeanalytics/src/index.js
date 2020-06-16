import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router,Route, Switch, Redirect } from "react-router-dom";
import TradeAnalytics from "components/TradeAnalytics/AITradeAnalytics";

import Navbaar2 from "components/Home/navbaar2";





ReactDOM.render(
    <div><Navbaar2 />
<Router >
     <Switch>
     
      <Route path="/" ><TradeAnalytics/></Route>

      <Route path="/">
        <br /><br /><br />  
        <h3>404 Page Not Found!Go to route....../AI-TradeAnalytics</h3>
      </Route>
       
      </Switch>
      </Router>
      </div>
  ,document.getElementById("root")
 );