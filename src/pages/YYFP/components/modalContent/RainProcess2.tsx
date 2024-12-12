import ReactECharts from 'echarts-for-react';
import GlobalStore from '@/store';
import styled from 'styled-components';
import moment from 'moment';
interface IProps {
  data: { rainfall: number }[] | { time: string; rainValue: number }[];
}
export default ({ data }: IProps) => {
  const option = {
    xAxis: {
      type: 'time',
      position: 'top',
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          color: '#ffffff'
        }
      },
      axisLabel: {
        fontFamily: 'AlibabaPuHuiTiR',
        fontSize: '16rem',
        color: '#FFFFFF',
        align: 'center',
        formatter: val => {
          let tempTime = moment(parseInt(val));
          return tempTime.format('MM/DD') + '\n' + tempTime.format('HH:mm');
        },
        showMinLabel: true,
        showMaxLabel: true
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff40',
          width: 1
        }
      },
      axisPointer: {
        label: {
          show: false
        }
      }
    },
    grid: {
      top: '40',
      left: '60',
      right: '30',
      bottom: '30'
    },
    yAxis: {
      name: '降雨量(mm)',
      nameGap: 30,
      nameLocation: 'center',
      nameTextStyle: {
        color: '#fff',
        fontFamily: 'AlibabaPuHuiTiR',
        fontSize: 16 * GlobalStore.fontSize
      },
      axisPointer: {
        show: false
      },
      type: 'value',
      inverse: true,
      show: true,
      axisLabel: {
        fontFamily: 'AlibabaPuHuiTiR',
        fontSize: '16rem',
        color: '#FFFFFF',
        align: 'center'
      },
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: '#ffffff40',
          width: 0
        }
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
      textStyle: {
        fontSize: 16 * GlobalStore.fontSize,
        fontFamily: 'AlibabaPuHuiTiM'
      }
    },
    series: [
      {
        data: data?.map(item => [item.time, item.rainValue]) || [],
        type: 'bar',
        label: {
          show: false,
          position: 'bottom',
          color: '#fff',
          fontFamily: 'AlibabaPuHuiTiR'
        },
        barMaxWidth: '30rem',
        tooltip: {
          valueFormatter: val => {
            return val.toFixed(2) + 'mm';
          }
        },
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
                color: '#8EFFFB' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#0051CE' // 100% 处的颜色
              }
            ],
            image: 'linear-gradient(180deg, # 0%, # 100%)'
          }
        }
      }
    ]
  };

  return (
    <RainProcessWrapper>
      <h1>{`历时 ${data?.length} 小时，总降雨量： ${
        Math.round(
          data?.map(item => item?.rainValue || 0).reduce((x, y) => x + y) *
            10000
        ) / 10000
      } mm`}</h1>
      <ReactECharts
        className="chart-outer"
        style={{ height: '80%', width: '100%' }}
        option={option}
      />
    </RainProcessWrapper>
  );
};

const RainProcessWrapper = styled.div`
  h1 {
    padding: 10rem 20rem;
    color: #fff;
    font-size: 20rem;
  }
  height: 450rem;
`;
