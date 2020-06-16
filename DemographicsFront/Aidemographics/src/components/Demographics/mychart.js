import React, { useState, useEffect } from "react"
import {Line} from "react-chartjs-2"
import { Responsive } from "semantic-ui-react"

function Chart(){

const [chartData,setcharData] = useState({})

const chart= ()=>{
    setcharData({
        labels : ["mon","tue","wed","thu","fri","sat","sun"],
        datasets : [
            {
                label : "Level of madness",
                data : [20,40,10,15,33,60,10],
                borderColor : "blue",
                borderWidth : 4
            }
        ]
    })

   
}

useEffect(()=>{
    chart();
},[])

    return(
        <div>
            <h1>Heloooo</h1>
            <div style={{width : "450px",height:"300px"}}>
                <Line data={chartData} options={
                    {responsive : true,
                     title : {text:"mu first chart",display:true}
                    }
                }/>
            </div>
        </div>
    )

}

export default Chart