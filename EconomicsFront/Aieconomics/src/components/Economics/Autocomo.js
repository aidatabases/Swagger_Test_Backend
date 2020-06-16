import React, { useState } from "react";
import Autocomplete from 'react-autocomplete';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
// import "./Autocomo.css"
import "./Search_Bar.css"
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import dotenv from 'dotenv';
dotenv.config();
// require('dotenv').config({ path: require('find-config')('.env') })

function AutoComo() {

  const history = useHistory();
  const goLogin = () => history.push('login');
    
    const [value,setVal] = useState()
    const [items,setItems] = useState([])

    


    function handleChange(VariableName){
      const url = process.env.REACT_APP_ELASTIC_URL+process.env.REACT_APP_ELASTIC_ECONOMICS_INDEX+'/_search'
      
      var query = {
        "query": {
          "bool": {
            "must": [
              {"fuzzy": {"VariablePath": VariableName}}
            ]
          }
        },
        "aggs": {
          "varpath" : {
            "terms": {
              "field": "VariablePath.keyword"
            }
          }
        },
        "size": 0
      }

      var query2 = {
        "query": {
          "bool": {
            "must": [
              {
                  "query_string" :{
                  "fields": ["VariablePath","Level1","Level2","Level3","Level4","Level5"],
                    "query": `${VariableName}~`,
                    "default_operator":"OR",
                  }
                }
            ]
          }
        },
        "aggs": {
          "varpath" : {
            "terms": {
              "field": "VariablePath.keyword"
            }
          }
        },
        "size": 0
      }


      var query3 = {
        "query": {
          "bool": {
            "must": [
              {
                  "query_string" :{
                  "fields": ["VariablePath"],
                    "query": VariableName,
                    "default_operator":"OR"
                  }
                }
            ]
          }
        },
        "aggs": {
          "varpath" : {
            "terms": {
              "field": "VariablePath.keyword"
            }
          }
        },
        "size": 0
      }

      var query4 = {
        "query": {
          "bool": {
            "must": [
              {
                  "query_string" :{
                  "fields": ["VariablePath"],
                    "query": `${VariableName}`,
                    "default_operator":"OR"
                  }
                }
            ]
          }
        },
        "aggs": {
          "varpath" : {
            "terms": {
              "field": "VariablePath.keyword",
              "order": {
              "max_score": "desc"
            	}
            },
          "aggs": {
            "max_score": {
              "max": {
                "script": "_score"
              }
            }
          }
          }
        },
        "size": 0
      }

      
        
        
      axios.post(url, query4)
      .then( d => {
        if(d.status === 200 ){
         
          let data_list = d.data.aggregations.varpath.buckets
          let list = data_list.map(s => {
          return {'label' :s.key.split("/").join("  ▸  "),'path':s.key.substring(s.key)}
          })
         
          setItems(list)
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
}


const divStyles = {
  left: "0px",
  top: "50px",
  height:"100%",
  // height:"20%",
  overflow:"auto",
  backgroundColor:"whitesmoke",
  zIndex:99

} 

  return (
    <div className="wrap" >
        <div className="search">
           {/* <input type="text" class="searchTerm" placeholder="Soon to be Universal Intutive Search Bar 🤗"  /> */}
           <Autocomplete

            renderInput={(params) => (
              <input type="text" {...params} className="searchTerm" placeholder="Search AI Economics " style={{width:"53vw"}} /> 
            )}
            
            getItemValue={(item) => item.path}
            items={items}
            renderItem={(item, isHighlighted) =>
              <div style={{ padding:'9px',background: isHighlighted ? 'teal' : 'white',width:"55vw",backgroundColor:"white"}}>
              <Link to={`/${item.path}`}>
                {item.label}
                </Link>
              </div>
            }
            value={value}
            onChange={(e) => {setVal(e.target.value);handleChange(e.target.value)}}
            renderMenu={(items) =>  <div style={divStyles} children={items}/>}
            
            
          />

           <div className ="butt">
           <button type="submit" className="searchButton" onClick={(e) => {
             if(items.length !== 0){
            history.push(items[0].path)
             }
            }
             }>
             <i className="fa fa-search"></i>
          </button>
          </div>
        </div>
     </div> 
  )

}





export default AutoComo;