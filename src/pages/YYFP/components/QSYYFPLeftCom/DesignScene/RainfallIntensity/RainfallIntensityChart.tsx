import ReactECharts from 'echarts-for-react';
import GlobalStore from '@/store';

interface RainfallIntensityChartProps {
  data?: {
    time: string;
    value: number;
  }[];
}

function RainfallIntensityChart(props: RainfallIntensityChartProps) {
  const { data = [] } = props;

  return (
    <ReactECharts
      style={{ width: '100%', height: '220rem' }}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          textStyle: { fontSize: 13 * GlobalStore.fontSize }
        },
        xAxis: {
          type: 'category',
          position: 'top',
          axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
              color: '#ffffff'
            }
          },
          boundaryGap: false,
          axisLabel: {
            show: true,
            interval: (index: number, value: any) => value % 2 === 0,
            color: '#fff',
            fontFamily: 'DIN-BlackItalic',
            fontWeight: 400,
            fontSize: 14 * GlobalStore.fontSize,
            formatter: val => val + 'h'
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff40',
              width: 1
            }
          }
        },
        grid: {
          containLabel: true,
          top: '6',
          left: '20',
          right: '10',
          bottom: '30'
        },
        yAxis: {
          type: 'value',
          inverse: true,
          show: true,
          name: '降雨强度(mm)',
          nameLocation: 'middle',
          nameRotate: '90',
          nameGap: 32,
          nameTextStyle: {
            color: '#fff'
          },
          axisLabel: {
            color: '#fff',
            fontFamily: 'DIN-BlackItalic',
            margin: 14
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: data.map(item => [item.time, item.value]),
            type: 'bar',
            barWidth: '10rem',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(5,240,255,0.00)' // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(5,240,255,0.60)' // 50% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#05F0FF' // 100% 处的颜色
                  }
                ]
              }
            },
            tooltip: {}
          }
        ]
      }}
    />
  );
}

export default RainfallIntensityChart;
