import React, { Component } from 'react'
import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";

import AutoComo from './Autocomo';
import LeftNdRight from './LeftNdRight';
import EconomicsHome from './EconomicsHome';
import EcoNav from './Eco-Nav';

import "./AIEconomics.css";

function Economics(){
    const { path, browserURL } = useRouteMatch();
    return (
        <div>
            <div>
                <div>
                    <EcoNav/>
                </div>
                <div >
                    <div className="search-in-economics" style={{paddingTop:"10vh", paddingLeft:"0vw",}}>
                    <AutoComo />
                    </div>                     
                </div>  
            </div>
            <div>
            <Switch>
                <Route exact path="/">
                    <EconomicsHome />
                </Route>

                <Route path="/:level1key"><LeftNdRight /></Route>
                
            </Switch>
            </div>
        </div>
    )
}


export default  Economics