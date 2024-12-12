import ReactECharts from 'echarts-for-react';
import GlobalStore from '@/store';
import styled from 'styled-components';
interface IProps {
  data: { rainfall: number }[];
}
export default ({ data }: IProps) => {
  const option = {
    xAxis: {
      type: 'category',
      data: data.map((item, index) => index + 1),
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
        showMinLabel: true,
        showMaxLabel: true
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff40',
          width: 1
        }
      }
    },
    grid: {
      top: '20',
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
      show: false,
      formatter: val => {
        return `第${val.dataIndex + 1}小时${val.marker}:${val.value}`;
      }
    },
    series: [
      {
        data: data?.map(item => item?.rainfall || 0) || [],
        type: 'bar',
        label: {
          show: true,
          position: 'bottom',
          formatter: e => {
            return `${e.value}`;
          },
          color: '#fff',
          // fontSize: '14rem',
          fontFamily: 'AlibabaPuHuiTiR'
        },
        barMaxWidth: '30rem',
        // barWidth: '16rem',
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
      <h1>{`历时 ${data?.length} 小时，总降雨量： ${data
        ?.map(item => item?.rainfall || 0)
        .reduce((x, y) => x + y)} mm`}</h1>
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
