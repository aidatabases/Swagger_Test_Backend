import React, { useEffect, useState } from "react";
import axios from "axios";
import {useParams, Link,useLocation,useRouteMatch} from "react-router-dom"
// import {URL} from 'react-do'
require('dotenv').config();


function Leftdivision(props) {
	const browserHistory = useRouteMatch()
	const browserURL = browserHistory.url
const params = useParams()
const level1key=params.level1key
const [list, setData] = useState([]);
const [first,setfirst]=useState();

  useEffect(() => {
	const url=process.env.REACT_APP_ELASTIC_URL+process.env.REACT_APP_ELASTIC_ECONOMICS_INDEX+"/_search"
	var query = {
	  "query": {
		"match": {
		  "Level1.keyword": level1key
		}
	  },
	  "aggs": {
		"level2_feilds": {
		  "terms": {
			"field": "Level2.keyword"
		  }
		}
	  },
	  "size": 0
	}
	
	axios.post(url, query)
		.then( d => {
			if(d.status === 200 ){
				var level2 = d.data.aggregations.level2_feilds.buckets
				var list = level2.map(s => {return {"label" : s.key ,"value" : s.key}})
		setData (list)
		setfirst(list[0].label)
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
    
  }, [level1key]);

  return (
    <div style={{fontFamily:"Arial"}}>
		<Link to={`/${level1key}/${first}`} style={{textDecoration:"none",fontSize:30}}>{level1key}<br></br></Link>
      
      
        {list.map(item => (
		 <Link to={`${browserURL}/${item.value}`}>{item.value}<br>
		 </br></Link>
        ))}
      
    </div>
  );
}
export default Leftdivision