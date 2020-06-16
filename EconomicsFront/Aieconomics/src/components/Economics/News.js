import React, {useState, useEffect} from 'react';
import {getNews,getGoogleNews,getGNews} from './newsApi'
import DatatablePage from './Table';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
function News(props){
  const [list,setNews] = useState([]);
  const newsvariable=props.newsvariable

  useEffect(() => {
      const fetchNewsOrgAPI = async (q) => {
          let news_data = await getNews(q);
          setNews(news_data)
      }

      const fetchGoogleAPI = async (q) => {
          let news_data = await getGoogleNews(q);
          setNews(news_data)
      }

      const fetchGNewsAPI = async (q) => {
          let news_data = await getGNews(q);
          setNews(news_data)
      }

      fetchGNewsAPI(newsvariable)
      // fetchNewsOrgAPI(newsvariable);
      // fetchGoogleAPI(newsvariable)
      // fetchGNewsAPI()
      // getNews()
      
    },[newsvariable])
    var columns= [
      {
        label: 'Title',
        field: 'Title',
        sort: 'asc',
        width: 100
      },
      {
          label: 'Source',
          field: 'Source',
          sort: 'asc',
          width: 50
        }
    ]
    let rows=[]
    for(let i in list)
    {
      rows.push({"Title":<><a href={list[i].Url} target="_blank" style={{color:"teal"}}>{list[i].Title}</a></>,"Source":list[i].Source})
    }
    var data={columns,rows}

  
  return (
  <div>
      
      <div>
          <h1>news</h1>
          <DatatablePage data={data} xscrolling={true} yscrolling={true} />
      </div>
      
      
  </div>
  )
}

export default News;