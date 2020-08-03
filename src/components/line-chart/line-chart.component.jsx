import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";



// Format line chart
const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            }
        ]
    }
};



// Helper functions
const buildChartData = (data, casesType='cases') => {
    let chartData = [];
    let previousDataPoint;

    for (let date in data.cases)
    {
        if (previousDataPoint)
        {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - previousDataPoint
            };
            chartData.push(newDataPoint);
        }
        previousDataPoint = data[casesType][date];
    }
    return chartData;
}



function LineChart({ casesType= 'cases' }) {
    // State - property + set method
    const [data, setData] = useState({});


    // Use effect for countryInfo - runs when the component first mounts
    useEffect(() => {
        const getData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then((response) => response.json())
                .then((data) => {
                    const chartData = buildChartData(data, casesType);
                    setData(chartData);
                });
        }

        getData();
    }, [casesType]);


    // Rendering
    return (
      <div>
          {data?.length > 0 && (
          <Line data={{datasets: [{backgroundColor: "rgba(204, 16, 52, 0.5)",
                                   borderColor: "#CC1034",
                                   data: data}]}}
                options={options}/>)}
      </div>
    );
}



export default LineChart;