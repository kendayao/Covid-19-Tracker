import React, {useEffect, useState} from 'react';
import './LineGraph.css';
import {Line} from 'react-chartjs-2';
import numeral, { localeData } from "numeral"

// chart config
const options={
    legend: {
        display: false,
    },
    elements:{
        points:{
            radius:0,
        },
    },
    maintainAspectRatio: false,
    tooltips:{
        mode: "index",
        intersect: false,
        callbacks:{
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    parser:"MM/DD/YY",
                    tooltipFormat:"ll",
                }
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display: false,
                },
                ticks:{
                    callback: function(value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}

const buildChartData=(data, casesType="cases")=>{
    const chartData=[];
    let lastDataPoint;
    for(let date in data.cases){
        if(lastDataPoint){
            const newDataPoint={
                x: date,
                y: data[casesType][date]-lastDataPoint
            }
            chartData.push(newDataPoint) 
        }
        lastDataPoint=data[casesType][date];    
    }
    return chartData;
}

function LineGraph({casesType="cases", ...props}){
    const[data, setData]=useState({})
    // on component load, get data for last thirty days
    useEffect(()=>{
        const fetchData=async()=>{
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
            .then(response=>response.json())
            .then(data=>{
                const chartData=buildChartData(data, casesType);
                setData(chartData)
            })
        }
       fetchData();
    },[casesType])

    return(
        <div className={props.className}>
            {data?.length>0&&(
                <Line 
                options={options}
                data={{
                    datasets:[{
                        data: data,
                        backgroundColor: casesType==="cases"? "#fb4443":(casesType==="recovered"?"#7dd71d":"#CC1034"),
                        borderColor: casesType==="cases"? "#d02020":(casesType==="recovered"?"#6ebf1d":"#9a0d27")
                    }]
                }}
            />
            )}
        </div>
    )
}

export default LineGraph;