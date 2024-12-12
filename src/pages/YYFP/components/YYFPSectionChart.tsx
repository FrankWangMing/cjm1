/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { ISection } from '@/domain/section';
import { SectionColorMap, SectionLegendKeyList } from '@/utils/const';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import GlobalStore from '@/store';

interface YYFPSectionChartProp {
  data2: ISection;
  data1: ISection;
  waterLine: string[];
  rainValue: { time: string; value: number }[];
}
const YYFPSectionChart = ({
  data2,
  data1,
  waterLine,
  rainValue
}: YYFPSectionChartProp) => {
  return (
    <div style={{ height: '540rem' }}>
      {SectionLegendKeyList.map(item => {
        return (
          <div
            className="flex-center"
            style={{
              display: 'flex',
              marginTop: '10rem'
            }}>
            {item.map(subItem => {
              return (
                <div
                  className="flex-center"
                  style={{
                    width: '250rem',
                    paddingLeft: '20rem',
                    justifyContent: 'flex-start'
                  }}>
                  <div
                    style={{
                      width: '20rem',
                      height: '4rem',
                      background: `${SectionColorMap[subItem.key]}`,
                      marginRight: '10rem'
                    }}></div>
                  <p
                    style={{
                      marginRight: '40rem',
                      fontFamily: 'AlibabaPuHuiTiR',
                      fontSize: '16rem',
                      color: '#FFFFFF'
                    }}>
                    {subItem.key + subItem.unit}
                  </p>
                </div>
              );
            })}
          </div>
        );
      })}
      <ReactECharts
        style={{
          width: '100%',
          height: '40%'
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
          legend: {
            show: false
          },
          grid: {
            right: 100,
            bottom: 20
          },
          xAxis: [
            {
              type: 'time',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              boundaryGap: false,
              position: 'top',
              // inverse: true,
              nameGap: 40,
              axisLabel: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                formatter: val => {
                  let tempTime = moment(parseInt(val));
                  return tempTime.format('HH:mm');
                },
                showMinLabel: true,
                showMaxLabel: true
              },
              scale: true,
              axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                  color: '#ffffff'
                },
                barGap: 0
              },
              axisPointer: {
                label: {
                  show: false
                }
              }
            }
          ],
          yAxis: {
            type: 'value',
            name: '降雨量（mm）',
            nameLocation: 'center',
            nameTextStyle: {
              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize
            },
            nameGap: 40,
            min: null, // 设置为null以自适应Y轴的最小值
            max: null, // 设置为null以自适应Y轴的最大值
            axisLabel: {
              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize,
              interval: 'auto',
              showMinLabel: true,
              showMaxLabel: true // 自动调整Y轴的刻度间隔
            },
            axisPointer: {
              label: {
                show: false
              }
            },
            scale: true,
            minInterval: 0.5,
            inverse: true,
            splitLine: { lineStyle: { type: [5, 10], color: '#979797' } }
          },
          color: '#04D0DB',
          series: {
            name: '降雨量',
            type: 'line',
            step: 'start',
            areaStyle: {
              color: 'rgba(72,135,194,0.40)'
            },
            barGap: 0,
            showSymbol: false,
            tooltip: {
              valueFormatter: val => {
                return val.toFixed(1) + 'mm';
              }
            },
            data:
              rainValue
                .map(item => [item.time, item.value])
                .sort((a, b) => {
                  return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
                }) || [],
            barCategoryGap: 0
          }
        }}
      />
      <ReactECharts
        style={{
          width: '100%',
          height: '45%'
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
          legend: {
            show: false
          },
          grid: {
            top: 10,
            right: 100,
            bottom: 60
          },
          xAxis: [
            {
              type: 'time',
              name: '历时（分/min）',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              nameGap: 35,
              axisLabel: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                formatter: val => {
                  let tempTime = moment(parseInt(val));
                  return tempTime.format('HH:mm');
                },
                showMinLabel: true,
                showMaxLabel: true
              },
              scale: true,
              axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                  color: '#ffffff'
                },
                barGap: 0
              },
              boundaryGap: false
            }
          ],
          yAxis: [
            // 流量
            {
              type: 'value',
              name: '流量（m³/s）',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              nameGap: 40,
              min: null, // 设置为null以自适应Y轴的最小值
              max: null, // 设置为null以自适应Y轴的最大值
              axisLabel: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                interval: 'auto',
                showMinLabel: true,
                showMaxLabel: true // 自动调整Y轴的刻度间隔
              },
              scale: true,
              minInterval: 0.5,
              splitLine: { lineStyle: { type: [5, 10], color: '#979797' } }
            },
            // 水位
            {
              type: 'value',
              name: '水位（m）',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              nameGap: 60,
              min: null, // 设置为null以自适应Y轴的最小值
              max: null, // 设置为null以自适应Y轴的最大值
              axisLabel: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                interval: 'auto',
                showMinLabel: true,
                showMaxLabel: true // 自动调整Y轴的刻度间隔
              },
              scale: true,
              minInterval: 0.5,
              splitLine: { lineStyle: { type: [5, 10], color: '#979797' } }
            }
          ],
          series: [
            // 预测流量1
            {
              name:
                waterLine.length > 1
                  ? waterLine[0] + 'm水位线-预测流量'
                  : '预测流量',
              smooth: true,
              type: 'line',
              yAxisIndex: 0,
              barGap: 0,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val.toFixed(2) + 'm³/s';
                }
              },
              color: SectionColorMap.预测流量,
              data: data1.data.map(item => [item.time, item.flow]),
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2,
                    type: 'dashed'
                  }
                }
              }
            },
            // 预测流量2
            waterLine[1] && {
              name:
                waterLine.length > 1
                  ? waterLine[1] + 'm水位线-预测流量'
                  : '预测流量',
              smooth: true,
              type: 'line',
              barGap: 0,
              yAxisIndex: 0,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val.toFixed(2) + 'm³/s';
                }
              },
              color: SectionColorMap.预测流量2,
              data: data2.data.map(item => [item.time, item.flow])
            },
            //  河堤高程
            {
              name: '河堤高程',
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
              barGap: 0,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val.toFixed(2) + 'm';
                }
              },
              color: SectionColorMap['河堤高程'],
              data: data1.data.map(item => [item.time, data1.dikeAltitude])
            },
            // 立即转移水位
            {
              name: '立即转移水位',
              type: 'line',
              smooth: true,
              barGap: 0,
              yAxisIndex: 1,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val.toFixed(2) + 'm';
                }
              },
              color: SectionColorMap['立即转移水位'],
              data: data1.data.map(item => [item.time, data1.immediateTransfer])
            },
            // 准备转移水位
            {
              name: '准备转移水位',
              type: 'line',
              smooth: true,
              barGap: 0,
              yAxisIndex: 1,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val.toFixed(2) + 'm';
                }
              },
              color: SectionColorMap['准备转移水位'],
              data: data1.data.map(item => [item.time, data1.prepareTransfer])
            },
            // 预测水位1
            {
              name:
                waterLine.length > 1
                  ? waterLine[0] + 'm水位线-预测水位'
                  : '预测水位',
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
              barGap: 0,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val.toFixed(2) + 'm';
                }
              },
              color: SectionColorMap['预测水位'],
              data: data1.forecastFlows?.map(item => [item.time, item.flow])
            },
            // 预测水位2
            waterLine[1] && {
              name: waterLine[1] + 'm水位线-预测水位',
              type: 'line',
              smooth: true,
              barGap: 0,
              yAxisIndex: 1,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val.toFixed(2) + 'm';
                }
              },
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2,
                    type: 'dashed'
                  }
                }
              },
              color: SectionColorMap['预测水位2'],
              data: data2.forecastFlows?.map(item => [item.time, item.flow])
            }
          ]
        }}
      />
    </div>
  );
};

export { YYFPSectionChart };
