import React, { useState, useEffect } from "react"
import axios from 'axios'
import DatatablePage from "./Table";
import IndiaMap from "./Indiamap"
import { Link } from "react-router-dom";
import Tscharts from './Tscharts'
import Timedata from "./Timedata";
import { Card } from "reactstrap";
import Example from "./Topcharts";
import Topdata from "./Topdata";
function Statedata(props) {
 
  const url = "https://api.covid19india.org/data.json"
  const [selected,setSelected] = useState("deaths")
  
let data=props.data
let top=[]
let rows=[]
for(let i in data)
{
  if(data[i]!=undefined)
  {
    if(i!='India')
    rows.push({"state":<Link to={i} style={{color:'green'}}>{i}</Link>,'confirmed':parseInt(data[i].Total.confirmed),'active':parseInt(data[i].Total.active),'deaths':parseInt(data[i].Total.deaths),'recovered':parseInt(data[i].Total.recovered)})
    else if(i=='India')
    {
      var d=data['India'].Total
      for(let i in d)
      top.push({label:i,value:d[i]})
    }
  }
}
  var columns= [
    {
      label: 'StateName',
      field: 'state',
      sort: 'asc',
      width:150
    },
    {
      label: 'Confirmed',
      field: 'confirmed',
      sort: 'asc',
      width:150
    },
    {
      label: 'Active',
      field: 'active',
      sort: 'asc',
      width:150
    },
    {
      label: 'Deaths',
      field: 'deaths',
      sort: 'asc',
      width:150
    },
    {
      label: 'Recovered',
      field: 'recovered',
      sort: 'asc',
      width:150
    }
  ]
  let tabledata={columns,rows}

  
  return (
    <>
    <div>
            <select defaultValue={selected} onChange={e=>{
              setSelected(e.target.value)}}>
            <option value="" disabled selected>Select Variable</option>
            <option value="active">Active</option>
            <option value="confirmed">Confirmed</option>
            <option value="deaths">Deaths</option>
            </select>
    <br/>
    <br/>
      <div style={{display:"flex",direction:"row"}}>
      <div style={{height:"1000",marginLeft:"500",width:"50%"}}>
        <div style={{display:"flex",direction:"row"}}>
      {top.map(s=>(
        <Card style={{borderRadius:'10px',color:'smokewhite',padding:'10px',marginRight:'10px',width:'400px'}}><div>{s.label}<br></br>{s.value}<br></br><Topdata variable={s.label}/></div></Card>
      ))}
      </div>
      <DatatablePage data={tabledata} xscrolling={false} yscrolling={true} searching={true} />
      <Timedata/>
      </div>

    <div style={{float:"right"}}>
      <IndiaMap data={props.data} variable ={selected} />
      </div>
    </div>
      </div>
      </>
  )

}
export default Statedata



 