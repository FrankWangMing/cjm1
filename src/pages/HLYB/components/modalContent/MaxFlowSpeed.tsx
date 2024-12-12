import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import GlobalStore from '@/store';
interface MaxFlowSpeedProp {
  legendData: string[];
  xName: string;
  unit?: string | null;
  yName: string;
  colorOfLine: string[];
  data: { time: string; type: number; value: number }[];
  fixedNum: number;
}
const MaxFlowSpeed = ({
  legendData,
  xName,
  unit = null,
  yName,
  colorOfLine,
  data,
  fixedNum = 2
}: MaxFlowSpeedProp) => {
  return (
    <ReactECharts
      style={{
        width: '100%',
        height: '100%'
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
        legend: {
          data: legendData,
          width: '100%',
          top: '10',
          itemHeight: 3,
          show: true,
          textStyle: {
            color: '#fff',
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 16 * GlobalStore.fontSize
          }
        },
        grid: {
          bottom: xName == '' ? '75' : '85',
          right: 20
        },
        xAxis: [
          {
            type: 'time',
            name: xName,
            nameGap: 30,
            nameLocation: 'center',
            nameTextStyle: {
              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize
            },
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
        yAxis: [
          {
            type: 'value',
            name: yName,
            nameLocation: 'center',
            nameTextStyle: {
              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 18 * GlobalStore.fontSize
            },
            nameGap: 40,
            min: 0,
            max:
              Number(
                (
                  ((data?.sort((a, b) => {
                    return a.value - b.value;
                  })[data.length - 1].value *
                    2) /
                    10) *
                    10 || 0
                ).toFixed(0)
              ) || 0,
            axisLabel: {
              formatter: '{value}',
              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize,
              showMinLabel: true,
              showMaxLabel: true
            },
            splitLine: { lineStyle: { type: [5, 10], color: '#979797' } },
            axisPointer: {
              show: false
            }
          }
        ],
        color: colorOfLine,
        series: [
          {
            name: legendData[0],
            type: 'line',
            smooth: true,
            lineStyle: {
              color: colorOfLine[0]
            },
            symbol: 'none',
            barGap: 0,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(0,162,255,0.3) ' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,149,255,0.05)' // 100% 处的颜色
                  }
                ]
              }
            },
            data: data
              ?.filter(item => item.type == 0)
              .map(item => [item.time, item.value])
              .sort((a, b) => {
                return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
              }),
            tooltip: {
              valueFormatter: val => {
                return val.toFixed(fixedNum) + (unit || '');
              }
            }
          }
          // {
          //   name: legendData[1],
          //   type: 'line',
          //   smooth: true,
          //   lineStyle: {
          //     color: colorOfLine[1]
          //   },
          //   symbol: 'none',
          //   barGap: 0,
          //   data:
          //     data
          //       ?.filter(item => item.type == 2)
          //       .map(item => [item.time, item.value])
          //       .sort((a, b) => {
          //         return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
          //       }) || [],
          //   tooltip: {
          //     valueFormatter: val => {
          //       return val.toFixed(fixedNum) + (unit || '');
          //     }
          //   }
          // }
        ]
      }}
    />
  );
};

export { MaxFlowSpeed };
