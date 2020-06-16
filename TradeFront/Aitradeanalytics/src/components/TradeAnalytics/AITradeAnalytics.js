import React from 'react';
import Tradeaisearch from './search'; 
import Tables from './tt'
import "./staticEco.css"
import {Switch,Route,useRouteMatch} from "react-router-dom"
import Hscountry from './Hscountry';
import Country from './Country'
import Hscodename from './Hscodename'
// import Items from './Items'
import SecNav from './secNav';

function TradeAnalytics(){
  const { path, browserURL } = useRouteMatch();
  return(
    <>
      <div>
                <SecNav />
                    
          <Switch>
                <Route path={path}>
                <div style={{marginTop:"12.5%"}}>
                  <Tables />
                </div>
                </Route>
                
                <Route exact path={`/trade/:country/:hscode`} component={Hscountry} />
                <Route exact path={`/country/:country`} component={Country}></Route>
                <Route exact path={`/hscode/:hscode`} component={Hscodename}></Route>
                {/* <Route exact path={`${path}/hscode/:hscode`} component={Items} /> */}
                
                
                </Switch>
                </div>
    </>
  )
}

export default TradeAnalytics