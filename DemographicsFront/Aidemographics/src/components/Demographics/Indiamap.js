import React, { useState, useEffect } from "react"
import { geoEqualEarth, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import {select,scaleLinear}  from "d3"
import * as d3 from 'd3'
import { useHistory, useRouteMatch } from "react-router"
//import {d3tip} from "d3-tip"

const projection = d3.geoMercator()
  .scale(1000)
  .translate([ -1000,700])

const Indiamap = (props) => {

  const variable = props.variable;
  const data = props.data;
  console.log(props.variable,"helloooooo")
  const history = useHistory();
  const { path, browserURL } = useRouteMatch();
  const [geographies, setGeographies] = useState([])
    
  useEffect(() => {
    fetch("/india.json")
      .then(response => {
        if (response.status !== 200) {
          //console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
          let x = feature(worlddata, worlddata.objects.india).features
          setGeographies(x)
        })
        
      })
    }, [props.data,props.variable])

    useEffect(() => {
      var data=props.data
      var cmin=10000000,cmax=0;

      for(let i in data){
        if(data[i]!=undefined)
        if(data[i]["Total"]!=undefined)
        {
        //console.log(data[i]["Total"][variable])
        var value = parseInt(data[i]["Total"][variable]);
        //console.log("states",value,typeof(value));

        if(i!="India"){
          if(value < cmin)
         {cmin=value;
        }
        
         if(value>cmax){
           cmax=value
         }
        }
        }
    }
    //console.log("mymax",cmin,cmax);
      var colorScale= scaleLinear()
    .domain([cmin, cmax])
    .range(["#ccf5ff", "#00004d"]);

  

    var svg = select(".mapsvg");
    
   var states = svg.selectAll(".countries")
                .data(geographies)
                .enter()

        var mState = states.append("path").attr("d",(d,i)=>{return geoPath().projection(projection)(d)})
                .attr("fill",(d,i)=>{ var country = d.properties.st_nm
                   var val ;
                  var ref = data[country];
                  //console.log("filling",country,data[country])
                  if(typeof(ref)==="undefined")
                   return colorScale(0)
                  val = parseInt(data[country]["Total"][variable])
                  //console.log("finalval",val);
                  return colorScale(val)
                  } )
                .attr("stroke"," #000000")
                // .append("rect").attr("width",50).attr("x",30).attr("y",40).attr("height",60).attr("fill","red")
                var tooltip =svg.append("g").attr("class","ttip")
                var bg =tooltip.append("rect")

                var txt=tooltip.append("text").attr("x",50).attr("y",70).attr("class","mytooltip");

                  mState.attr("class",(d,i)=>{ return "mystate"+i})

                mState.on("mouseover",(d,i,e)=>{ 
                  //svg.call(tip)
                  var mstate = d.properties.st_nm
                  select(".mapsvg").selectAll(".mystate"+i).attr("fill","#00c3ff")
        
                  return tooltip.style("visibility", "visible");
                })
                .on("mouseout",(d,i,e)=>{                   
                  select(".mapsvg").selectAll(".mystate"+i).attr("fill",(d)=>{
                    var country = d.properties.st_nm
                   var val ;
                  var ref = data[country];
                  //console.log("filling",country,data[country])
                  if(typeof(ref)==="undefined")
                   return colorScale(0)
                  val = parseInt(data[country]["Total"][variable])
                  return colorScale(val)
                  })
                  return tooltip.style("visibility", "hidden");
                })
                .on("mousemove", function(d){    
                  var country = d.properties.st_nm
                  var val ;
                 var ref = data[country];
                 //console.log("filling",country,data[country])
                 if(typeof(ref)==="undefined")
                  val="no data"
                 else{
                  val = parseInt(data[country]["Total"][variable])
                 }
                  // txt.text(country + ":" + val)
                  svg.selectAll(".mytooltip").text(country + ":" + val)
                  bg.attr("x",()=>{ return window.event.pageX-835}).attr("y",(d)=>{return window.event.pageY-200})
                  .attr("width",180).attr("height",30).attr("fill","silver")                  
                  txt.attr("x",()=>{ return window.event.pageX-825}).attr("y",(d)=>{return window.event.pageY-180})               
                })
                .on("click",(d)=>{
                  //console.log("clickedd",d.properties.st_nm);
                  window.location.pathname=d.properties.st_nm;
                })
                  

    },[geographies])

  return (
    <div style={{width:"60vw",height:"600"}}>
      <svg className="mapsvg" width='60vw' height='600'>
      <g className="countries"> </g>
    </svg>
  </div>
    
  )
}

export default Indiamap