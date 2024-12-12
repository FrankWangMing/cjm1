/**
 * Author: jamie
 * Date: 2024-10-12
 * Description: 天气组件
 * componentsName:Weather
 * rangeToUse:
 */
import { LoadingOutlined } from '@ant-design/icons';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useSafeState } from 'ahooks';
import { WeatherServer } from '@/service/index';
import { PanelHeader } from '@/components/Header';
import { Wrapper } from './style';
import ReactECharts from 'echarts-for-react';
import { formatData_list_WEEK, ICON_MAP } from './const';
import GlobalStore from '@/store';
import moment, { Moment } from 'moment';
import {
  IMG_PATH,
  MomentFormatStr,
  ShowModeProjectId,
  ShowModeUITime
} from '@/utils/const';
import { observer, useLocalStore } from 'mobx-react-lite';
import { weekMap } from '@/utils';
import Loading from '../Loading';
import { Tooltip } from 'antd';
import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';
import { image } from 'html2canvas/dist/types/css/types/image';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
import EchartSlider from '../EchartSlider/index';

/**
 * 周和日计算对应的天气数据
 */
const DEFAULT_DURATION_MAP = {
  day: 72,
  week: 144
};

const Weather: React.FC<{
  type: 'week' | 'day';
  forecastTime: number;
  backTrackTime: Moment | null;
}> = observer(({ type, forecastTime, backTrackTime }) => {
  const [loading, setLoading] = useSafeState(false);

  const store = useLocalStore(
    (): {
      currDate: Moment;
      currWeather: string;
      currProbability: string;
      chartData: any;
      duration: number;
    } => ({
      currDate: moment(),
      currWeather: '阴',
      currProbability: '',
      chartData: [],
      duration: 0
    })
  );
  /**
   * 获取天气数据
   */
  const getWeather = async () => {
    setLoading(true);
    try {
      let startTime = '',
        endTime = '',
        projectId = 0;
      if (GlobalStore.isShowMode) {
        startTime = moment(ShowModeUITime).format(MomentFormatStr);
        endTime = moment(ShowModeUITime).add('h', 72).format(MomentFormatStr);
        projectId = ShowModeProjectId;
      } else {
        let tempTime = moment();
        startTime = tempTime.format(MomentFormatStr);
        endTime = tempTime
          .add('h', DEFAULT_DURATION_MAP[type])
          .format(MomentFormatStr);
      }
      let data = await WeatherServer.list(startTime, endTime, projectId);
      if (type == 'week') {
        // 如果是周预报；
        let tempRes = formatData_list_WEEK(data.forecast);
        store.chartData = tempRes;
      } else {
        // 如果是日预报;
        store.currDate = moment(data.condition.time);
        store.currProbability = data.condition.rainProbability;
        store.currWeather = data.condition.condition;
        store.chartData = data.forecast;
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  /**
   * 获取历史天气数据
   */
  const getHistoryForecastWeather = async backTrackTime => {
    let time = backTrackTime?.format('YYYY-MM-DD HH:mm:ss');
    let startTime = time;
    let { list: forecastRain, condition } =
      await WeatherServer.historyForecastByTime(startTime);
    store.currDate = moment(condition.time);
    store.currProbability = condition.rainProbability;
    store.currWeather = condition.condition;
    let historyRain = [];
    store.chartData = historyRain.concat(
      forecastRain.slice(0, 24).map(item => {
        return { time: item.time, rainValue: Number(item.rainValue) || 0 };
      })
    );
  };

  /**
   * 界面初始化
   */
  React.useEffect(() => {
    if (backTrackTime && backTrackTime.isValid() && type != 'week') {
      getHistoryForecastWeather(backTrackTime);
    } else {
      getWeather();
    }
  }, [type, backTrackTime]);
  return (
    <Wrapper>
      <div className="common-header-outer">
        <PanelHeader title={'气象降雨预报'} />
      </div>
      <div className="weather-content bg-content-area-alpha">
        {loading && <Loading loadingFlag={loading} />}
        {!loading &&
          (type == 'week' ? (
            <>
              <WeatherContent data={store.chartData} loading={loading} />
            </>
          ) : (
            <Fragment>
              <div className="header-desc-outer ">
                <div className="header-desc_left ">
                  <p>{store.currDate.format('YYYY年MM月DD日')}</p>
                  <p>{weekMap[store.currDate.day()]}</p>
                </div>
                <div className="header-desc_center flex-center">
                  <img
                    src={
                      ICON_MAP[
                        store.currWeather.indexOf('雨') != -1
                          ? '小到中雨'
                          : store.currWeather
                      ]
                    }
                    alt=""
                  />
                </div>
                <div className="header-desc_right ">
                  <p>{store.currWeather}</p>
                  <p>降水概率：{store.currProbability}%</p>
                </div>
              </div>
              <div className="divider-custom" />
              <div className="content-outer">
                <div className="title">
                  {moment(store.chartData[0]?.time).format('MM/DD HH:mm') +
                    '-' +
                    moment(
                      store.chartData[store.chartData.length - 1]?.time
                    ).format('MM/DD HH:mm')}
                  逐时降雨量（mm）
                </div>
                <div className="chart-outer">
                  <WeatherChart data={store.chartData} type={type} />
                </div>
                {/* <img src={IMG_PATH.echartHandle} className="echartHandle"></img> */}
              </div>
            </Fragment>
          ))}
      </div>
    </Wrapper>
  );
});

interface WeatherChartProp {
  data: { time: string; rainValue: string | number }[];
  type: 'day' | 'week';
}
interface dataType {
  time: string;
  rainValue: string | number;
}
const WeatherChart: React.FC<WeatherChartProp> = ({
  data = [],
  type = 'day'
}) => {
  const [maxVal, setMaxVal] = useState(-1);
  const [visibleData, setVisibleData] = useSafeState<dataType[]>([]);
  const weatherRef = useRef(null);
  const [onReady, setOnReady] = useState(false);
  useEffect(() => {
    let tempMaxVal = 0;
    data.map(item => {
      let temp = Number(item.rainValue);
      if (tempMaxVal < temp) tempMaxVal = Number((temp + 0.05).toFixed(2));
    });
    setMaxVal(tempMaxVal);
  }, [data]);
  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontSize: 13 * GlobalStore.fontSize }
    },
    xAxis: {
      type: 'category',
      position: 'top',
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: '#ffffff'
        },
        interval: function (index) {
          // 只展示第4个及其后的刻度，并且每隔2个展示一个
          return index >= 3 && (index - 3) % 4 === 0;
        }
      },
      boundaryGap: false,
      axisLabel: {
        show: true,
        interval: 0,
        formatter: function (value, index) {
          // 只展示第4个及其后的标签，并且每隔2个展示一个
          if (index >= 3 && (index - 3) % 4 === 0) {
            return moment(value).format(type == 'day' ? 'MM/DD HH' : 'DD');
          } else {
            return ''; // 不展示标签
          }
        },
        // formatter: function (value) {
        //   return moment(value).format(type == 'day' ? 'MM/DD HH' : 'DD');
        // },
        color: '#fff',
        fontFamily: 'AlibabaPuHuiTiM',
        // showMinLabel: true,
        // showMaxLabel: true,
        fontSize: 13 * GlobalStore.fontSize
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
      top: '0',
      left: '-25',
      right: '10',
      bottom: '80'
    },
    yAxis: {
      type: 'value',
      inverse: true,
      show: false,
      max: maxVal < 5 ? 5 : maxVal
    },
    series: [
      {
        data: data.map(item => [
          item.time,
          Number((Number(item.rainValue) + 0.05).toFixed(2))
        ]),
        type: 'bar',
        label: {
          show: true,
          position: 'bottom',
          formatter: e => {
            if (maxVal == 0.05) {
              return '';
            } else {
              if (e.data[1] == maxVal) {
                return (e.value[1] - 0.05).toFixed(1);
              } else {
                return '';
              }
            }
          },
          color: '#fff',
          fontFamily: 'AlibabaPuHuiTiR'
        },
        barWidth: '8rem',
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
                color: 'transparent' // 0% 处的颜色
              },
              {
                offset: 0.29,
                color: 'rgba(5,240,255,0.60)', // 0% 处的颜色
                opacity: 0.6
              },
              {
                offset: 1,
                color: '#05F0FF' // 100% 处的颜色
              }
            ],
            image: 'linear-gradient(180deg, # 0%, # 100%)'
          }
        },
        tooltip: {
          valueFormatter: val => {
            return (val - 0.05).toFixed(1);
          }
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside', // 内置缩放
        start: 0, // 初始时显示前24个数据
        end: (24 / 72) * 100, /// 计算初始显示的百分比
        zoomLock: true // 锁定缩放，只允许滑动
      }
    ]
    // dataZoom: [
    //   {
    //     type: 'slider', // 滑动条类型
    //     startValue: 0, // 初始显示的第一个数据点
    //     endValue: 23, // 初始显示的最后一个数据点
    //     // start: 0, // 默认从第0%开始显示
    //     // end: (8 / 24) * 100, // 默认显示前24个柱子，即 24/72 的比例
    //     zoomLock: true, // 锁定缩放，只允许滑动
    //     orient: 'horizontal',
    //     moveHandleStyle: {
    //       height: 20,
    //       color: '#50FDFF', // 手柄背景色
    //       borderWidth: 5, // 手柄边框宽度
    //       shadowBlur: 1 // 手柄阴影模糊半径
    //     },
    //     // maxSpan: (8 / 24) * 100,
    //     // minValueSpan: (8 / 24) * 100,
    //     handleStyle: {
    //       color: 'transparent', // 手柄颜色
    //       borderColor: 'transparent ' // 手柄边框颜色
    //     },
    //     xAxisIndex: 0,
    //     backgroundColor: 'rgba(255,255,255,0.42) ',
    //     dataBackground: {
    //       lineStyle: {
    //         color: 'transparent',
    //         width: 2, // 数据阴影线宽度,
    //         type: 'solid'
    //       },
    //       areaStyle: {
    //         color: 'rgba(27,95,117,0.66)'
    //       }
    //     },
    //     borderRadius: [10, 10, 0, 0], //（顺时针左上，右上，右下，左下）
    //     borderColor: 'rgba(0, 0, 0, 0)',
    //     height: 1,
    //     bottom: 25,
    //     width: '80%', // 设置滑动条的宽度（对于水平滑动条）
    //     left: '10%' // 使滑动条居中
    //   }
    // ]
  };
  return (
    <>
      <ReactECharts
        ref={weatherRef}
        style={{ width: '100%', height: '280rem' }}
        option={options}
        onChartReady={chart => {
          setOnReady(true);
        }}
      />
      <EchartSlider
        background={IMG_PATH.echartHandle}
        onReady={onReady}
        data={data}
        chartRef={weatherRef}
        start={0}
        visibleCount={24}></EchartSlider>
    </>
  );
};

