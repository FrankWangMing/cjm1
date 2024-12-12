import { useSafeState } from 'ahooks';
import { Fragment, useEffect } from 'react';
import MaxRisk from './MaxRisk';
import ReactECharts from 'echarts-for-react';
import { IVillageInfoYYFP } from '@/service';
import moment from 'moment';
import { VillageMarkerModal } from '@/components/MarkerModal';
import GlobalStore from '@/store';

const MENU_OPTIONS: Array<{ label: string; value: string }> = [
  { label: '最高风险对比', value: 'max_risk' },
  { label: '最大淹没水深', value: 'max_depth' },
  { label: '最大流速对比', value: 'max_flow' }
];

interface IVillageModalContent {
  data: IVillageInfoYYFP;
  mapOfWaterLineId: any;
  rehearsalTime: number;
  villageId: number;
}
const VillageModalContent = ({
  data: { villageDetails, villageInfo },
  mapOfWaterLineId,
  rehearsalTime,
  villageId
}: IVillageModalContent) => {
  const [tabList, setTabList] = useSafeState<
    {
      title: string;
      width: string;
      key: string;
      JsxContent: JSX.Element;
    }[]
  >([]);
  useEffect(() => {
    if (villageDetails?.length > 0) {
      let waterLine: string[] = [];
      let riskLevel: number[] = [];
      let charts_data_depth = {};
      let charts_data_flow = {};
      villageDetails.map(item => {
        let tempWaterLine = mapOfWaterLineId[item.projectId];
        waterLine.push(tempWaterLine);
        riskLevel.push(item.maxRiskLevel);
        let tempMaxDeep = item.hydrologyData.filter(item => item.type == 0); // 当前水位线的水深数据;
        let tempMaxFlow = item.hydrologyData.filter(item => item.type == 1); // 当前水位线的速度数据;
        charts_data_depth[tempWaterLine] = tempMaxDeep;
        charts_data_flow[tempWaterLine] = tempMaxFlow;
      });
      setTabList([
        {
          title:
            Object.keys(mapOfWaterLineId).length > 1
              ? MENU_OPTIONS[0].label
              : '最高风险',
          width: '160rem',
          key: MENU_OPTIONS[0].value,
          JsxContent: <MaxRisk waterLine={waterLine} riskLevel={riskLevel} />
        },
        {
          title: MENU_OPTIONS[1].label,
          width: '160rem',
          key: MENU_OPTIONS[1].value,
          JsxContent: (
            <MaxDepthFlowCom
              data={charts_data_depth}
              waterLine={waterLine}
              xName="历时（分钟/min）"
              yTooltip={{
                valueFormatter: e => {
                  return Number(e).toFixed(1) + 'cm';
                  // return val.toFixed(1) + 'cm';
                }
              }}
              yName="水位(cm)"
            />
          )
        },
        {
          title:
            Object.keys(mapOfWaterLineId).length > 1
              ? MENU_OPTIONS[2].label
              : '最大流速',
          width: '160rem',
          key: MENU_OPTIONS[2].value,
          JsxContent: (
            <MaxDepthFlowCom
              data={charts_data_flow}
              waterLine={waterLine}
              xName="历时（分钟/min）"
              yTooltip={{
                valueFormatter: val => {
                  return Number(val).toFixed(3) + 'm/s';
                }
              }}
              yName="最大流速(m/s)"
            />
          )
        }
      ]);
    } else {
      return;
    }
  }, [villageDetails]);

  return (
    <VillageMarkerModal
      villageInfo={villageInfo}
      tabList={tabList}
      villageId={villageId}
    />
  );
};

const MaxDepthFlowCom = ({ data, waterLine, xName, yName, yTooltip }) => {
  const colorOfLine = ['#fbfc6e', '#3ad0db', '#b4a0ff'];
  return (
    <Fragment>
      <ReactECharts
        style={{
          width: '100%',
          height: '100%',
          minHeight: '200rem'
        }}
        option={{
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            textStyle: {
              fontFamily: 'AlibabaPuHuiTiM',
              fontSize: 16 * GlobalStore.fontSize
            },
            title: val => {
              return moment(val).format('HH:mm');
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
            data: waterLine,
            width: '100%',
            top: '10',
            itemHeight: 3,
            show: true,
            textStyle: {
              color: '#fff'
            },
            formatter: function (name) {
              return name + 'm 高水位';
            }
          },
          grid: {
            right: '20',
            bottom: '85'
          },
          xAxis: [
            {
              type: 'time',
              name: xName,
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
                  return tempTime.format('HH:mm');
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
              axisPointer: {
                label: {
                  show: false
                }
              },
              boundaryGap: false
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
              axisLabel: {
                formatter: '{value}',
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 15 * GlobalStore.fontSize
              },
              axisPointer: {
                show: false
              },
              splitLine: { lineStyle: { type: [5, 10], color: '#979797' } }
            }
          ],
          color: colorOfLine,
          series: [
            {
              name: waterLine[0],
              smooth: true,
              type: 'line',
              lineStyle: {
                color: colorOfLine[0]
              },
              symbol: 'none',
              barGap: 0,
              data:
                data[waterLine[0]]
                  ?.map(item => [item.time, item.value])
                  .sort((a, b) => {
                    return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
                  }) || [],
              tooltip: yTooltip
            },
            {
              name: waterLine[1],
              smooth: true,
              type: 'line',
              lineStyle: {
                color: colorOfLine[1]
              },
              symbol: 'none',
              data:
                data[waterLine[1]]
                  ?.map(item => [item.time, item.value])
                  .sort((a, b) => {
                    return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
                  }) || [],
              tooltip: yTooltip
            }
          ]
        }}
      />
    </Fragment>
  );
};

export { VillageModalContent };
