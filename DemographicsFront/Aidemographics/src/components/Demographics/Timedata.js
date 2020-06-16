import React, { useState } from 'react';
import Axios from 'axios';
import Tscharts from './Tscharts'
import { Card } from 'reactstrap';

export default function Timedata() {
    const[confirmedlist,setconfirmedlist]=useState([])
    const[activelist,setactivelist]=useState([])
    const[deceasedlist,setdeceasedlist]=useState([])
    const[recoveredlist,setrecoveredlist]=useState([])
    const timeseries = "https://api.covid19india.org/data.json"
    Axios.get(timeseries)
    .then( d => {
      if(d.status === 200 ){
        d=d.data.cases_time_series
        for(let i in d)
        {
            confirmedlist.push({date:d[i].date,"totalconfirmed":parseInt(d[i].totalconfirmed)})
            activelist.push({date:d[i].date,"totalactive":parseInt(d[i].totalconfirmed-d[i].totaldeceased-d[i].totalrecovered)})
            deceasedlist.push({date:d[i].date,"totaldeceased":parseInt(d[i].totaldeceased)})
            recoveredlist.push({date:d[i].date,"totalrecovered":parseInt(d[i].totalrecovered)})
        }
        setconfirmedlist(confirmedlist)
        setactivelist(activelist)
        setdeceasedlist(deceasedlist)
        setrecoveredlist(recoveredlist)

      }
      else{
        console.log("err")
      }
    })
    if(confirmedlist.length!=0)
    {return (
        <div>
            <Card style={{backgroundColor:"black",borderRadius:"20px",padding:"20px",margin:'20px'}}>
                <Tscharts data={confirmedlist} xdata="date" ydata="totalconfirmed"/>
            </Card>
            
            <Card style={{backgroundColor:"black",borderRadius:"20px",padding:"20px",margin:'20px'}}>
                <Tscharts data={activelist} xdata="date" ydata="totalactive"/>
            </Card>
            <Card style={{backgroundColor:"black",borderRadius:"20px",padding:"20px",margin:'20px'}}>
                <Tscharts data={deceasedlist} xdata="date" ydata="totaldeceased"/>
            </Card>
            <Card style={{backgroundColor:"black",borderRadius:"20px",padding:"20px",margin:'20px'}}>
                <Tscharts data={recoveredlist} xdata="date" ydata="totalrecovered"/>
            </Card>
        </div>
            
            
          
        );}
        return(<h1>Loading..</h1>)
}
