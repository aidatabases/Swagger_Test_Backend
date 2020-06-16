import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Economics from "components/Economics/AIEconomics";
import Navbaar2 from "components/Home/navbaar2";
import NewFooter from "components/Home/NewFooter";

ReactDOM.render(
  <div>
<Navbaar2/>
<Router >
     <Switch>
     
      <Route
        path="/"
        render={props => <Economics {...props} />}
      />
      
      <Route path="/">
        <br /><br /><br />  
        <h3>404 Page Not Found!Go to route....../AI-Economics</h3>
      </Route>
        
      </Switch>
      </Router>
      <NewFooter/>
      </div>
 ,document.getElementById("root")
 );
