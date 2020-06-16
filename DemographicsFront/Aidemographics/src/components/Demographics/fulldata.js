import React, { Component ,useEffect ,useState } from 'react'
import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
    useHistory
  } from "react-router-dom";
  import axios from 'axios'

import DemoNav from './demo-nav';
import DemoDrop from './demodropdowns';
import Statedata from './Statedata';
import Districtdata from './Districtdata';
// "India":{path:"/india.json",main_name:"india",name : "India"},
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


function Aidemohome(){

    const history = useHistory();
    console.log(history)
    const { path, browserURL } = useRouteMatch();
    var [temp,settemp]=useState([])
    const[list,setlist]=useState([])
console.log(path)

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
        let data=temp
        for(let i in data){
            for(let j in list[i])
            data[i][j]=list[i][j]
        }
        data["India"]=list["Total"]
        return data
        
},[])

}
let data=Aidemohome()

export default data