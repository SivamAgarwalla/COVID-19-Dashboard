import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

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
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          parser: 'MM/DD/YY',
          tooltipFormat: 'll',
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

function Linegraph({ caseType = 'cases' }) {
  const [data, setData] = React.useState({});

  const buildChartData = (data, casesType = 'cases') => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, caseType);
          setData(chartData);
        });
    };

    fetchData();
  }, [caseType]);

  return (
    <div className='linegraph'>
      {data?.length > 0 && (
        <div className='linegraph__chart' style={{ marginTop: 20 }}>
          <Line
            options={options}
            data={{
              datasets: [
                {
                  backgroundColor: 'rgba(204, 16, 52, 0.5)',
                  borderColor: '#CC1034',
                  data: data,
                },
              ],
            }}
          ></Line>
        </div>
      )}
    </div>
  );
}

export default Linegraph;