interface IWeatherShow {
  time: string;
  rainValue: number;
  condition: string;
  rainProbability: string;
  icon?: string;
}
interface IWeatherContent {
  data: IWeatherShow[];
  loading: boolean;
}
const WeatherContent = ({ data, loading }: IWeatherContent) => {
  return (
    <div className="week-outer">
      {!loading ? (
        <Fragment>
          <div className="list-outer dateList">
            {data.map((item, index) => {
              return (
                <div key={index} className="list-item date">
                  {moment(item.time).format('MM/DD')}
                </div>
              );
            })}
          </div>
          <div className="list-outer">
            {/* {data.map((item, index) => {
              return (
                <div key={index} className="list-item timer">
                  {moment(item.time).format('HH:00')}
                </div>
              );
            })} */}
          </div>
          <div className="list-outer">
            {data.map((item, index) => {
              return (
                <div key={index} className="list-item">
                  <img src={item.icon} alt="" />
                </div>
              );
            })}
          </div>
          {/* <div className="list-outer">
            {data.map((item, index) => {
              return (
                <div className="list-item" key={index}>
                  <Tooltip title={item.condition}>{item.condition}</Tooltip>
                </div>
              );
            })}
          </div> */}
          <div className="list-outer">
            {data.map((item, index) => {
              return (
                <div key={index} className="list-item">
                  <Tooltip title={'降雨概率：' + item.rainProbability + '%'}>
                    {item.rainProbability}%
                  </Tooltip>
                </div>
              );
            })}
          </div>
          <ReactECharts
            style={{ width: '100%', height: '180rem' }}
            option={{
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
                axisLabel: {
                  show: false
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
                top: '0%',
                left: '-20',
                right: '0',
                bottom: '40'
              },
              yAxis: {
                type: 'value',
                inverse: true,
                show: false
              },
              series: [
                {
                  data: data.map(item => [item.time, item.rainValue]),
                  type: 'bar',
                  label: {
                    show: true,
                    position: 'bottom',
                    formatter: e => {
                      return `${e.value[1]}\nmm`;
                    },
                    color: '#fff',
                    fontFamily: 'AlibabaPuHuiTiR'
                  },
                  barWidth: '12rem',
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
            }}
          />
        </Fragment>
      ) : (
        <h1>
          正在加载天气数据...&nbsp;&nbsp;
          <LoadingOutlined />
        </h1>
      )}
    </div>
  );
};

interface props {
  data: { time: string; rainValue: number }[];
  duration: number;
}
const WeatherChartHistory = ({ data, duration }: props) => {
  return (
    <ReactECharts
      style={{ width: '100%', height: '140rem' }}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
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
            show: true,
            interval: 0,
            color: '#fff',
            fontFamily: 'AlibabaPuHuiTiM',
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
          containLabel: true,
          top: '0',
          left: '-20',
          right: '15',
          bottom: '20'
        },
        yAxis: {
          type: 'value',
          inverse: true,
          show: false
        },
        series: [
          {
            data: data.map(item => [item.time, item.rainValue]),
            type: 'bar',
            label: {
              show: true,
              position: 'bottom',

              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR'
            },
            barWidth: '8rem',
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
            },
            tooltip: {
              valueFormatter: val => {
                return val.toFixed(1) + 'mm';
              }
            }
          }
        ]
      }}
    />
  );
};

export { Weather };
