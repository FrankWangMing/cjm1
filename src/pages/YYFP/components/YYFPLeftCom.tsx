import { PanelHeader } from '@/components/Header';
import { useMount, useSafeState, useUnmount } from 'ahooks';
import moment, { Moment } from 'moment';
import {
  Button,
  Checkbox,
  Collapse,
  DatePicker,
  Form,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Space
} from 'antd';
import {
  ForecastServer,
  PreviewServer,
  PreviewStart1Res,
  WeatherServer
} from '@/service';
import { ISelectOptions } from '../const';
import { observer, useLocalStore } from 'mobx-react-lite';
import {
  getForecastTime,
  IMG_PATH,
  MomentFormatStr,
  PHYSICAL_KEYWORDS,
  StaticDirUrl
} from '@/utils/const';
import GlobalStore from '@/store';
import { Fragment, useEffect } from 'react';
import {
  LoadingOutlined,
  MinusSquareOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { ShowServer } from '@/service/show';
import { useUpdateEffect } from '@umijs/hooks';
import { MarkerObj } from '@/components/Map';
import { IRiskItem } from '@/domain/valley';
import { useStore } from '../store';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import QueueList from './modalContent/QueueList';
import { RangePickerProps } from 'antd/lib/date-picker';
import RainProcess2 from './modalContent/RainProcess2';
import RainProcess1 from './modalContent/RainProcess1';
import { YYFPLeftWrapper } from './YYFPLeftCom/style';

const RainDurationShowTimeMap = {
  '2': {
    rainDuration: 24,
    showTime: 48,
    value: 0
  },
  '3': {
    rainDuration: 3,
    showTime: 6,
    value: 0
  }
};

export default observer(() => {
  const YYFPStore = useStore();
  const [form] = Form.useForm();
  /* ===============  类似工具  ===================== */
  /**
   * 判断是否满足调用请求
   */
  const isCanUse2Fetch = (): boolean => {
    // 高水位判断 - 是否选择水位线了
    if (YYFPStore.currSceneType == '2') {
      if (store.selectedWaterLine.length < 1) {
        message.info('最少选中一个水位线');
        return false;
      }
    }
    // 当前选中的降雨场景
    let rainfallScene =
      store.inputRecord[YYFPStore.currSceneType].rainfallScene;
    // 实时计算判断 - 降雨量是否是0
    if (rainfallScene == 3 && store.customRainfall.sum == 0) {
      message.info('降雨量不能为0！');
      return false;
    }
    // 历史降雨 是否选中了日期;
    if (rainfallScene == 2) {
      let tempRainArr = form.getFieldValue('historyRainTime');
      if (!tempRainArr) {
        message.info('请选择历史降雨时间');
        return false;
      }
    }
    return true;
  };
  /**
   * 设计工况雨量数据获取
   */
  const getRainFallCount = () => {
    if (YYFPStore.currSceneType == '2') {
      // 高水位分析
      YYFPStore.rainFall =
        store.inputRecord[2][0].rainfallIntensity == 0 ? 238.6 : 312.4;
    } else {
      // 短时暴雨
      YYFPStore.rainFall =
        store.inputRecord[3][0].rainfallIntensity == 0 ? 105 : 136.9;
    }
  };
  /**
   * 获取所有select选项数据
   * @param sceneType 2: 高水位分析 3: 短时暴雨
   */
  const getAllOptionsBySceneType = async () => {
    let sceneType = YYFPStore.currSceneType;
    const data = await PreviewServer.previewScenes(Number(sceneType));
    store.options.RainfallScene = data.conditions[0].options;
    store.options.RainfallIntensity = data.conditions[1].options;
    store.options.RehearsalTime = data.conditions[2].options;
    if (sceneType == '2')
      store.options.waterLine = data.conditions[4].options.reverse();
    YYFPStore.calcStatus = 'INIT';
    if (store.isInit) {
      form.setFieldsValue({
        RainfallScene: data.conditions[0].options[0].value,
        RainfallIntensity: data.conditions[1].options[0].value
      });
      store.isInit = false;
    } else {
      fillTempFormData2Form(sceneType);
    }
    handleFormChange();
  };
  /**
   * 千岛湖水位查询
   * @param id
   */
  const getReservoirInfoById = async () => {
    let { realWaterLevel = 0.0, time = undefined } =
      await ShowServer.statistic.waterLine(GlobalStore.thousandOfLakeId);
    YYFPStore.waterData.waterLine = realWaterLevel;
    YYFPStore.waterData.time = time;
  };
  const startHeartBeat = () => {
    store.heartBeatIntervalId = setInterval(function () {
      if (store.ws?.readyState === WebSocket.OPEN) {
        store.ws?.send('ping');
      }
    }, 30000);
  };
  const reconnect = () => {
    if (!store.reconnectIntervalId) {
      store.reconnectIntervalId = setInterval(function () {
        if (store.ws?.readyState === WebSocket.CLOSED) {
          console.log('尝试重新连接WebSocket');
          connectWs();
        }
      }, 5000);
    }
  };
  const stopHeartBeat = () => {
    clearInterval(store.heartBeatIntervalId);
    clearInterval(store.reconnectIntervalId);
  };
  // 获取当前的工况的参数；
  const getCaseParams = (
    currSceneType,
    tempFormData,
    selectedWaterLine,
    isFillZero = false
  ): string => {
    let tempStr = '';
    let type = `${currSceneType}&${tempFormData?.rainfallScene}`;
    let tempArr = JSON.parse(JSON.stringify(selectedWaterLine)) || [];
    let cusRainFallList = tempFormData[1]?.cusRainfall || [];
    switch (type) {
      case '2&0':
        // 高水位分析&设计工况
        tempStr = `${currSceneType},${tempFormData?.rainfallScene},${tempArr
          .sort()
          .join(',')},${tempFormData[0]?.rainfallIntensity},${
          RainDurationShowTimeMap[currSceneType].rainDuration
        },${RainDurationShowTimeMap[currSceneType].showTime}`;
        break;
      case '3&0':
        // 短时暴雨&设计工况
        tempStr = `${currSceneType},${tempFormData?.rainfallScene},${tempFormData[0]?.rainfallIntensity},${RainDurationShowTimeMap[currSceneType].rainDuration},${RainDurationShowTimeMap[currSceneType].showTime}`;
        break;
      case '2&1':
        // 高水位分析&自定义降雨
        tempStr = `${currSceneType},${tempFormData?.rainfallScene},${tempArr
          .sort()
          .join(',')}`;
        let tempExpandCusRain = isFillZero
          ? cusRainFallList.map(item => {
              return { rainfall: 0 };
            })
          : [];
        cusRainFallList.concat(tempExpandCusRain).map(item => {
          tempStr += ',' + (item?.rainfall || '0');
        });
        break;
      case '3&1':
        // 短时暴雨&自定义降雨
        tempStr = `${currSceneType},${tempFormData.rainfallScene}`;
        let tempExpandCusRain2 = isFillZero
          ? cusRainFallList.map(item => {
              return { rainfall: 0 };
            })
          : [];
        cusRainFallList.concat(tempExpandCusRain2).map(item => {
          tempStr += ',' + (item?.rainfall || '0');
        });
        break;
      case '2&2':
        // 高水位分析&历史降雨
        tempStr = `${currSceneType},${tempFormData.rainfallScene},${tempArr
          .sort()
          .join(',')},${tempFormData[2].time.start},${
          tempFormData[2].time.end
        }`;
        break;
      case '3&2':
        // 短时暴雨&历史降雨
        tempStr = `${currSceneType},${tempFormData.rainfallScene},${tempFormData[2].time.start},${tempFormData[2].time.end}`;
        break;
    }
    return tempStr;
  };
  /**
   * 填充一下之前输入的数据
   */
  const fillTempFormData2Form = (type: string) => {
    let tempObj = store.inputRecord[type];
    form.setFieldsValue({
      RainfallScene: Number(tempObj.rainfallScene),
      RainfallIntensity: Number(tempObj[0].rainfallIntensity),
      cusRainfall: tempObj[1].cusRainfall
    });
    if (tempObj[2].time.start != '') {
      form.setFieldValue('historyRainTime', [
        moment(tempObj[2].time.start),
        moment(tempObj[2].time.end)
      ]);
    }
  };
  /**
   * 表单发生变化
   * 1. 查看是否选中食为先
   * @returns
   */
  const handleFormChange = async () => {
    let currSceneType = YYFPStore.currSceneType;
    // 获取所有选中的参数;
    let tempFormData = form.getFieldsValue();
    let tempList: any[] = [];
    switch (tempFormData.RainfallScene) {
      case 0:
        // 设计暴雨天气
        if (tempFormData.RainfallIntensity != undefined) {
          store.inputRecord[currSceneType][0] = {
            rainfallIntensity: tempFormData.RainfallIntensity
          };
          getRainFallCount();
        }
        break;
      case 1:
        // 自定义降雨
        if (tempFormData.cusRainfall?.length > 0) {
          tempFormData.cusRainfall.map(item => {
            tempList.push({
              rainfall: item?.rainfall || 0
            });
          });
        } else {
          tempList = [{ rainfall: 0 }];
        }
        if (
          tempList.length > 1 ||
          (tempList.length == 1 && tempList[0].rainfall != 0)
        ) {
          store.inputRecord[currSceneType][1].cusRainfall = tempList;
        }
        rainfall_custom();
      case 2:
        // 历史降雨
        if (tempFormData.historyRainTime) {
          store.inputRecord[currSceneType][2].time = {
            start: tempFormData.historyRainTime[0]?.format(
              'YYYY-MM-DD 00:00:00'
            ),
            end: tempFormData.historyRainTime[1]?.format('YYYY-MM-DD 00:00:00')
          };
          getHistoryWeather();
        }
        if (store.inputRecord[currSceneType][2].time.start == '') {
          store.inputRecord[currSceneType][2].rain = { list: [], sum: 0 };
        }
    }
    // 保存一下当前表单的数据
    judgeCurrCase();
  };
  /**
   * 降雨场景变化，恢复表单内容填充;
   */
  const handleInputBackTrace = async currRainSceneType => {
    let currSceneType = YYFPStore.currSceneType;
    store.inputRecord[currSceneType].rainfallScene = currRainSceneType;
    store.waterLineActiveKey = store.selectedWaterLine.length > 0 ? '' : '1';
    switch (currRainSceneType) {
      case 0:
        // 设计暴雨天气
        form.setFieldsValue({
          RainfallIntensity:
            store.inputRecord[currSceneType][0].rainfallIntensity
        });
        break;
      case 1:
        // 自定义降雨
        form.setFieldsValue({
          cusRainfall: store.inputRecord[currSceneType][1].cusRainfall
        });
        rainfall_custom();
        store.waterLineActiveKey = '';
        break;
      case 2:
        let historyRainTime: Moment[] | null = null;
        if (store.inputRecord[currSceneType][2].time?.start != '') {
          historyRainTime = [
            moment(store.inputRecord[currSceneType][2].time.start),
            moment(store.inputRecord[currSceneType][2].time.end)
          ];
          form.setFieldsValue({
            historyRainTime: historyRainTime
          });
        }
        // 历史降雨
        if (!historyRainTime)
          form.setFieldsValue({
            historyRainTime: historyRainTime
          });
        break;
    }
    YYFPStore.currModalData.type = undefined;
    // judgeCurrCase();
  };
  /**
   * 判断是否是当前工况
   * @returns
   */
  const judgeCurrCase = () => {
    store.popupVisible = false;
    let currRainfallScene =
      store.inputRecord[YYFPStore.currSceneType].rainfallScene;
    let currObj = store.inputRecord[YYFPStore.currSceneType];
    let currFormCaseStr = getCaseParams(
      YYFPStore.currSceneType,
      currObj,
      store.selectedWaterLine,
      true
    ); // 获取当前表格展示的参数列表；
    // 如果当前没有加载任何工况
    if (YYFPStore.currCase.currProjectParams == '') {
      // 判断当前选中的工况是实时计算还是设计工况
      if (currObj.rainfallScene == 0) {
        // 设计工况
        YYFPStore.calcStatus = 'INIT';
        store.isShowRestoreLastCalc[
          `${YYFPStore.currSceneType}&${currRainfallScene}`
        ] = false;
      } else {
        // 判断正在计算的工况是不是当前选中的工况
        let calcParams =
          store.inputRecord[YYFPStore.currSceneType][currRainfallScene]
            .calcIngParams;
        let calStatus =
          store.inputRecord[YYFPStore.currSceneType][currRainfallScene]
            .calcIsOk;
        // 自定义计算几种情况，1. 正在计算 LOADING 2. 计算结束CALC_DONE 3. 初始状态 INIT
        if (currFormCaseStr == calcParams) {
          // 当前选中工况是正在计算的工况
          YYFPStore.calcStatus =
            calcParams == '' ? 'INIT' : calStatus ? 'CALC_DONE' : 'LOADING';
          store.isShowRestoreLastCalc[
            `${YYFPStore.currSceneType}&${currRainfallScene}`
          ] = false;
          connectWs();
        } else {
          // 当前选中工况不是正在计算的工况
          YYFPStore.calcStatus = 'INIT';
          store.isShowRestoreLastCalc[
            `${YYFPStore.currSceneType}&${currRainfallScene}`
          ] = calcParams != '';
        }
      }
      return;
    } else {
      let isCurrCase = YYFPStore.currCase.currProjectParams == currFormCaseStr;
      if (isCurrCase) {
        // 1. 当前选中的是加载好的工况： 两种情况：LOADING:正在加载结果文件、RENDER_DONE:已经加载结束开始渲染/渲染好了
        YYFPStore.calcStatus =
          YYFPStore.loadedPercent == '100%' ? 'RENDER_DONE' : 'LOADING';
        store.isShowRestoreLastCalc[
          `${YYFPStore.currSceneType}&${currRainfallScene}`
        ] = false;
      } else {
        // 2. 当前选中的不是加载好的工况:
        // 2.1 设计工况：INIT;
        // 2.2 实时计算工况：LOADING | CALC_DONE | INIT;
        if (currObj.rainfallScene == 0) {
          YYFPStore.calcStatus = 'INIT';
        } else {
          // 当前选中的参数为自定义计算，
          if (currObj[currRainfallScene].calcIngParams == '') {
            YYFPStore.calcStatus = 'INIT';
            store.isShowRestoreLastCalc[
              `${YYFPStore.currSceneType}&${currRainfallScene}`
            ] = false;
          } else {
            // 当前选中的工况正在实时计算
            // 判断是否是正在实时计算的工况
            if (currObj[currRainfallScene].calcIngParams == currFormCaseStr) {
              store.isShowRestoreLastCalc[
                `${YYFPStore.currSceneType}&${currRainfallScene}`
              ] = false;
              // 这个工况正在进行实时计算
              if (currObj[currRainfallScene].calcIsOk) {
                // 实时计算已经完成，等待加载结果文件
                YYFPStore.calcStatus = 'CALC_DONE';
              } else {
                // 实时计算中，恢复一下进度条
                YYFPStore.calcStatus = 'LOADING';
                connectWs();
              }
            } else {
              // 选中的工况没有在实时计算
              YYFPStore.calcStatus = 'INIT';
              store.isShowRestoreLastCalc[
                `${YYFPStore.currSceneType}&${currRainfallScene}`
              ] = true;
            }
          }
        }
      }
    }
  };
  /**
   * 自定义降雨计算
   */
  const rainfall_custom = () => {
    let cusRainfall = form.getFieldValue('cusRainfall');
    if (!cusRainfall) return;
    store.customRainfall.time = cusRainfall?.length || 0;
    let tempSum = 0;
    cusRainfall?.map(item => {
      tempSum += item?.rainfall || 0;
    });
    store.customRainfall.sum = tempSum;
  };
  /**
   * 加载结果文件 - 组装多个simAnimation对象
   * @param waterLine 水位线
   * @param riskList 风险列表
   * @param resultList 结果文件路径
   */
  const loadResultFile = async (
    waterLine: string,
    riskList: IRiskItem[],
    resultList: string[],
    projectId: number
  ) => {
    try {
      let tempCloudSimAnimation =
        await GlobalStore.mapboxLayer!.createWaterSimAnimation({
          renderDataType: PHYSICAL_KEYWORDS.历时,
          colorTheme: PHYSICAL_KEYWORDS.历时,
          _sumFrames: 1
        });
      let tempAnimateSimAnimation =
        await GlobalStore.mapboxLayer!.createWaterSimAnimation({
          renderDataType: PHYSICAL_KEYWORDS.水深,
          colorTheme: PHYSICAL_KEYWORDS.水深,
          _sumFrames: resultList.length
        });
      tempAnimateSimAnimation?.show(false);
      tempCloudSimAnimation?.show(false);
      YYFPStore.simAnimationMap[waterLine] = {
        loading: true,
        riskList: riskList,
        simAnimation: {
          animateCloud: tempAnimateSimAnimation,
          staticCloud: tempCloudSimAnimation
        },
        projectId: projectId
      };
      let calType = 3;
      let startTime = '2023-01-01 00:00:00';
      let endTime = '';
      let type = `${YYFPStore.currSceneType}&${
        store.inputRecord[YYFPStore.currSceneType].rainfallScene
      }`;
      let tempProcessTime = {
        start: moment(),
        end: moment(),
        duration: 0
      };
      switch (type) {
        case '2&0':
          endTime = moment(startTime)
            .add('h', RainDurationShowTimeMap[2].showTime)
            .format(MomentFormatStr);
          tempProcessTime = {
            start: moment(startTime),
            end: moment(endTime),
            duration: RainDurationShowTimeMap[2].showTime
          };
          store.historyCusRainTime = undefined;
          break;
        case '2&1':
          if (!store.historyCusRainTime) {
            // 高水位&自定义雨量
            let { startTime: start, endTime: end } = getForecastTime(
              moment(),
              store.inputRecord[2][1].cusRainfall.length,
              'h'
            );
            startTime = start.format(MomentFormatStr);
            endTime = end.format(MomentFormatStr);
            tempProcessTime = {
              start: start,
              end: moment(end),
              duration: store.inputRecord[2][1].cusRainfall.length * 2
            };
          } else {
            startTime = store.historyCusRainTime.start.format(MomentFormatStr);
            endTime = store.historyCusRainTime.end.format(MomentFormatStr);
            tempProcessTime = {
              start: store.historyCusRainTime.start,
              end: store.historyCusRainTime.end,
              duration: store.inputRecord[2][1].cusRainfall.length * 2
            };
          }
          calType = 5;
          break;
        case '2&2':
          endTime = moment(store.inputRecord[2][2].time.end)
            .add(1, 'd')
            .format('YYYY-MM-DD HH:mm:00');
          startTime = moment(store.inputRecord[2][2].time.start).format(
            'YYYY-MM-DD 00:00:00'
          );
          calType = 5;
          tempProcessTime = {
            start: moment(startTime),
            end: moment(endTime),
            duration: moment
              .duration(moment(endTime).diff(moment(startTime)))
              .asHours()
          };
          store.historyCusRainTime = undefined;
          break;
        case '3&0':
          endTime = moment(startTime)
            .add('h', RainDurationShowTimeMap[3].showTime)
            .format(MomentFormatStr);
          tempProcessTime = {
            start: moment(startTime),
            end: moment(endTime),
            duration: RainDurationShowTimeMap[3].showTime
          };
          store.historyCusRainTime = undefined;
          break;
        case '3&1':
          // 高水位&自定义雨量
          if (!store.historyCusRainTime) {
            let { startTime: start1, endTime: end1 } = getForecastTime(
              moment(),
              store.inputRecord[3][1].cusRainfall.length,
              'h'
            );
            startTime = start1.format(MomentFormatStr);
            endTime = end1.format(MomentFormatStr);
            tempProcessTime = {
              start: start1,
              end: end1,
              duration: store.inputRecord[3][1].cusRainfall.length * 2
            };
          } else {
            startTime = store.historyCusRainTime.start.format(MomentFormatStr);
            endTime = store.historyCusRainTime.end.format(MomentFormatStr);
            tempProcessTime = {
              start: store.historyCusRainTime.start,
              end: store.historyCusRainTime.end,
              duration: store.inputRecord[3][1].cusRainfall.length * 2
            };
          }
          calType = 5;
          break;
        case '3&2':
          endTime = moment(store.inputRecord[3][2].time.end)
            .add(1, 'd')
            .format('YYYY-MM-DD HH:mm:00');
          startTime = moment(store.inputRecord[3][2].time.start).format(
            'YYYY-MM-DD 00:00:00'
          );
          calType = 5;
          tempProcessTime = {
            start: moment(startTime),
            end: moment(endTime),
            duration: moment
              .duration(moment(endTime).diff(moment(startTime)))
              .asHours()
          };
          store.historyCusRainTime = undefined;
          break;
      }
      console.log('tempProcessTime', tempProcessTime);
      YYFPStore.processTime = tempProcessTime;
      // animateSimAnimation结果文件加载
      await GlobalStore.mapboxLayer?.loadResult(
        resultList,
        tempAnimateSimAnimation,
        e => {
          YYFPStore.currCase.loadFileNum++;
        }
      );
      const { path: cloudPath } = await ForecastServer.cloudQuery({
        startTime,
        endTime,
        projectId,
        calType
      });
      // 最大水深、历时结果文件加载
      console.log('最大水深path', cloudPath);
      await GlobalStore.mapboxLayer?.loadResult(
        // [cloudPath.split('8311')[1]]
        [cloudPath],
        tempCloudSimAnimation,
        e => {
          YYFPStore.currCase.loadFileNum++;
        }
      );
      YYFPStore.simAnimationMap[waterLine].loading = false;
      YYFPStore.setIsRenderDone();
    } catch (e) {
      requestJsonFail();
    }
  };
  // 展示降雨过程
  const showRainProcess = () => {
    let currInputContent = form.getFieldValue('cusRainfall');
    if (store.inputRecord[YYFPStore.currSceneType].rainfallScene == 2) {
      if (store.inputRecord[YYFPStore.currSceneType][2].rain.list.length > 0) {
        YYFPStore.currModalData.type = 'rainProcess';
        currInputContent = [];
        store.inputRecord[YYFPStore.currSceneType][2].rain.list.map(item => {
          currInputContent.push({
            time: item.time,
            rainValue: item.rainValue
          });
        });
        YYFPStore.modalObj = {
          title: `雨量过程图 `,
          content: <RainProcess2 data={currInputContent} />
        };
        YYFPStore.currModalData.loading = false;
      } else {
        message.info('选择时间后可查看对应降雨量数据');
      }
    } else {
      // 自定义降雨
      YYFPStore.currModalData.type = 'rainProcess';
      YYFPStore.currModalData.loading = true;
      YYFPStore.modalObj = {
        title: `雨量过程图 `,
        content: (
          <RainProcess1
            data={currInputContent.concat(
              currInputContent.map(item => {
                return {
                  rainfall: 0
                };
              })
            )}
          />
        )
      };
      YYFPStore.currModalData.loading = false;
    }
  };
  /**
   * Target: 实现日期选择框最多选择3个月的时间;
   * disabledDate & onCalendarChange & from表单 配合使用
   * @param current
   * @returns
   */
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    let curr_shijian_temp = form.getFieldValue('historyRainTime');
    if (curr_shijian_temp) {
      let startTime = curr_shijian_temp[0];
      let endTime = curr_shijian_temp[1];
      return (
        current < moment(endTime).subtract(5, 'd') ||
        (current && current > moment().endOf('day')) ||
        (current && current > moment(startTime).add(5, 'd'))
      );
    } else {
      return (
        current &&
        (current > moment().endOf('day') || current < moment().subtract(1, 'y'))
      );
    }
  };
  const onCalendarChange = list => {
    form.setFieldValue('historyRainTime', list);
  };
  /**
   * 获取历时降雨数据
   */
  const getHistoryWeather = async () => {
    let { start, end } = store.inputRecord[YYFPStore.currSceneType][2].time;
    const data = await WeatherServer.historyByTime(
      moment(start).format('YYYY-MM-DD 00:00:00'),
      moment(moment(end).format('YYYY-MM-DD 00:00:00'))
        .add(1, 'd')
        .subtract(1, 'second')
        .format('YYYY-MM-DD HH:mm:00')
    );
    let tempSum = 0;
    data.list.map(item => (tempSum += item.rainValue));
    store.inputRecord[YYFPStore.currSceneType][2].rain = {
      list: data.list,
      sum: tempSum
    };
  };

  const getHistoryRain = async () => {
    let endTime = moment().format(MomentFormatStr);
    let startTime = moment().subtract(0.5, 'year').format(MomentFormatStr);
    const { list } = await WeatherServer.historyByTime(
      startTime,
      endTime,
      'day'
    );
    let asd = list
      .filter(item => {
        return item.rainValue != 0;
      })
      .map(item => moment(item.time).format('YYYYMMDD'));
    store.historyRainWithOutZeroList_time = asd;
  };

  useMount(() => {
    getHistoryRain();

    let storage1 = localStorage.getItem('2&2');
    let storage2 = localStorage.getItem('2&1');
    let storage3 = localStorage.getItem('3&2');
    let storage4 = localStorage.getItem('3&1');
    getReservoirInfoById();
    store.isShowRestoreLastCalc = {
      '2&2': Boolean(storage1),
      '2&1': Boolean(storage2),
      '3&2': Boolean(storage3),
      '3&1': Boolean(storage4)
    };
    if (storage1 || storage2 || storage3 || storage4) {
      if (GlobalStore.isRefresh) {
        // 强制刷新界面
        if (storage1) {
          if (storage1.includes('success')) {
            console.log('判断加载--移除高水位-历史降雨');
            localStorage.removeItem('GSWFX_Calc_Param');
          } else {
            // 高水位已经加载过了
            console.log('判断加载--恢复高水位-历史降雨');
            // 路由跳转到这里
            YYFPStore.isRestoreCalcIng = true;
            setTimeout(() => {
              handleResetLastCalc('2', '2');
            }, 2000);
            return;
          }
        }
        if (storage2) {
          if (storage2.includes('success')) {
            console.log('判断加载--移除高水位-历史降雨');
            localStorage.removeItem('2&1');
          } else {
            // 高水位已经加载过了
            console.log('判断加载--恢复高水位-历史降雨');
            // 路由跳转到这里
            YYFPStore.isRestoreCalcIng = true;
            setTimeout(() => {
              handleResetLastCalc('2', '1');
            }, 2000);
            return;
          }
        }
        if (storage3) {
          if (storage3.includes('success')) {
            console.log('判断加载--移除短时暴雨-历史降雨');
            localStorage.removeItem('3&2');
          } else {
            // 高水位已经加载过了
            console.log('判断加载--恢复短时暴雨-历史降雨');
            // 路由跳转到这里
            YYFPStore.isRestoreCalcIng = true;
            setTimeout(() => {
              handleResetLastCalc('3', '2');
            }, 2000);
            return;
          }
        }
        if (storage4) {
          if (storage4.includes('success')) {
            console.log('判断加载--移除短时暴雨-自定义降雨');
            localStorage.removeItem('3&1');
          } else {
            // 高水位已经加载过了
            console.log('判断加载--恢复短时暴雨-自定义降雨');
            // 路由跳转到这里
            YYFPStore.isRestoreCalcIng = true;
            setTimeout(() => {
              handleResetLastCalc('3', '1');
            }, 2000);
            return;
          }
        }
      }
    }
    GlobalStore.isRefresh = false;
  });
  useUpdateEffect(() => {
    clearTimeout(YYFPStore._timer);
    YYFPStore._timer = setTimeout(async () => {
      YYFPStore.handleLoadedWaterLineChange();
    }, 500);
  }, [YYFPStore.currLayerId]);

  const store = useLocalStore(
    (): {
      isInit: boolean;
      /**
       * 选择的水位线
       */
      selectedWaterLine: CheckboxValueType[];
      /**
       * 各种options选项
       */
      options: {
        waterLine: { label: string; value: number }[]; // 水位线选择
        RainfallScene: { label: string; value: number }[]; // 降雨场景
        RainfallIntensity: { label: string; value: number }[]; // 降雨强度
        RehearsalTime: { label: string; value: number }[]; // 降雨时长
      };
      /**
       * 当前场景降雨量修正
       */
      rainfall: number;
      getRainFallByParams: Function;
      /**
       * 自定义降雨显示相关参数
       */
      customRainfall: {
        sum: number;
        time: number;
      };
      // 实时计算工况Id暂存变量
      currRealTimeCalcIdList: number[];
      popupVisible: boolean;
      ws: undefined | WebSocket;
      realTimeProcess: string;
      realTimeWaterLineProjectIdMap: {};
      // 水位线的激活key
      waterLineActiveKey: string;
      heartBeatIntervalId: any;
      reconnectIntervalId: any;
      isShowRestoreLastCalc: {
        '2&1': boolean;
        '2&2': boolean;
        '3&1': boolean;
        '3&2': boolean;
      };
      inputRecord: {
        '2': {
          0: {
            rainfallIntensity: number;
          };
          2: {
            time: {
              start: string;
              end: string;
            };
            rain: {
              list: { time: string; rainValue: number }[];
              sum: number;
            };
            calcIngParams: string;
            calcIsOk: boolean;
            currRealTimeCalcIdList: number[];
          };
          1: {
            cusRainfall: { rainfall: number }[];
            calcIngParams: string;
            calcIsOk: boolean;
            currRealTimeCalcIdList: number[];
          };
          waterLine: string;
          rainfallScene: number;
        };
        '3': {
          0: {
            rainfallIntensity: number;
          };
          2: {
            time: {
              start: string;
              end: string;
            };
            rain: {
              list: { time: string; rainValue: number }[];
              sum: number;
            };
            calcIngParams: string;
            calcIsOk: boolean;
            currRealTimeCalcIdList: number[];
          };
          1: {
            cusRainfall: { rainfall: number }[];
            calcIngParams: string;
            calcIsOk: boolean;
            currRealTimeCalcIdList: number[];
          };
          rainfallScene: number;
        };
      };
      historyCusRainTime:
        | {
            start: Moment;
            end: Moment;
          }
        | undefined;
      historyRainWithOutZeroList_time: string[];
    } => ({
      historyRainWithOutZeroList_time: [],
      isInit: true,
      customRainfall: {
        sum: 0,
        time: 0
      },
      selectedWaterLine: [],
      options: {
        waterLine: [],
        RainfallIntensity: [],
        RainfallScene: [],
        RehearsalTime: []
      },
      currRealTimeCalcIdList: [],
      popupVisible: false,
      rainfall: 0,
      async getRainFallByParams() {},
      ws: undefined,
      realTimeProcess: '',
      realTimeWaterLineProjectIdMap: {},
      waterLineActiveKey: '1',
      heartBeatIntervalId: undefined,
      reconnectIntervalId: undefined,
      isShowRestoreLastCalc: {
        '2&1': false,
        '2&2': false,
        '3&1': false,
        '3&2': false
      },
      inputRecord: {
        '2': {
          0: {
            rainfallIntensity: 0
          },
          2: {
            time: {
              start: '',
              end: ''
            },
            rain: {
              list: [],
              sum: 0
            },
            calcIngParams: '',
            calcIsOk: false,
            currRealTimeCalcIdList: []
          },
          1: {
            cusRainfall: [{ rainfall: 0 }],
            calcIngParams: '',
            calcIsOk: false,
            currRealTimeCalcIdList: []
          },
          waterLine: '',
          rainfallScene: 0
        },
        '3': {
          0: {
            rainfallIntensity: 0
          },
          2: {
            time: {
              start: '',
              end: ''
            },
            rain: {
              list: [],
              sum: 0
            },
            calcIngParams: '',
            calcIsOk: false,
            currRealTimeCalcIdList: []
          },
          1: {
            cusRainfall: [{ rainfall: 0 }],
            calcIngParams: '',
            calcIsOk: false,
            currRealTimeCalcIdList: []
          },
          rainfallScene: 0
        }
      },
      historyCusRainTime: undefined
    })
  );

  useUnmount(() => {
    store.ws?.close();
  });

  const handleRealTimeCalcFail = (currSceneType, rainfallScene) => {
    store.inputRecord[currSceneType];
    message.error('实时计算失败');
    store.ws?.close();
    YYFPStore.calcStatus = 'INIT';
    store.realTimeWaterLineProjectIdMap = {};
    YYFPStore.currCase.currProjectParams = '';
    store.inputRecord[currSceneType][rainfallScene].currRealTimeCalcIdList = [];
    store.popupVisible = false;
    let type = `${currSceneType}&${store.inputRecord[currSceneType].rainfallScene}`;
    localStorage.removeItem(type);
  };

  const handleMessageIn = (
    e,
    currSceneType,
    rainfallScene,
    cusRainfall,
    historyRainTime
  ) => {
    let data = JSON.parse(e.data);
    store.realTimeProcess = data.data + '%';
    if (data.code == 10210) {
      handleRealTimeCalcFail(currSceneType, rainfallScene);
      setTimeout(() => {
        location.reload();
      }, 3000);
      return;
    } else {
      if (data.data.includes('100')) {
        // 加载结果文件;
        store.realTimeProcess = '100';
        store.ws?.close();
        GlobalStore.wsUrl = '';
        store.inputRecord[YYFPStore.currSceneType][
          store.inputRecord[YYFPStore.currSceneType].rainfallScene
        ].calcIsOk = true;
        YYFPStore.calcStatus = 'CALC_DONE';
      }
    }
  };
  // 实时计算完成处理事件
  const handleRealTimeDONE = async (currSceneType, rainfallScene) => {
    YYFPStore.calcStatus = 'LOADING';
    // 点击这个就开始加载结果文件了
    let idList =
      store.inputRecord[currSceneType][rainfallScene].currRealTimeCalcIdList;
    if (idList.length == 0) return;
    // 开始加载试试计算的工况;
    // 获取数据
    const data = await PreviewServer.queryProjectResultsByIds(idList);
    // 加载工况
    handleProjectCalcDone(
      data.previewCalResults,
      StaticDirUrl.coarse_mesh,
      StaticDirUrl.coarse_geo_ca
    );
  };

  // 连接websocket链接
  const connectWs = async () => {
    YYFPStore.calcStatus = 'LOADING';
    let currSceneType = YYFPStore.currSceneType;
    let rainfallScene = store.inputRecord[currSceneType].rainfallScene;
    store.ws?.close();
    store.ws && (store.ws = undefined);
    clearInterval(store.reconnectIntervalId);
    /**
     * 获取websocket链接
     */
    if (GlobalStore.wsUrl == '') {
      const data = await ShowServer.getStaticLink(1);
      GlobalStore.wsUrl = data.link;
    }
    // 创建websocket链接;
    !store.ws && (store.ws = new WebSocket(GlobalStore.wsUrl));
    if (store.ws) {
      store.ws.onopen = () => {
        let projectId =
          store.inputRecord[currSceneType][rainfallScene]
            .currRealTimeCalcIdList;
        console.log(
          'store.inputRecord[currSceneType]',
          store.inputRecord[currSceneType]
        );
        startHeartBeat();
        store.realTimeProcess = '%';
        store.ws?.send(
          JSON.stringify({
            async: true,
            active: 'monitorCustomJobProcess',
            projectId
          })
        );
      };
      store.ws.onmessage = function (e) {
        let cusRainfall = store.inputRecord[currSceneType][1].cusRainfall;
        let historyRainTime = store.inputRecord[currSceneType][2].time;
        handleMessageIn(
          e,
          currSceneType,
          rainfallScene,
          cusRainfall,
          historyRainTime
        );
      };
      store.ws.onerror = () => {
        console.log('WebSocket连接发生错误');
        stopHeartBeat();
        reconnect();
      };
      store.ws.onclose = () => {
        console.log('WebSocket连接已关闭');
        stopHeartBeat();
      };
    }
  };

  /**
   * 判断是否是已经加载到地图上的工况;
   * 触发条件：1. 表单发生变化；【handleFormChange里面自主调用】
   *  2. 高水位、短时暴雨切换；【监听值变化】
   */
  useEffect(() => {
    judgeCurrCase();
    YYFPStore.currModalData.type = undefined;
    getAllOptionsBySceneType();
  }, [YYFPStore.currSceneType]);

  /**
   * json文件加载失败
   */
  const requestJsonFail = () => {
    message.error('json 加载失败');
    // YYFPStore.calcStatus = 'INIT';
    YYFPStore.currCase.loadFileNum = 0;
  };
  /**
   * 准备加载结果文件
   * @param data
   * @param meshUrl
   * @param geoCaUrl
   */
  const handleProjectCalcDone = async (
    data: PreviewStart1Res[],
    meshUrl: string,
    geoCaUrl: string
  ) => {
    // 将所有结果清空;恢复至没有渲染的状态;
    handleCloudResRelativeDataDispose();
    let currSceneType = YYFPStore.currSceneType;
    YYFPStore.currCase.currSceneType = currSceneType;
    // 赋值降雨场景
    YYFPStore.currCase.rainfallScene =
      store.inputRecord[currSceneType].rainfallScene;
    // 将实时计算中的参数设置到缓存里面去
    YYFPStore.currCase.cusRainfall =
      store.inputRecord[YYFPStore.currSceneType][1].cusRainfall; // 自定义降雨输入
    YYFPStore.currCase.historyRainTime = [
      moment(store.inputRecord[YYFPStore.currSceneType][2].time.start),
      moment(store.inputRecord[YYFPStore.currSceneType][2].time.end)
    ]; // 历史降雨时间
    let currParam = getCaseParams(
      currSceneType,
      store.inputRecord[currSceneType],
      store.selectedWaterLine
    );
    YYFPStore.currCase.rainfallIntensity =
      store.inputRecord[YYFPStore.currSceneType][0].rainfallIntensity; // 降雨强度
    try {
      if (data.length == 0) throw new Error();
      if (GlobalStore.mapboxLayer == null) {
        await GlobalStore.createMapboxLayer(meshUrl, geoCaUrl);
      }
      // 锁定一下currCase的数据;
      LockCurrCaseData({
        selectedWaterLine: store.selectedWaterLine as string[],
        currProjectParams: currParam
      });
      YYFPStore.calcStatus = 'LOADING';
      YYFPStore.currCase.mapOfProjectIdWithWaterLine = {};
      YYFPStore.currCase.waterLevelWithProjectId = {};
      YYFPStore.currCase.NFrames =
        currSceneType === '2' ? store.selectedWaterLine.length : 1;
      YYFPStore.currCase.allWaterLine = [];
      YYFPStore.currCase.projectIds = [];
      let type = `${currSceneType}&${store.inputRecord[currSceneType].rainfallScene}`;
      let str = localStorage.getItem(type);
      if (str) {
        let tempLocalStorage = JSON.parse(str);
        tempLocalStorage['status'] = 'success';
        localStorage.setItem(type, JSON.stringify(tempLocalStorage));
      }
      data.map(async item => {
        if (item.project.frameList.length == 0) {
          message.error('有工况没有结果文件');
          YYFPStore.calcStatus = 'INIT';
          store.isShowRestoreLastCalc[currSceneType] = false;
          return;
        }
        let waterLine: string = item.waterLevel;
        YYFPStore.currCase.projectIds.push(item.project.projectId);
        YYFPStore.currCase.allWaterLine.push(Number(waterLine).toFixed(1));
        let animateResUrlList: string[] = [];
        // let currPath = item.project.resultPath.split('8311')[1];
        let currPath = item.project.resultPath;
        item.project.frameList.map(frameItem => {
          animateResUrlList.push(currPath + frameItem + '.json.gz');
          YYFPStore.currCase.NFrames++;
        });
        YYFPStore.currCase.waterLevelWithProjectId[waterLine] =
          item.project.projectId;
        YYFPStore.currCase.mapOfProjectIdWithWaterLine[item.project.projectId] =
          waterLine;
        if (item.riskList.length > 0) {
          await loadResultFile(
            Number(waterLine).toFixed(1),
            item.riskList,
            animateResUrlList,
            item.project.projectId
          );
        } else {
          message.error('暂无数据');
          YYFPStore.dispose();
        }
      });
    } catch (e) {
      message.error('后端返回数据为空');
      YYFPStore.calcStatus = 'INIT';
    }
  };

  const { Panel } = Collapse;

  // 展示预演列表
  const showQueueList = () => {
    YYFPStore.currModalData.type = 'queueList';
    YYFPStore.currModalData.id = -1;
    YYFPStore.modalObj = {
      title: `${YYFPStore.currSceneType == '2' ? '高水位分析-' : '短时暴雨-'}${
        store.inputRecord[YYFPStore.currSceneType].rainfallScene == 1
          ? '自定义降雨（实时计算）-'
          : '历史降雨（实时计算）-'
      }仿真预演任务列表 `,
      content: (
        <QueueList
          projectIds={YYFPStore.currCase.projectIds}
          sceneType={Number(YYFPStore.currSceneType)}
          rainfallScene={
            store.inputRecord[YYFPStore.currSceneType].rainfallScene
          }
          handleExportIn={(record, currSceneType, rainfallScene) => {
            store.ws?.close();
            store.ws && (store.ws = undefined);
            form.setFieldValue('RainfallScene', rainfallScene);
            store.inputRecord[YYFPStore.currSceneType].rainfallScene =
              rainfallScene;
            store.inputRecord[currSceneType][
              rainfallScene
            ].currRealTimeCalcIdList = [Number(record.projectId)];
            YYFPStore.currModalData.type = undefined;
            YYFPStore.currCase.allWaterLine = [record.waterLevel.toFixed(1)];
            let { startTime } = getForecastTime(
              moment(record.durationStart),
              0,
              'h'
            );
            let { startTime: endTime } = getForecastTime(
              moment(record.durationEnd),
              0,
              'h'
            );
            store.historyCusRainTime = {
              start: startTime,
              end: endTime
            };
            // 区分工况;
            let type = `${currSceneType}&${rainfallScene}`;
            let tempCurrProjectParams = '';
            let cusRainfall = [];
            switch (type) {
              case '2&1':
                // 高水位-自定义降雨
                tempCurrProjectParams = `2,1,${record.waterLevel}`;
                cusRainfall = record.customRains.map(item => {
                  tempCurrProjectParams += `,${item.rain}`;
                  return {
                    rainfall: item.rain
                  };
                });
                cusRainfall = cusRainfall.splice(
                  0,
                  record.customRains.length / 2
                );
                store.inputRecord[2][1].cusRainfall = cusRainfall;
                form.setFieldValue('cusRainfall', cusRainfall);
                store.selectedWaterLine = [record.waterLevel];
                rainfall_custom();
                break;
              case '2&2':
                // 高水位-历史降雨
                tempCurrProjectParams = `2,2,${record.waterLevel},${record.rainStartTime},${record.rainEndTime}`;
                store.selectedWaterLine = [record.waterLevel];
                store.inputRecord[2][2].time = {
                  start: record.rainStartTime,
                  end: record.rainEndTime
                };
                getHistoryWeather();
                break;
              case '3&1':
                // 短时暴雨-自定义降雨
                tempCurrProjectParams = `3,1`;
                cusRainfall = record.customRains.map(item => {
                  tempCurrProjectParams += `,${item.rain}`;
                  return {
                    rainfall: item.rain
                  };
                });
                cusRainfall = cusRainfall.splice(
                  0,
                  record.customRains.length / 2
                );
                store.inputRecord[3][1].cusRainfall = cusRainfall;
                form.setFieldValue('cusRainfall', cusRainfall);
                rainfall_custom();
                break;
              case '3&2':
                // 短时暴雨-历史降雨
                tempCurrProjectParams = `3,2,${record.rainStartTime},${record.rainEndTime}`;
                store.inputRecord[3][2].time = {
                  start: record.rainStartTime,
                  end: record.rainEndTime
                };
                getHistoryWeather();
                break;
            }
            YYFPStore.currCase.currProjectParams = tempCurrProjectParams;
            handleRealTimeDONE(currSceneType, rainfallScene);
          }}
        />
      )
    };
  };

  const handleInputChange = () => {
    showRainProcess();
  };

  /**
   * 恢复上次计算的工况
   * @param currSceneType '2':高水位分析 '3': 短时暴雨
   * @param type '1':自定义降雨 '2': 历史降雨
   */
  const handleResetLastCalc = (
    currSceneType: string,
    type: string | number
  ) => {
    // 关闭所有弹窗
    YYFPStore.currSceneType = currSceneType;
    YYFPStore.currModalData.type = undefined;
    YYFPStore.currCase.allWaterLine = [];
    // 停止加载当前正在进行中的工况
    // 判断工况进行加载
    let caseType = `${currSceneType}&${type}`;
    let lastCalcStr = localStorage.getItem(caseType);
    store.inputRecord[currSceneType].rainfallScene = type;
    switch (caseType) {
      case '2&1':
        // 高水位分析&自定义降雨
        if (lastCalcStr) {
          let lastCalcObj = JSON.parse(lastCalcStr);
          store.selectedWaterLine = lastCalcObj.selectedWaterLine;
          store.waterLineActiveKey = '';
          // 重置表单
          form.setFieldsValue({
            RainfallScene: lastCalcObj.RainfallScene,
            cusRainfall: lastCalcObj.cusRainfall
          });
          store.inputRecord[2].rainfallScene = lastCalcObj.RainfallScene;
          store.inputRecord[2][1].cusRainfall = lastCalcObj.cusRainfall;
          YYFPStore.calcStatus = 'LOADING';
          store.inputRecord[2][1].currRealTimeCalcIdList =
            lastCalcObj.currRealTimeCalcIdList;
          store.inputRecord[2][1].calcIngParams = lastCalcObj.currProjectParams;
          let sumRainfall = 0;
          lastCalcObj.cusRainfall.map(item => (sumRainfall += item.rainfall));
          YYFPStore.currCase.processTitle = `高水位-自定义降雨(${lastCalcObj.cusRainfall.length}小时，${sumRainfall}mm)`;
          YYFPStore.currCase.projectIds = lastCalcObj.currRealTimeCalcIdList;
          connectWs();
          YYFPStore.currCase.rainfallScene = lastCalcObj.RainfallScene;
          YYFPStore.isRestoreCalcIng = false;
        } else {
          message.error('高水位没有 上次计算结果');
          form.setFieldsValue({
            cusRainfall: [{ rainfall: 0 }]
          });
          store.inputRecord[2][1].cusRainfall = [{ rainfall: 0 }];
        }
        break;
      case '3&1':
        // 短时暴雨 - 自定义降雨
        if (lastCalcStr) {
          store.isInit = false;
          let lastCalcObj = JSON.parse(lastCalcStr);
          YYFPStore.currCase.rainfallScene = lastCalcObj.RainfallScene;
          // 重置表单
          form.setFieldsValue({
            RainfallScene: lastCalcObj.RainfallScene,
            cusRainfall: lastCalcObj.cusRainfall
          });
          YYFPStore.calcStatus = 'LOADING';
          store.inputRecord[3][1].currRealTimeCalcIdList =
            lastCalcObj.currRealTimeCalcIdList;
          store.inputRecord[3][1].calcIngParams = lastCalcObj.currProjectParams;
          let sumRainfall = 0;
          lastCalcObj.cusRainfall.map(item => (sumRainfall += item.rainfall));
          YYFPStore.currCase.processTitle = `短时暴雨-自定义降雨(${lastCalcObj.cusRainfall.length}小时，${sumRainfall}mm)`;
          YYFPStore.currCase.projectIds = lastCalcObj.currRealTimeCalcIdList;
          connectWs();
          YYFPStore.isRestoreCalcIng = false;
        } else {
          message.error('短时暴雨没有 上次计算结果');
          form.setFieldsValue({
            cusRainfall: [{ rainfall: 0 }]
          });
        }
        break;
      case '2&2':
        // 高水位分析&历史降雨
        if (lastCalcStr) {
          let lastCalcObj = JSON.parse(lastCalcStr);
          YYFPStore.currCase.rainfallScene = lastCalcObj.RainfallScene;
          console.log('高水位&历史降雨 实时计算:', lastCalcObj);
          store.selectedWaterLine = lastCalcObj.selectedWaterLine;
          store.waterLineActiveKey = '';
          // 重置表单
          form.setFieldsValue({
            RainfallScene: lastCalcObj.RainfallScene,
            historyRainTime: [
              moment(lastCalcObj.historyStartTime),
              moment(lastCalcObj.historyEndTime)
            ]
          });
          YYFPStore.calcStatus = 'LOADING';
          store.inputRecord[2][2].currRealTimeCalcIdList =
            lastCalcObj.currRealTimeCalcIdList;
          store.inputRecord[2][2].calcIngParams = lastCalcObj.currProjectParams;
          YYFPStore.currCase.processTitle = `高水位分析${moment(
            lastCalcObj.historyStartTime
          ).format('MM/DD')}-${moment(lastCalcObj.historyStartTime).format(
            'MM/DD'
          )}历史降雨`;
          YYFPStore.currCase.projectIds = lastCalcObj.currRealTimeCalcIdList;
          connectWs();
          YYFPStore.isRestoreCalcIng = false;
        } else {
          message.error('高水位没有 上次计算结果');
          form.setFieldsValue({
            cusRainfall: [{ rainfall: 0 }]
          });
        }
        break;
      case '3&2':
        // 短时暴雨&历史降雨
        if (lastCalcStr) {
          store.isInit = false;
          let lastCalcObj = JSON.parse(lastCalcStr);
          YYFPStore.currCase.rainfallScene = lastCalcObj.RainfallScene;
          // 重置表单
          form.setFieldsValue({
            RainfallScene: lastCalcObj.RainfallScene,
            historyRainTime: [
              moment(lastCalcObj.historyStartTime),
              moment(lastCalcObj.historyEndTime)
            ]
          });
          YYFPStore.calcStatus = 'LOADING';
          store.inputRecord[3][2].currRealTimeCalcIdList =
            lastCalcObj.currRealTimeCalcIdList;
          store.inputRecord[3][2].calcIngParams = lastCalcObj.currProjectParams;
          YYFPStore.currCase.processTitle = `短时暴雨${moment(
            lastCalcObj.historyStartTime
          ).format('MM/DD')}-${moment(lastCalcObj.historyStartTime).format(
            'MM/DD'
          )}历史降雨`;
          YYFPStore.currCase.projectIds = lastCalcObj.currRealTimeCalcIdList;
          connectWs();
          YYFPStore.isRestoreCalcIng = false;
        } else {
          message.error('短时暴雨没有 上次计算结果');
          form.setFieldsValue({
            cusRainfall: [{ rainfall: 0 }]
          });
        }
        break;
    }
    handleFormChange();
  };

  /**
   * 重置/初始化 渲染云图所需要的变量数据
   */
  const handleCloudResRelativeDataDispose = () => {
    YYFPStore.currLayers = []; // 底部图层全为不选中
    GlobalStore.mapboxLayer?.abortLoadFile(); // 取消正在加载的结果文件
    GlobalStore.mapboxLayer?.dispose();
    GlobalStore.mapboxLayer = null;
    GlobalStore.disposeMapboxLayer(); //
    MarkerObj.remove(); // 地图清除所有点位
    YYFPStore.simAnimation?.dispose();
    YYFPStore.currCase.projectIds = [];
    for (let i in YYFPStore.simAnimationMap) {
      for (let j in YYFPStore.simAnimationMap[i].simAnimation) {
        YYFPStore.simAnimationMap[i].simAnimation[j]?.dispose();
        YYFPStore.simAnimationMap[i].simAnimation[j] = null;
      }
    }
    YYFPStore.calcStatus = 'LOADING'; // 计算状态置为loading
    YYFPStore.currCase.loadFileNum = 0;
    YYFPStore.simAnimationMap = {};
  };

  /**
   * 锁定当前的数据
   * @param selectedWaterLine 当前选中的水位线数据;
   * @param currProjectParams 当前工况对应的paramStr;
   */
  const LockCurrCaseData = ({
    selectedWaterLine,
    currProjectParams
  }: {
    selectedWaterLine: string[];
    currProjectParams: string;
  }) => {
    // 将要展示的工况参数锁定，
    // 1. 选中的水位线数据
    let currSceneType = YYFPStore.currSceneType;
    YYFPStore.currCase.allWaterLine = selectedWaterLine;
    YYFPStore.currCase.loadFileNum = 0;
    YYFPStore.currCase.currProjectParams = currProjectParams; // 获取当前选中的案例，并保存相关参数
    let duration = RainDurationShowTimeMap[currSceneType].showTime;
    // 设置进度条的标题内容
    if (store.inputRecord[currSceneType].rainfallScene == 0) {
      YYFPStore.currCase.processTitle =
        store.options.RainfallIntensity[
          store.inputRecord[currSceneType][0].rainfallIntensity
        ].label +
        '-历时' +
        RainDurationShowTimeMap[currSceneType].rainDuration +
        '小时';
    } else if (store.inputRecord[currSceneType].rainfallScene == 1) {
      duration = store.inputRecord[currSceneType][1].cusRainfall.length;
      YYFPStore.currCase.processTitle = `自定义降雨-${store.inputRecord[currSceneType][1].cusRainfall.length}小时-${store.customRainfall.sum}mm`;
    }
    let { startTime: start, endTime: end } = getForecastTime(
      moment('2000/01/01 00:00:00'),
      duration,
      'h'
    ); // 进度条的时间
    if (store.inputRecord[currSceneType].rainfallScene == 2) {
      start = moment(store.inputRecord[currSceneType][2].time.start);
      end = moment(store.inputRecord[currSceneType][2].time.end);
      YYFPStore.currCase.processTitle = `${start.format('MM/DD')}-${end.format(
        'MM/DD'
      )}历史降雨`;
    }
  };

  /**
   * 处理开始计算的事件
   * important
   * @returns
   */
  const handleBegin = () => {
    let currSceneType = YYFPStore.currSceneType;
    let rainfallScene = store.inputRecord[currSceneType].rainfallScene;
    let tempCurrCaseParams = getCaseParams(
      currSceneType,
      store.inputRecord[currSceneType],
      store.selectedWaterLine,
      true
    );
    // 判断必要条件是否全部选中
    if (!isCanUse2Fetch()) return;
    store.isShowRestoreLastCalc[`${currSceneType}&${rainfallScene}`] = false;
    console.log('开始实时计算 - 正在计算的实时计算赋值', tempCurrCaseParams);
    store.inputRecord[currSceneType][rainfallScene].calcIngParams =
      tempCurrCaseParams;
    // 正式开始计算！
    YYFPStore.calcStatus = 'LOADING';
    rainfallScene != 0 ? calcRealTime() : loadResultFileByIds();
  };

  /**
   * 实时计算请求接口;
   * 1. 判断是否满足条件 ✅
   * 2. 进行实时计算请求获取ProjectIds
   * 3. 进行ws连接请求，获取计算进度；
   */
  const calcRealTime = async () => {
    message.success('开始实时计算');
    let currSceneType = YYFPStore.currSceneType;
    let currFormData = store.inputRecord[currSceneType];
    let type = `${currSceneType}&${currFormData.rainfallScene}`;
    YYFPStore.currModalData.type = undefined;
    try {
      let tempObj = {};
      let reqBody!: {
        sceneType: number;
        customRains?: { rain: number; time: string }[];
        waterLevel?: number[];
        rainStartTime?: string;
        rainEndTime?: string;
      };
      switch (type) {
        case '2&1':
          let tempCustomRainList = currFormData[1].cusRainfall.concat(
            currFormData[1].cusRainfall.map(item => {
              return { rainfall: 0 };
            })
          );
          // 高水位分析 - 自定义降雨
          reqBody = {
            sceneType: 2,
            customRains: tempCustomRainList.map((item, index) => {
              return {
                rain: item.rainfall,
                time: moment().add(index, 'h').format('YYYY-MM-DD HH:mm:ss')
              };
            }),
            waterLevel: store.selectedWaterLine as number[]
          };
          break;
        case '2&2':
          // 高水位分析 - 历史降雨
          reqBody = {
            sceneType: 2,
            waterLevel: store.selectedWaterLine as number[],
            rainStartTime: moment(currFormData[2].time.start).format(
              MomentFormatStr
            ),
            rainEndTime: moment(currFormData[2].time.end)
              .add(1, 'd')
              .subtract(1, 'second')
              .format(MomentFormatStr)
          };
          break;
        case '3&1':
          // 短时暴雨 - 自定义降雨
          let tempCustomRainListShortTime = currFormData[1].cusRainfall.concat(
            currFormData[1].cusRainfall.map(() => {
              return { rainfall: 0 };
            })
          );
          reqBody = {
            sceneType: 3,
            customRains: tempCustomRainListShortTime.map((item, index) => {
              return {
                rain: item.rainfall,
                time: moment().add(index, 'h').format('YYYY-MM-DD HH:mm:ss')
              };
            })
          };
          break;
        case '3&2':
          // 短时暴雨 - 历史降雨
          reqBody = {
            sceneType: 3,
            rainStartTime: moment(currFormData[2].time.start).format(
              MomentFormatStr
            ),
            rainEndTime: moment(currFormData[2].time.end)
              .add(1, 'd')
              .subtract(1, 'second')
              .format(MomentFormatStr)
          };
          break;
      }
      let tempProjectIdList: number[] = [];
      const data = await PreviewServer.customCalculate(reqBody);
      data.projectIdWL.map(item => {
        tempProjectIdList.push(item.projectId);
        YYFPStore.currCase.projectIds.push(item.projectId);
        tempObj[item.projectId] = item.waterLevel;
      });
      store.inputRecord[currSceneType][
        currFormData.rainfallScene
      ].currRealTimeCalcIdList = tempProjectIdList;
      store.realTimeWaterLineProjectIdMap = tempObj;
      store.inputRecord[currSceneType].currProjectParams = getCaseParams(
        currSceneType,
        store.inputRecord[currSceneType],
        store.selectedWaterLine,
        true
      );
      localStorage.setItem(
        type,
        JSON.stringify({
          selectedWaterLine: store.selectedWaterLine,
          RainfallScene: store.inputRecord[currSceneType].rainfallScene,
          currRealTimeCalcIdList: tempProjectIdList,
          cusRainfall: store.inputRecord[currSceneType][1].cusRainfall,
          sumRainfall: store.customRainfall.sum,
          status: 'loading',
          currProjectParams: store.inputRecord[currSceneType].currProjectParams,
          historyStartTime: store.inputRecord[currSceneType][2].time.start,
          historyEndTime: store.inputRecord[currSceneType][2].time.end
        })
      );
      store.inputRecord[currSceneType][
        currFormData.rainfallScene
      ].currRealTimeCalcIdList = tempProjectIdList;
      connectWs();
    } catch (e) {
      message.info('实时计算出错');
      YYFPStore.calcStatus = 'INIT';
      YYFPStore.currCase.loadFileNum = 0;
    }
  };

  /**
   * 开始加载结果文件 -- 设计工况
   */
  const loadResultFileByIds = async () => {
    YYFPStore.calcStatus = 'LOADING';
    YYFPStore.currCase.loadFileNum = 0;
    let currSceneType = YYFPStore.currSceneType;
    YYFPStore.currCase.currProjectParams = getCaseParams(
      currSceneType,
      store.inputRecord[currSceneType],
      store.selectedWaterLine
    );
    try {
      let reqBody = {
        forecastPeriod: RainDurationShowTimeMap[currSceneType].rainDuration,
        sceneOptions: [
          store.inputRecord[currSceneType].rainfallScene,
          store.inputRecord[currSceneType][0].rainfallIntensity,
          RainDurationShowTimeMap[currSceneType].value
        ],
        sceneType: Number(currSceneType),
        waterLevel:
          currSceneType == '2' ? (store.selectedWaterLine as string[]) : []
      };
      const data = await PreviewServer.start1(reqBody);
      handleProjectCalcDone(
        data.previewCalResults,
        StaticDirUrl.mesh,
        StaticDirUrl.geo_ca
      );
    } catch (e) {
      message.error('预演文件获取异常');
      YYFPStore.calcStatus = 'INIT';
      YYFPStore.currCase.loadFileNum = 0;
    }
  };

  const stopCurrCase = async () => {
    let currSceneType = YYFPStore.currSceneType;
    let currRainfallScene = store.inputRecord[currSceneType].rainfallScene;
    store.inputRecord[YYFPStore.currSceneType][
      currRainfallScene
    ].currRealTimeCalcIdList = [];
    let tempIdList =
      store.inputRecord[YYFPStore.currSceneType][currRainfallScene]
        .currRealTimeCalcIdList;
    await PreviewServer.customCalculateStop(tempIdList);
    store.popupVisible = false;
    store.ws?.close();
    store.ws = undefined;
    GlobalStore.wsUrl = '';
    YYFPStore.calcStatus = 'INIT';
    store.realTimeWaterLineProjectIdMap = {};
    YYFPStore.currCase.currProjectParams = '';
    store.popupVisible = false;
    let type = `${currSceneType}&${currRainfallScene}`;
    localStorage.removeItem(type);
  };

  useEffect(() => {
    if (YYFPStore.calcStatus === 'RENDER_DONE') {
      YYFPStore.currSceneType = YYFPStore.currCase.currSceneType;
      form.setFieldValue('RainfallScene', YYFPStore.currCase.rainfallScene);
      store.inputRecord[YYFPStore.currCase.currSceneType].rainfallScene =
        YYFPStore.currCase.rainfallScene;
      switch (YYFPStore.currCase.rainfallScene) {
        case 0:
          // 选中设计工况
          form.setFieldValue(
            'RainfallIntensity',
            YYFPStore.currCase.rainfallIntensity
          );
          break;
        case 1:
          // 选中自定义降雨
          form.setFieldValue('cusRainfall', YYFPStore.currCase.cusRainfall);
          break;
        case 2:
          // 选中历史降雨
          form.setFieldValue(
            'historyRainTime',
            YYFPStore.currCase.historyRainTime
          );
          break;
      }
    }
  }, [YYFPStore.calcStatus]);

  const dateRender = (currentDate, today) => {
    console.log('currentDate', currentDate);
    let isRain = store.historyRainWithOutZeroList_time.includes(
      currentDate.format('YYYYMMDD')
    );
    return (
      <>
        {isRain ? (
          <div
            className="ant-picker-cell-inner"
            style={{
              backgroundImage: `url(${IMG_PATH.icon.rain})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%'
            }}>
            {currentDate.format('D')}
          </div>
        ) : (
          <div className="ant-picker-cell-inner">{currentDate.format('D')}</div>
        )}
      </>
    );
  };

  return (
    <YYFPLeftWrapper
      isHighWaterLevel={YYFPStore.currSceneType == '2'}
      isActivePanel={store.waterLineActiveKey == '1'}>
      <div className="common-header-outer">
        <PanelHeader title={'情景设置'} />
      </div>
      <div className="operation-outer bg-content-area-alpha">
        {/* 水位线选择 & 千岛湖实时水位 */}
        {YYFPStore.currSceneType == '2' && (
          <Collapse
            className="water-line-outer"
            activeKey={store.waterLineActiveKey}
            expandIconPosition="end"
            accordion
            onChange={e => {
              // @ts-ignore
              store.waterLineActiveKey = e ? e : '';
            }}
            ghost>
            <Panel
              header={
                <div style={{ paddingLeft: '5rem', border: 'unset' }}>
                  水位线选择（m）
                  <span style={{ fontSize: '18rem' }}>
                    {/* 水位线选择 */}
                    {!store.waterLineActiveKey &&
                      store.selectedWaterLine.toString()}
                  </span>
                </div>
              }
              key="1">
              {/* 高水位 - 水位线选择 */}
              <div className="water-line-select">
                <div className="water-line-select-content">
                  <img
                    src="/images/dam_bg_height.png"
                    draggable={false}
                    alt="水位线选择"
                  />
                  <div className="form-outer">
                    <Checkbox.Group
                      value={store.selectedWaterLine}
                      onChange={e => {
                        store.selectedWaterLine = e;
                        handleFormChange();
                      }}>
                      {store.options.waterLine.map(item => {
                        return (
                          <Checkbox
                            key={item.value}
                            value={item.value}
                            disabled={
                              store.selectedWaterLine.length == 2 &&
                              !store.selectedWaterLine.includes(item.value)
                            }>
                            <div
                              className="flex-between"
                              style={{ width: '145rem' }}>
                              <div>{item.label}</div>
                              <div>{item.value}m</div>
                            </div>
                          </Checkbox>
                        );
                      })}
                    </Checkbox.Group>
                  </div>
                </div>
              </div>
              {/* 千岛湖水位相关 */}
              <div className="water-line">
                <p>
                  千岛湖实时水位：<span>{YYFPStore.waterData.waterLine}</span> m
                </p>
                <p className="desc">数据采集时间：{YYFPStore.waterData.time}</p>
              </div>
              {/* 分割线 */}
              <div className="divider border"></div>
            </Panel>
          </Collapse>
        )}
        {/* 参数选择框 */}
        <Form form={form} onChange={handleFormChange}>
          {/* 降雨场景 */}
          <FormItemOuter
            title="降雨场景"
            name="RainfallScene"
            onChange={e => {
              handleInputBackTrace(e.target.value);
            }}
            onClick={() => {
              store.waterLineActiveKey =
                store.selectedWaterLine.length > 0 ? '' : '1';
            }}
            options={store.options.RainfallScene}
          />
          {/* 设计暴雨天气 */}
          {store.inputRecord[YYFPStore.currSceneType].rainfallScene == 0 && (
            <Fragment>
              {/* 降雨强度 */}
              <FormItemOuter
                title="降雨强度"
                name="RainfallIntensity"
                options={store.options.RainfallIntensity}
              />
              {/* 降雨历时 */}
              <div className="rehearsalTime-desc-outer">
                <p>
                  降雨历时：
                  <span>
                    {
                      RainDurationShowTimeMap[YYFPStore.currSceneType]
                        .rainDuration
                    }
                  </span>
                  小时
                </p>
                <p>
                  预演时长：
                  <span>
                    {RainDurationShowTimeMap[YYFPStore.currSceneType].showTime}
                  </span>
                  小时
                </p>
              </div>
              <div className="btn-like">降雨量：{YYFPStore.rainFall} mm</div>
            </Fragment>
          )}
          {/* 自定义降雨才会展示这个 如果当前展示工况是短时暴雨并且自定义降雨不是空数组 || 当前自定义降雨不是空数组 */}
          {store.inputRecord[YYFPStore.currSceneType].rainfallScene == 1 && (
            <Fragment key={YYFPStore.currSceneType}>
              <div style={{ position: 'relative' }}>
                <div className="cus-rainfall-counter">
                  降雨总量：
                  <strong>
                    {Math.round(store.customRainfall.sum * 10000) / 10000}
                    <span> mm</span>
                  </strong>
                </div>
                <div className="cus-rainfall-counter">
                  降雨历时：<strong> {store.customRainfall.time}</strong>{' '}
                  小时，预演时长：
                  <strong> {store.customRainfall.time * 2}</strong> 小时
                </div>
                {/* 三个操作按钮 */}
                <div className="cus-btn-outer">
                  <div
                    onClick={showRainProcess}
                    className="show-rain-process-btn">
                    降雨过程
                  </div>
                  <div onClick={showQueueList} className="show-queue-list-btn">
                    预演列表
                  </div>
                  {/* 高水位的恢复计算 */}
                  {/* {store.isShowRestoreLastCalc['2&1'] && (
                    <Button
                      onClick={() => {
                        handleResetLastCalc(
                          '2',
                          store.inputRecord['2'].rainfallScene
                        );
                      }}>
                      恢复计算
                    </Button>
                  )} */}
                  {/* 短时暴雨的恢复计算 */}
                  {/* {store.isShowRestoreLastCalc['3&1'] && (
                    <Button
                      onClick={() => {
                        handleResetLastCalc(
                          '3',
                          store.inputRecord['3'].rainfallScene
                        );
                      }}>
                      恢复计算
                    </Button>
                  )} */}
                </div>
              </div>
              <Form.List name="cusRainfall">
                {(fields, { add, remove }) => (
                  <div className="from-list-outer">
                    <div
                      className="form-list-operation-outer"
                      id="form-list-operation-outer">
                      {fields.map(({ key, name, ...restField }, index) => (
                        <Space
                          key={key}
                          align="center"
                          style={{ position: 'relative' }}>
                          <Form.Item
                            label={`第${index + 1}小时降雨`}
                            {...restField}
                            name={[name, 'rainfall']}>
                            <InputNumber
                              placeholder="输入降雨量"
                              defaultValue={0}
                              controls={false}
                              onChange={handleInputChange}
                              min={0}
                            />
                          </Form.Item>
                          <div className="form-list-item-unit">mm</div>
                          {form.getFieldValue('cusRainfall')?.length > 1 && (
                            <MinusSquareOutlined
                              className="minusSquareOut-icon"
                              onClick={() => {
                                remove(name);
                                showRainProcess();
                                store.customRainfall.time =
                                  form.getFieldValue('cusRainfall').length;
                                handleFormChange();
                              }}
                            />
                          )}
                        </Space>
                      ))}
                    </div>
                    <Form.Item>
                      <Button
                        className="operation-add-item"
                        disabled={
                          form.getFieldValue('cusRainfall')?.length >= 24
                        }
                        onClick={async () => {
                          let currCount =
                            form.getFieldValue('cusRainfall')?.length || 0;
                          if (currCount < 24) {
                            await add();
                            showRainProcess();
                            store.customRainfall.time =
                              form.getFieldValue('cusRainfall').length;
                          }
                          handleFormChange();
                          let dom = document.getElementById(
                            'form-list-operation-outer'
                          )!;
                          dom.scrollTop = dom.scrollHeight;
                        }}
                        block>
                        <PlusOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </Form.List>
            </Fragment>
          )}
          {/* 历史降雨 */}
          {store.inputRecord[YYFPStore.currSceneType].rainfallScene == 2 && (
            <Fragment>
              <Form.Item
                name="historyRainTime"
                className="rehearsalTime-desc-outer">
                <DatePicker.RangePicker
                  onChange={handleFormChange}
                  disabledDate={disabledDate}
                  onCalendarChange={onCalendarChange}
                  dateRender={dateRender}
                />
              </Form.Item>
              <div style={{ position: 'relative' }}>
                <div className="cus-rainfall-counter">
                  降雨总量：
                  <strong>
                    {Math.round(
                      store.inputRecord[YYFPStore.currSceneType][2].rain.sum *
                        10000
                    ) / 10000}
                    <span> mm</span>
                  </strong>
                </div>
                <div className="cus-rainfall-counter">
                  预演时长：
                  <strong>
                    {
                      store.inputRecord[YYFPStore.currSceneType][2].rain.list
                        .length
                    }
                  </strong>{' '}
                  小时
                </div>
                {/* 三个操作按钮 */}
                <div className="cus-btn-outer">
                  <div
                    onClick={showRainProcess}
                    className="show-rain-process-btn">
                    降雨过程
                  </div>
                  <div onClick={showQueueList} className="show-queue-list-btn">
                    预演列表
                  </div>
                  {/* 高水位的恢复计算 */}
                  {/* {store.isShowRestoreLastCalc['2&2'] && (
                    <Button
                      onClick={() => {
                        handleResetLastCalc(
                          '2',
                          store.inputRecord['2'].rainfallScene
                        );
                      }}>
                      恢复计算
                    </Button>
                  )} */}
                  {/* 短时暴雨的恢复计算 */}
                  {/* {store.isShowRestoreLastCalc['3&2'] && (
                    <Button
                      onClick={() => {
                        handleResetLastCalc(
                          '3',
                          store.inputRecord['3'].rainfallScene
                        );
                      }}>
                      恢复计算
                    </Button>
                  )} */}
                </div>
              </div>
            </Fragment>
          )}
        </Form>
        {/* 提交按钮 */}
        {YYFPStore.calcStatus === 'INIT' && (
          <Button className="operation-btn" onClick={handleBegin}>
            {store.inputRecord[YYFPStore.currSceneType].rainfallScene != 0
              ? '开始实时计算'
              : '开始预演'}
          </Button>
        )}
        {/* 实时计算完成 || 预演完成 */}
        {YYFPStore.calcStatus === 'RENDER_DONE' && (
          <Button className="operation-btn">预演完成</Button>
        )}
        {YYFPStore.calcStatus === 'LOADING' &&
          (YYFPStore.currCase.currProjectParams ===
          getCaseParams(
            YYFPStore.currSceneType,
            store.inputRecord[YYFPStore.currSceneType],
            store.selectedWaterLine
          ) ? (
            <Button className="operation-btn">
              正在加载结果文件...
              {YYFPStore.loadedPercent}
              <LoadingOutlined />
            </Button>
          ) : (
            <Popconfirm
              title="点击取消计算"
              onConfirm={stopCurrCase}
              open={store.popupVisible}
              onCancel={() => {
                store.popupVisible = false;
              }}
              okText="确定"
              cancelText="取消">
              <Button
                className="operation-btn"
                style={{ fontSize: '18rem' }}
                onClick={() => {
                  store.popupVisible = true;
                }}>
                实时计算进度：
                <LoadingOutlined />
                {store.realTimeProcess}
              </Button>
            </Popconfirm>
          ))}
        {YYFPStore.calcStatus === 'CALC_DONE' && (
          <Button
            className="operation-btn"
            onClick={() => {
              handleRealTimeDONE(
                YYFPStore.currSceneType,
                store.inputRecord[YYFPStore.currSceneType].rainfallScene
              );
            }}>
            实时计算完成，点击加载结果文件
          </Button>
        )}
      </div>
    </YYFPLeftWrapper>
  );
});

interface FormItemOuterProp {
  title: string;
  name: string;
  options: ISelectOptions[];
  onChange?: Function;
  onClick?: Function;
}
const FormItemOuter = ({
  title,
  name,
  options,
  onChange,
  onClick
}: FormItemOuterProp) => {
  const [className, setClassName] = useSafeState<string>();
  useEffect(() => {
    if (options.length == 0) {
      return;
    }
    options.length == 1 && setClassName('one');
    options.length == 2 && setClassName('two');
    options.length == 3 && setClassName('three');
    options.length == 5 && setClassName('five');
  }, [options]);
  return (
    <div className="form-item-outer">
      <div className="form-item_title">{title}：</div>
      <div className="form-item_content">
        <Form.Item name={name}>
          <Radio.Group
            onFocus={() => {
              onClick && onClick();
            }}
            onChange={e => {
              onChange && onChange(e);
            }}>
            {options.map((item, index) => {
              return (
                <Radio.Button
                  key={index}
                  value={item.value}
                  className={className}>
                  {item.label}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};
