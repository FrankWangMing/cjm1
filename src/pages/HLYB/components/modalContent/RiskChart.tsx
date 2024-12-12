import { RISK_MAP } from '@/utils/const';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import GlobalStore from '@/store';

interface RiskChartProp {
  data: { time: string; riskLevel: number }[];
  xName: string;
}
const mapRiskValue = {
  0: [
    {
      offset: 0,
      color: '#E6FF94' // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#70B602' // 100% 处的颜色
    }
  ],
  1: [
    {
      offset: 0,
      color: '#FF9CB4' // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#D9001B' // 100% 处的颜色
    }
  ],
  2: [
    {
      offset: 0,
      color: '#FFE398' // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#F59A23' // 100% 处的颜色
    }
  ],
  3: [
    {
      offset: 0,
      color: '#FFFFD2' // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#FFFF00' // 100% 处的颜色
    }
  ]
};
const RiskChart = ({ data = [], xName }: RiskChartProp) => {
  let wishArr = [0, 3, 2, 1];
  return (
    <Wrapper>
      <div className="cus-legend-outer">
        {Array.from(new Set(data?.map(item => item.riskLevel)))
          .sort((a, b) => {
            return wishArr.indexOf(a) - wishArr.indexOf(b);
          })
          .map((item, index) => {
            return (
              <div className="cus-legend" key={index}>
                <div
                  className="icon"
                  style={{
                    backgroundColor: RISK_MAP.COLOR_LEVEL[item].bgColor
                  }}></div>
                {RISK_MAP.COLOR_LEVEL[item].name}风险
              </div>
            );
          })}
      </div>
      <ReactECharts
        style={{
          width: '100%',
          height: '100%',
          minHeight: '250rem'
        }}
        option={{
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            textStyle: {
              fontFamily: 'AlibabaPuHuiTiM',
              fontSize: 16 * GlobalStore.fontSize
            }
          },
          toolbox: {
            feature: {
              dataView: { show: false, readOnly: false },
              magicType: { show: false, type: ['line', 'bar'] },
              restore: { show: false },
              saveAsImage: { show: false }
            }
          },

          grid: {
            containLabel: true,
            top: '13%',
            left: '0',
            right: '20',
            bottom: '30'
          },
          xAxis: [
            {
              name: xName,
              type: 'time',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              nameGap: 30,
              axisLabel: {
                color: '#fff',
                formatter: val => {
                  let tempTime = moment(parseInt(val));
                  return xName === ''
                    ? tempTime.format('HH:mm') + '\n' + tempTime.format('MM/DD')
                    : tempTime.format('HH:mm');
                },
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                showMinLabel: true,
                showMaxLabel: true
              },
              axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                  color: '#ffffff'
                },
                barGap: 0
              },
              boundaryGap: false,
              axisPointer: {
                label: {
                  show: false
                }
              }
            }
          ],
          yAxis: {
            type: 'value',
            nameLocation: 'center',
            nameTextStyle: {
              color: '#fff',
              fontSize: '20rem'
            },
            show: false,
            min: 0,
            max: 100,
            axisPointer: {
              show: false
            }
          },
          series: [
            {
              data: data?.map(item => [item.time, 80, item.riskLevel]),
              showSymbol: false,
              barGap: 0 /*多个并排柱子设置柱子之间的间距*/,
              barCategoryGap: 0,
              type: 'bar',
              itemStyle: {
                borderWidth: -1,
                borderColor: '#ffffff00',
                color: e => {
                  const risk = e.value[2];
                  return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: mapRiskValue[risk]
                  };
                }
              },
              legendHoverLink: false,
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: data => {
                  return `${data.value[0]}<br/>${data.marker}  ${
                    RISK_MAP.RISKLEVEL_DESC_MAP[data.value[2]]
                  }`;
                }
              }
            }
          ]
        }}
      />
    </Wrapper>
  );
};

import styled from 'styled-components';

const Wrapper = styled.div`
  font-family: AlibabaPuHuiTiR;
  .cus-legend-outer {
    width: inherit;
    height: 25rem;
    margin-top: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rem;
  }
  .cus-legend {
    display: flex;
    align-items: center;
    font-family: inherit;
    font-size: 18rem;
    color: #ffffff;
    margin-right: 20rem;
    .icon {
      width: 12rem;
      height: 12rem;
      margin-right: 10rem;
    }
  }
  .cus-legend:nth-last-child(1) {
    margin-right: 0;
  }
  .unit-desc {
    height: 25rem;
    display: flex;
    justify-content: center;
    font-family: inherit;
    font-size: 18rem;
    color: #ffffff;
    margin-top: 10rem;
  }
`;
export { RiskChart };
