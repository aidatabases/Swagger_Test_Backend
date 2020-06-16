import React, { useEffect, useState } from "react";
import "./tt.css";
import axios from "axios";
var url ='http://159.65.150.184:9200/top_trade/_search';

function Tables() {
  const [importsdata, setimportsData] = useState([]);
  const [exportsdata, setexportsData] = useState([]);
  const [trade_baldata, settrade_balData] = useState([]);

  useEffect(() => {
    var query={
      "query": {
        "match_all": {}
      },
      "aggs": {
        "exports": {
          "composite": {
            "size":5,
            "sources": [
              {
                "value" :{
                  "terms": {
                    "field": "Export.keyword",
                    "order": "desc"
                  }
                }
              },
              {
                "Country": {
                  "terms": {
                    "field": "Country.keyword"
                  }
                }
              }
            ]
          }
        },
        "imports": {
          "composite": {
            "size":5,
            "sources": [
              {
                "value" :{
                  "terms": {
                    "field": "Import.keyword",
                    "order": "desc"
                  }
                }
              },
              {
                "Country": {
                  "terms": {
                    "field": "Country.keyword"
                  }
                }
              }
            ]
          }
        },
        "trade_bal": {
          "composite": {
            "size":5,
            "sources": [
              {
                "value" :{
                  "terms": {
                    "field": "Trade Balance.keyword",
                    "order": "desc"
                  }
                }
              },
              {
                "Country": {
                  "terms": {
                    "field": "Country.keyword"
                  }
                }
              }
            ]
          }
        }
      },
      "size": 0
    }
    axios.post(url,query)
  .then( d => {
    if(d.status === 200 ){

      let imports=d.data.aggregations.imports.buckets
      imports.forEach(function(v){ delete v.doc_count });
      let importsdata=imports.map(s=>{return{"country":s.key.Country,"value":s.key.value}})
      console.log(importsdata)
      setimportsData(importsdata)

      let exports=d.data.aggregations.exports.buckets
      exports.forEach(function(v){ delete v.doc_count });
      let exportsdata=exports.map(s=>{return{"country":s.key.Country,"value":s.key.value}})
     
      setexportsData(exportsdata)

      let trade_bal=d.data.aggregations.trade_bal.buckets
      trade_bal.forEach(function(v){ delete v.doc_count });
      let trade_baldata=trade_bal.map(s=>{return{"country":s.key.Country,"value":s.key.value}})
      
      settrade_balData(trade_baldata)
      
    }
    else{
      console.log("err")
    }
  })
  .catch( error => {
    if (error.response.status === 404) {
      console.log(error.response.data);}
    else{}
});

},[])

  return (
    <div className="tt-main">
      
      <div className="tt-sub1">
      <h2  className="tt-headers" >Top Importing Partners</h2>
        <table id="tt-tab">
        <tr>
          <th>Countries</th>
          <th>Value</th>
        </tr>
        {importsdata.map(item => (
          <tr>
            <td key={item.country}>
              {item.country}
            </td>
            <td key={item.value}>
              {item.value}
            </td>
          </tr>))}


      </table>
      </div>

      <div className="tt-sub2">
    <h2 className="tt-headers">Top Exporting Partners</h2>
        <table id="tt-tab">
        <tr>
          <th>Countries</th>
          <th>Value</th>
        </tr>
        {exportsdata.map(item => (
          <tr>
            <td key={item.country}>
              {item.country}
            </td>
            <td key={item.value}>
              {item.value}
            </td>
          </tr>))}


      </table>
      </div>
    
      <div className="tt-sub3">
    <h2 className="tt-headers">Trade Balance</h2>
        <table id="tt-tab">
        <tr>
          <th>Countries</th>
          <th>Value</th>
        </tr>
        {trade_baldata.map(item => (
          <tr>
            <td key={item.country}>
              {item.country}
            </td>
            <td key={item.value}>
              {item.value}
            </td>
          </tr>))}


      </table>
      </div>
    </div>
    );
}
export default Tables