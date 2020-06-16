import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,Brush,ResponsiveContainer
} from 'recharts';
import { useParams } from 'react-router';
import axios from 'axios';

export default function Example () {
  const params=useParams()
    var lev1=params.level1key;
    var lev2=params.lev2
    var lev3=params.lev3;
    var lev4=params.lev4;
    var lev5=params.lev5;
    var lev6=params.lev6;
  const [datax,setdata]=useState([])
  const [units,setunits]=useState()
  const [Datasources,setDatasources]=useState()
  var [Notes,setNotes]=useState([])
  var [Description,setDescription]=useState()
  var[x,setx]=useState('')
  
  useEffect(() => {
    
    if(lev4===undefined){
      x=lev3
      var query = {
        "query": {
          "bool":{
            "must":[
              {"match": {"Level1.keyword": lev1}},
              {"match": {"Level2.keyword": lev2}},
              {"match": {"Level3.keyword": lev3}}
              ]
          }
        }
      }
    }
    else if(lev5==undefined)
    {
      x=lev4
      var query = {
        "query": {
          "bool":{
            "must":[
              {"match": {"Level1.keyword": lev1}},
              {"match": {"Level2.keyword": lev2}},
              {"match": {"Level3.keyword": lev3}},
              {"match": {"Level4.keyword": lev4}}
              ]
          }
        }
      }
    }
    else if(lev6==undefined)
    {
      x=lev5
      var query = {
        "query": {
          "bool":{
            "must":[
              {"match": {"Level1.keyword": lev1}},
              {"match": {"Level2.keyword": lev2}},
              {"match": {"Level3.keyword": lev3}},
              {"match": {"Level4.keyword": lev4}},
              {"match": {"Level5.keyword": lev5}}
              ]
          }
        }
      }
    }
    else
    {
      x=lev6
      var query = {
        "query": {
          "bool":{
            "must":[
              {"match": {"Level1.keyword": lev1}},
              {"match": {"Level2.keyword": lev2}},
              {"match": {"Level3.keyword": lev3}},
              {"match": {"Level4.keyword": lev4}},
              {"match": {"Level5.keyword": lev5}},
              {"match": {"Level6.keyword": lev6}}
              ]
          }
        }
      }
    }
    setx(x)
    const url=process.env.REACT_APP_ELASTIC_URL+process.env.REACT_APP_ELASTIC_ECONOMICS_INDEX+"/_search"


    axios.post(url, query)
		.then( d => {
			if(d.status === 200 ){
        let temp_data = d.data.hits.hits[0]._source
        let data =temp_data.data
        let Ndata=[]
        Ndata=temp_data.Notes.match(/[^.]*/g)
        Notes=[]
        for(let i in Ndata)
        {
          if(Ndata[i].length>3)
          {
            Notes.push(Ndata[i])
          }
        }
        setNotes(Notes)
        setDescription(temp_data.Description)
        setDatasources(temp_data.DataSources)
        setunits(temp_data.Units)
				
        let list = []

        for (let [key, value] of Object.entries(data)) {
          let dict = {name : `${key}`}
          dict[x]=value
          list.push(dict)
        }
				

        setdata(list)
        
			}
			else{
				console.log("err")
			}
		})
		.catch( error => {
			if (error) {
			  console.log(error)
			}
			else{
				console.log("Error!");
			}
		});
    }, [lev1,lev2,lev3,lev4,lev5])


  return (<div ><h1>{lev1} ▸ {lev2} ▸ {x}</h1><h4>    (in {units})</h4><br/>
  <div style={{ zIndex:1 ,boxShadow: "0 0 1px 1px rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
  <ResponsiveContainer width="99%" height={500}>
      <LineChart
        width={1450}
        height={600}
        data={datax}
        margin={{
          top: 20, right: 0, left: 5, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Brush dataKey="name" height={30} stroke="#000000" />
        <Line type="monotone" dataKey={x} stroke="#000000" />
        
      </LineChart>
      </ResponsiveContainer>
      </div>
      <hr></hr>
      <h3 style={{display:"inline"}}><b>Datasources: </b></h3><h4 style={{display:"inline"}}>{Datasources}</h4>
      <hr></hr>
      <h3 style={{display:"inline"}}><b>Description: </b><br/></h3><h4 style={{display:"flex", paddingLeft:"1.5vw"}}>{Description}</h4>
      <hr></hr>
      <h3 style={{display:"inline"}} ><b>Notes: </b></h3><br></br><ol>{Notes.map((item)=>(<li>{item}</li>))}</ol>
      <hr></hr>
      
      </div>
    );
}
