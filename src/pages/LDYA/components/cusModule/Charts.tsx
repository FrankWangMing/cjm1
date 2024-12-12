import ReactECharts from 'echarts-for-react';
import React from 'react';

interface ProcessChartsProp {
  percentVal: number;
}
const ProcessCharts: React.FC<ProcessChartsProp> = ({ percentVal }) => {
  const option = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
      {
        name: 'Pressure',
        type: 'gauge',
        detail: {
          formatter: '{value}%'
        },
        data: [
          {
            value: percentVal,
            name: 'SCORE'
          }
        ]
      }
    ]
  };
  return (
    <ReactECharts
      style={{
        width: '100%',
        height: '100%'
      }}
      option={option}
    />
  );
};
export { ProcessCharts };
