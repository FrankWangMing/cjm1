import { SectionChart } from '@/components/MarkerModal/SectionChart';
import { ISection } from '@/domain/section';
import { SectionColorMap } from '@/utils/const';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';
import GlobalStore from '@/store';

interface HLYBSectionModalContentProps {
  data: ISection;
  forecastTime: number;
  prepareTransfer: number; // 准备转移水位
  immediateTransfer: number; // 立即转移水位
  forecastFlows: { flow: number; time: string }[]; // 预测流量
  dikeAltitude: number; // 堤防高程
}

const HLYBSectionModalContent = ({
  data,
  prepareTransfer,
  immediateTransfer,
  forecastFlows,
  dikeAltitude,
  forecastTime
}: HLYBSectionModalContentProps) => {
  console.log('datadata', JSON.parse(JSON.stringify(data)));
  const [rainValue, setRainValue] = useSafeState<
    {
      time: string;
      value: number;
    }[]
  >([]);
  useEffect(() => {
    if (data?.data.length == 0) {
      return;
    } else {
      let tempRainValue: {
        time: string;
        value: number;
      }[] = [];
      let tempRainAxis: string[] = [];
      data.data.map((item, index) => {
        if (!tempRainAxis.includes(item.time.split(':')[0] + ':00:00')) {
          tempRainValue.push({ time: item.time, value: item.rainfall });
          tempRainAxis.push(item.time.split(':')[0] + ':00:00');
        }
      });
      console.log('tempRainValue', tempRainValue);
      setRainValue(tempRainValue);
    }
  }, [data]);

  return (
    <SectionChart
      xName=""
      legendData={['流量（m³/s）', '降雨量（mm）']}
      yAxis={[
        // 流量
        {
          type: 'value',
          // name: '流量（m³/s）',
          // nameLocation: 'center',
          // nameTextStyle: {
          //   color: '#fff',
          //   fontSize: 16 * GlobalStore.fontSize,
          //   fontFamily: 'AlibabaPuHuiTiR'
          // },
          // nameGap: 40,
          minInterval: 0.1,
          min: null, // 设置为null以自适应Y轴的最小值
          max: null, // 设置为null以自适应Y轴的最大值
          axisLabel: {
            color: '#fff',
            interval: 'auto', // 自动调整Y轴的刻度间隔
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 14 * GlobalStore.fontSize,
            showMinLabel: true,
            showMaxLabel: true
          },
          scale: true,
          splitLine: { lineStyle: { type: [5, 10], color: '#979797' } },
          axisPointer: {
            show: false
          }
        },
        // 降雨量（mm）
        {
          type: 'value',
          name: '降雨量（mm）',
          nameLocation: 'center',
          nameTextStyle: {
            color: '#fff',
            fontSize: 16 * GlobalStore.fontSize,
            fontFamily: 'AlibabaPuHuiTiR'
          },
          nameGap: 40,
          minInterval: 0.5,
          min: null, // 设置为null以自适应Y轴的最小值
          max: null, // 设置为null以自适应Y轴的最大值
          axisLabel: {
            color: '#fff',
            interval: 'auto', // 自动调整Y轴的刻度间隔
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 16 * GlobalStore.fontSize,
            showMinLabel: true,
            showMaxLabel: true
          },
          scale: true,
          inverse: true,
          splitLine: { lineStyle: { type: [5, 10], color: '#979797' } },
          axisPointer: {
            show: false
          }
        },
        // 水位（m）
        {
          type: 'value',
          name: '水位（m）',
          nameLocation: 'center',
          nameTextStyle: {
            color: '#fff',
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 16 * GlobalStore.fontSize
          },
          nameGap: 40,
          minInterval: 0.5,
          min: null, // 设置为null以自适应Y轴的最小值
          max: null, // 设置为null以自适应Y轴的最大值
          axisLabel: {
            color: '#fff',
            interval: 'auto', // 自动调整Y轴的刻度间隔
            fontFamily: 'AlibabaPuHuiTiR',
            fontSize: 14 * GlobalStore.fontSize,
            showMinLabel: true,
            showMaxLabel: true
          },
          scale: true,
          axisPointer: {
            show: false
          },
          splitLine: { lineStyle: { type: [5, 10], color: '#979797' } }
        }
      ]}
      colorOfLine={['#FFFC6D', '#04D0DB']}
      seriesData={[
        // 预测流量
        {
          name: '预测流量',
          type: 'line',
          smooth: true,
          barGap: 0,
          showSymbol: false,
          tooltip: {
            valueFormatter: val => {
              return val.toFixed(2) + 'm³/s';
            }
          },
          yAxisIndex: 0,
          color: SectionColorMap.预测流量,
          // data: flowValue
          data: data.data?.map(item => [item.time, item.flow])
        },
        // 降雨量
        {
          name: '降雨量',
          type: forecastTime > 24 ? 'bar' : 'line',
          step: 'start',
          areaStyle: {
            color: 'rgba(72,135,194,0.40)'
          },
          showSymbol: false,
          tooltip: {
            valueFormatter: val => {
              return val.toFixed(1) + 'mm';
            }
          },
          color: SectionColorMap.降雨量,
          data:
            rainValue
              .map(item => [item.time, item.value])
              .sort((a, b) => {
                return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
              }) || []
        },
        //  河堤高程
        {
          name: '河堤高程',
          type: 'line',
          smooth: true,
          barGap: 0,
          showSymbol: false,
          tooltip: {
            valueFormatter: val => {
              return val.toFixed(2) + 'm';
            }
          },
          yAxisIndex: 1,
          color: SectionColorMap['河堤高程'],
          // data: dikeAltitudeVal
          data: data.data.map(item => [item.time, dikeAltitude])
        },
        // 立即转移水位
        {
          name: '立即转移水位',
          type: 'line',
          smooth: true,
          barGap: 0,
          showSymbol: false,
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: val => {
              return val.toFixed(2) + 'm';
            }
          },
          color: SectionColorMap['立即转移水位'],
          data: data.data.map(item => [item.time, immediateTransfer])
        },
        // 准备转移水位
        {
          name: '准备转移水位',
          type: 'line',
          smooth: true,
          barGap: 0,
          showSymbol: false,
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: val => {
              return val.toFixed(2) + 'm';
            }
          },
          color: SectionColorMap['准备转移水位'],
          data: data.data.map(item => [item.time, prepareTransfer])
        },
        // 预测水位
        {
          name: '预测水位',
          type: 'line',
          smooth: true,
          barGap: 0,
          showSymbol: false,
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: val => {
              return val.toFixed(2) + 'm';
            }
          },
          color: SectionColorMap['预测水位'],
          data: data.forecastFlows?.map(item => [item.time, item.flow])
        }
      ]}
      boundaryGap={forecastTime > 24}
    />
  );
};
export { HLYBSectionModalContent };
