import React, { useState, useEffect } from "react"
import DatatablePage from "./Table";
import { useParams } from "react-router";
import DistMap from "./India-dist";
import axios from "axios";
import { Link } from "react-router-dom";

var jsondata ={
  "Maharashtra":{path:"/maharashtra.json",main_name:"maharashtra_district",name : "Maharashtra"},
  "Gujarat":{path:"/gujarat.json",main_name:"gujarat_district",name : "Gujarat"},
  "Delhi":{path:"/delhi.json",main_name:"delhi_district",name : "Delhi"},
  "Madhya Pradesh":{path:"/madhyapradesh.json",main_name:"madhyapradesh_district",name : "Madhya Pradesh"},
  "Tamilnadu":{path:"/tamilnadu.json",main_name:"tamilnadu_district",name : "Tamilnadu"},
  "Uttar Pradesh":{path:"/uttarpradesh.json",main_name:"uttarpradesh_district",name : "Uttar Pradesh"},
  "Andhra Pradesh":{path:"/andhrapradesh.json",main_name:"andhrapradesh_district",name : "Andhra Pradesh"},
  "Telangana":{path:"/telangana.json",main_name:"telangana_district",name : "Telangana"}
  
  
  
  };
  function Districtdata(props) {
    const params=useParams()
    const [selected,setSelected] = useState("confirmed")
    const stateselected=params.statename
    var [temp,settemp]=useState([])
    const[list,setlist]=useState([])

    useEffect(()=>{
    
        const stateurl = "https://api.covid19india.org/data.json"
        axios.get(stateurl)
        .then( d => {
          if(d.status === 200 ){
            let data = d.data.statewise
            let y=[]
            for(let i in data)
            {
                y[data[i].state]={"Total":{"confirmed":data[i].confirmed,"deaths":data[i].deaths,"active":data[i].active,"recovered":data[i].recovered}}
            }
            setlist(y)
          }
          else{
            console.log("err")
          }
        })
        const disturl = "https://api.covid19india.org/state_district_wise.json"
        axios.get(disturl)
        .then( data => {
          if(data.status === 200 ){
                    let temp = []
                    let d=data.data
                    for(let item in d){
                        let x=d[item].districtData
                        
                            temp[item]=x
                    }
                    
                    settemp(temp)
                }
            }
        )

        
},[])
let data=temp
for(let i in data){
    for(let j in list[i])
    data[i][j]=list[i][j]
}
data["India"]=list["Total"]

console.log(data[stateselected])
//Table construction
let exp=data[stateselected]
let rows=[]
for(let i in exp)
{
  if(i!='Total')
  rows.push({"district":i,'confirmed':parseInt(exp[i].confirmed),'active':parseInt(exp[i].active),'deaths':parseInt(exp[i].deceased),'recovered':parseInt(exp[i].recovered)})
}


var columns= [
  {
    label: 'DistrictName',
    field: 'district',
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
                setSelected(e.target.value)
              }}>
              <option value="" disabled selected>Select Variable</option>
              <option value="active">Active</option>
              <option value="confirmed">Confirmed</option>
              <option value="deceased">Deaths</option>
              </select>
      <br/>
      <br/>
        <div style={{display:"flex",direction:"row"}}>
        <div style={{height:"1000",marginLeft:"500",width:"50%"}}>
        
        <DatatablePage data={tabledata} xscrolling={false} yscrolling={true} searching={true} />
        </div>
  
      <div style={{float:"right"}}>
        <h1>Districtsmap</h1>
        <DistMap data={data} variable={selected} statename={stateselected} />
        </div>
      </div>
      
  
        </div>
        </>
    )
  
  }

export default Districtdata
