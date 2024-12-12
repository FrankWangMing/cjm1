/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { SectionColorMap, SectionLegendKeyList } from '@/utils/const';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import GlobalStore from '@/store';

interface SectionChartProp {
  legendData: string[];
  yAxis: {}[];
  colorOfLine: string[];
  seriesData: {}[];
  xName: string;
  boundaryGap?: boolean;
}
const SectionChart = ({
  legendData,
  yAxis,
  colorOfLine,
  seriesData,
  xName,
  boundaryGap = false
}: SectionChartProp) => {
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
          height: '45%'
        }}
        option={{
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            textStyle: {
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize
            }
          },
          legend: {
            show: false
          },
          grid: {
            top: 50,
            bottom: 20
          },
          xAxis: [
            {
              type: 'time',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontSize: '16rem'
              },
              nameGap: 40,
              boundaryGap: false,
              position: 'top',
              // inverse: true,
              axisLabel: {
                color: '#fff',
                formatter: val => {
                  let asd = moment(val);
                  return xName === ''
                    ? asd.format('MM/DD') + '\n' + asd.format('HH:mm')
                    : asd.format('HH:mm');
                },
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                showMinLabel: true,
                showMaxLabel: true
              },
              axisPointer: {
                label: {
                  show: false
                }
              }
            }
          ],
          yAxis: yAxis[1],
          color: colorOfLine[1],
          series: seriesData[1]
        }}
      />
      <ReactECharts
        style={{
          width: '100%',
          height: '50%'
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
            bottom: 80
          },
          xAxis: [
            {
              type: 'time',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontSize: '16rem'
              },
              nameGap: 40,
              axisLabel: {
                color: '#fff',
                formatter: val => {
                  let asd = moment(val);
                  return xName === ''
                    ? asd.format('HH:mm') + '\n' + asd.format('MM/DD')
                    : asd.format('HH:mm');
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
                }
              },
              axisPointer: {
                label: {
                  show: false
                }
              },
              boundaryGap: false
            }
          ],
          yAxis: [yAxis[0], yAxis[2]],
          color: colorOfLine[0].concat(colorOfLine[2]),
          series: [
            seriesData[0],
            seriesData[2],
            seriesData[3],
            seriesData[4],
            seriesData[5]
          ]
        }}
      />
    </div>
  );
};

export { SectionChart };
