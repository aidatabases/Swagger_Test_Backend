import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams, useHistory} from "react-router-dom"
import DatatablePage from './Table'
import { MDBBtn, MDBTableBody, MDBTableHead, MDBTable } from 'mdbreact'
import svg from "../../views/examples/graph-rising-svgrepo-com.svg"
function Rightdivision(props){
  const [depth,setdepth]=useState('')
  const history=useHistory()
  const params = useParams()
  let level1key=params.level1key
  let level2key=params.level2key
  let level3key=params.level3key
  let level4key=params.level4key
  const url=process.env.REACT_APP_ELASTIC_URL+process.env.REACT_APP_ELASTIC_ECONOMICS_INDEX+"/_search"


  
  function Qur(lev1,lev2){
    let query = {
      "query": {
        "bool": {
          "must": [
            {"match": {"Level1.keyword":lev1}}
          ],
          "filter": [
            {"term": {"Level2.keyword": lev2}}
          ]
          
        }
      },
           "aggs": {
        "level2_feilds": {
          "terms": {
            "field": "Level2.keyword"
          }
        },
        "level3_feilds": {
          "terms": {
            "field": "Level3.keyword"
          }
        },
        "level4_feilds": {
          "terms": {
            "field": "Level4.keyword"
          }
        },
        "depth":{
          "terms": {
            "field": "Level_depth"
          }
        }
      },
      "size":10000
    }
    return query;
  }


  const [temp, setData] = useState([])
  const [list, setlist]=useState([])
  

  useEffect(() => {
    var query = Qur(level1key,level2key)
    axios.post(url, query)
		.then( d => {
			if(d.status === 200 ){
        let data = d.data.hits.hits
        let v1,v2
        const depth=d.data.aggregations.depth.buckets[0].key
        setdepth(depth)
				var temp = {}
				for(var x in data){
          let dataobject = data[x]._source
          v1="Level"+(depth-2)
          v2="Level"+(depth-1)
          let key = dataobject[v1]
					if( dataobject[v2] !== null){
					let l = [dataobject[v2],dataobject.data]
					
					temp[key] = temp[key] || [];
					
          temp[key].push(l)
          }
        }
        
        let info = d.data.aggregations["level"+(depth-2)+"_feilds"].buckets
        let list = info.map(s => {return {"label" : s.key ,"value" : s.key}})
				setlist(list)
        setData(temp)
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
  }, [level1key,level2key])

  const Tablecreate = (k) => {
    var columns= [
      {
        label: 'Year',
        field: 'Year',
        sort: 'asc',
        width: 150
      }
    ]
    var cc=[]
    
    for(let i in temp[k])
    {
      let xy=(temp[k][i][0]);
      let str=""
      if(depth==4)
        str=level1key
      else if(depth==5)  
        str=level1key+"/"+level2key  
      else if(depth==6)
        str=level1key+"/"+level2key+"/"+level3key
      else if(depth==7)
        str=level1key+"/"+level2key+"/"+level3key+"/"+level4key
     cc.push({"label":<><div style={{textAlign:"center", top:0}}>{xy}</div><div style={{width:"112%"}} ><hr style={{backgroundColor:"white"}}/></div><div style={{textAlign:"center",alignItems:"center"}} ><button style={{backgroundColor:"black" , border:"white"}} onClick={()=>{history.push("/"+str+"/"+k+"/"+xy)}} ><svg fill="#FFF" version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" width="35px" height="35px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" ><g><path d="M62,60H4v-8h4c1.104,0,2-0.896,2-2s-0.896-2-2-2H4v-6c1.104,0,2-0.896,2-2s-0.896-2-2-2v-6h4c1.104,0,2-0.896,2-2s-0.896-2-2-2H4v-6c1.104,0,2-0.896,2-2s-0.896-2-2-2v-6h4c1.104,0,2-0.896,2-2S9.104,8,8,8H4V2c0-1.104-0.896-2-2-2S0,0.896,0,2v58c0,2.206,1.794,4,4,4h58c1.104,0,2-0.896,2-2S63.104,60,62,60z"/><path d="M56,34c1.104,0,2-0.896,2-2V22c0-0.131-0.014-0.263-0.039-0.392c-0.013-0.06-0.035-0.115-0.052-0.173c-0.02-0.067-0.035-0.135-0.062-0.2c-0.029-0.068-0.068-0.131-0.104-0.195c-0.027-0.05-0.049-0.102-0.08-0.148c-0.147-0.22-0.336-0.408-0.556-0.556c-0.047-0.031-0.099-0.053-0.148-0.08c-0.064-0.035-0.127-0.074-0.195-0.104c-0.065-0.026-0.133-0.042-0.2-0.062c-0.058-0.017-0.113-0.039-0.173-0.052C56.263,20.014,56.131,20,56,20H46c-1.104,0-2,0.896-2,2s0.896,2,2,2h5.172L32,43.172l-4.586-4.586c-0.781-0.781-2.047-0.781-2.828,0l-10,10c-0.781,0.781-0.781,2.047,0,2.828C14.977,51.805,15.488,52,16,52s1.023-0.195,1.414-0.586L26,42.828l4.586,4.586c0.781,0.781,2.047,0.781,2.828,0L54,26.828V32C54,33.104,54.896,34,56,34z"/></g></svg></button></div></>,"field":xy,"sort":'asc',"width":200})
    }
    columns=columns.concat(cc)
    let x;
    for(let i in temp[k])
    {
      x=(temp[k][i][1])
      break;
    }
    let rows=[]
    for(let i in x)
    {
      let sup={"Year":parseInt(i)}
      let abc;
      let p=[]
      let q=[]
      for(let j in temp[k])
    {
      let z=temp[k][j]
      
      p.push(z[0])
      q.push(z[1][i])
      
    }
    for (let j = 0; j < p.length; j++) {
      sup[p[j]] = q[j];
    }
    rows.push(sup)
    } 
    var tabledata = {columns,rows};
    
    return(
    <DatatablePage data={tabledata} xscrolling={true} yscrolling={true} />
    )
  }
  return (
    <div style={{fontFamily:"Arial" ,marginLeft:"-1vw",marginRight:"2.5vw"}}>
      <div style={{paddingLeft:"2vw"}} > 
        <h2>{level2key}</h2></div>
      <ul style={{listStyleType:"none"}}>
        {list.map(item => (
        <li key={item.value}>
          <h3>{item.value}</h3>
          <div style={{paddingBottom:"6vh"}}>
          {Tablecreate(item.value)}
          </div>
        </li>
        ))}
      </ul>
    </div>
        
      
  )
}

export default Rightdivision
