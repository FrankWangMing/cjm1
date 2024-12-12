import { PanelHeader } from '@/components/Header';
import { Weather } from '@/components/Weather';
import {
  getForecastTime,
  IMG_PATH,
  MomentFormatStr,
  PHYSICAL_KEYWORDS,
  ShowModeProjectId,
  ShowModeTime
} from '@/utils/const';
import { message } from 'antd';
import SwitchPeriodTimeCom from './SwitchPeriodTimeCom';
import { INIT_FORECAST_TIME, useStore } from '../store';
import moment, { Moment } from 'moment';
import { ForecastServer } from '@/service';
import GlobalStore from '@/store';
import { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useSafeState, useUpdateEffect } from 'ahooks';
import Loading from '@/components/Loading';
const HLYBLeftCom: React.FC<{ periodType: 'week' | 'day' }> = observer(
  ({ periodType }) => {
    const HLYBStore = useStore();

    /**
     * 预见期回溯响应事件
     */
    const handleBacktrack = (e: Moment | null) => {
      HLYBStore.backTrackTime = e;
      // 返回
      if (!e) {
        HLYBStore.currCase.forecastTime = INIT_FORECAST_TIME;
        return;
      }
      // 开始回溯
      beginCalc();
    };

    /**
     * 锁定一下当前的值
     */
    const lockCurrCaseData = async () => {
      let tempForecastTime = HLYBStore.currCase.forecastTime;
      let currZero = moment().format('YYYY-MM-DD 00:00:00');
      let { startTime, endTime } = getForecastTime(
        moment(),
        HLYBStore.currCase.forecastTime,
        'h'
      ); // 获取起始和终止时间
      if (HLYBStore.periodType == 'week') {
        startTime = moment(currZero);
        endTime = moment(moment(currZero).add('h', tempForecastTime));
      }
      if (HLYBStore.backTrackTime) {
        tempForecastTime = 24;
        startTime = moment(
          HLYBStore.backTrackTime.format('YYYY-MM-DD 00:00:00')
        );
        endTime = HLYBStore.backTrackTime;
      }
      HLYBStore.dispose(); // 清除内存中缓存数据对象
      HLYBStore.currCase.period = {
        startTime,
        endTime
      };
      HLYBStore.currCase.forecastTime = tempForecastTime;
    };

    /**
     * 开始计算，加载结果文件
     */
    const beginCalc = async () => {
      await lockCurrCaseData();
      let startTime = '',
        endTime = '',
        projectId = 0,
        calType = 1;
      // 根据是否是演示模式更新相关请求参数
      if (GlobalStore.isShowMode) {
        // 演示模式
        projectId = ShowModeProjectId;
        startTime = ShowModeTime.format(MomentFormatStr);
        endTime = moment(startTime)
          .add('h', HLYBStore.currCase.forecastTime)
          .format(MomentFormatStr);
        calType = 4;
      } else if (HLYBStore.periodType == 'day') {
        // 日预报
        startTime =
          HLYBStore.currCase.period.startTime!.format(MomentFormatStr);
        endTime = HLYBStore.currCase.period.endTime!.format(MomentFormatStr);
        calType = 1;
      } else {
        // 周
        startTime =
          HLYBStore.currCase.period.startTime!.format(MomentFormatStr);
        endTime = HLYBStore.currCase.period.endTime!.format(MomentFormatStr);
        calType = 2;
      }
      // 开始预报！！！
      const data = await ForecastServer.calcStart(
        startTime,
        endTime,
        projectId
      );
      const { path: jsonPath } = await ForecastServer.cloudQuery({
        startTime,
        endTime,
        projectId: data.projectId,
        calType
      });
      setFloodArea({
        min: 0,
        max: 0
      });

      setFloodAreaLoading(false);
      if (location.pathname === '/hlyb' && data.nFrameList.length > 0) {
        if (GlobalStore.mapboxLayer == null) {
          await GlobalStore.createMapboxLayer();
        }
        HLYBStore.currCase.NFrames = data.nFrameList.length + 2;
        let tempResultList: string[] = [];
        // let currPath = data.path.split('8311')[1];
        let currPath = data.path;
        data.nFrameList.map(item => {
          tempResultList.push(currPath + item + '.json.gz');
        });
        // 加载结果文件并重新赋值给simAnimation
        let tempMap = {};
        tempMap['animateCloud'] =
          await GlobalStore.mapboxLayer?.loadResultSimAnimation({
            renderDataType: PHYSICAL_KEYWORDS.水深,
            colorTheme: PHYSICAL_KEYWORDS.水深,
            resultPathList: tempResultList,
            handleLoadedNum: e => {
              HLYBStore.currCase.loadedNum = e;
            },
            _sumFrames: data.nFrameList.length
          });
        tempMap['staticCloud'] =
          await GlobalStore.mapboxLayer?.loadResultSimAnimation({
            renderDataType: PHYSICAL_KEYWORDS.最大水深,
            colorTheme: PHYSICAL_KEYWORDS.最大水深,
            resultPathList: [jsonPath],
            // resultPathList: [jsonPath.split('8311')[1]],
            handleLoadedNum: e => {
              HLYBStore.currCase.loadedNum++;
            },
            _sumFrames: 1,
            maxValue: {
              [PHYSICAL_KEYWORDS.历时]:
                HLYBStore.periodType == 'day' ? 12 * 60 : 24 * 60 * 7
            }
          });
        // 加载最大水深&淹没历时云图
        GlobalStore.map?.addLayer(GlobalStore.mapboxLayer as mapboxgl.AnyLayer);
        HLYBStore.setSimAnimationMap(tempMap);
        HLYBStore.currCase.villageRiskList = data.riskList;
        HLYBStore.currCase.caseId = data.projectId;
        HLYBStore.markerList.village = GlobalStore.getVillageMarkerList(
          data.riskList
        ); // 村庄点位基础数据
        HLYBStore.markerList.section = GlobalStore.sectionMarkerList;
        getFloodAreaData();
        // @ts-ignore
        GlobalStore.map?.setPointer();
        HLYBStore.currLayers = ['village', 'risk'];
        HLYBStore.handleTypeChange(PHYSICAL_KEYWORDS.水深);
        HLYBStore.addMarker();
        HLYBStore.currCase.isResultRenderDone = true; // 渲染结束
        message.success('渲染完成');
      } else {
        HLYBStore.currLayers = ['village'];
        HLYBStore.currCase.NFrames = 0;
        HLYBStore.currCase.isResultRenderDone = true; // 计算结束标识
        message.success('计算结束！');
      }
    };

    useEffect(() => {
      if (!GlobalStore.map) return;
      !HLYBStore.backTrackCalc && beginCalc();
    }, [HLYBStore.currCase.forecastTime, GlobalStore.map]);

    const [floodArea, setFloodArea] = useSafeState<{
      min: number;
      max: number;
    }>({
      min: 0,
      max: 0
    });
    const [floodAreaLoading, setFloodAreaLoading] = useSafeState(false);
    const getFloodAreaData = async () => {
      setFloodAreaLoading(true);
      let startTime = '',
        endTime = '',
        projectId = 0,
        simulationType = 1;
      const { startTime: start, endTime: end } = getForecastTime(
        moment(),
        HLYBStore.currCase.forecastTime,
        'h'
      );
      if (GlobalStore.isShowMode) {
        // 演示模式
        projectId = ShowModeProjectId;
        startTime = ShowModeTime.format(MomentFormatStr);
        endTime = moment(startTime)
          .add('h', HLYBStore.currCase.forecastTime)
          .format(MomentFormatStr);
        simulationType = 4;
      } else {
        startTime = start.format(MomentFormatStr);
        endTime = end.format(MomentFormatStr);
        projectId = HLYBStore.currCase.caseId;
      }
      if (HLYBStore.backTrackTime) {
        startTime =
          HLYBStore.currCase.period.startTime!.format(MomentFormatStr);
        endTime = moment(startTime)
          .add(HLYBStore.currCase.forecastTime, 'h')
          .format(MomentFormatStr);
      }
      const res = await ForecastServer.floodArea(
        startTime,
        endTime,
        projectId,
        simulationType
      );
      setFloodArea({
        min: res.minFloodArea,
        max: res.maxFloodArea
      });
      setFloodAreaLoading(false);
    };
    useUpdateEffect(() => {
      if (periodType == 'week') {
        HLYBStore.currCase.forecastTime = 48;
      } else {
        HLYBStore.currCase.forecastTime = 3;
      }
    }, [periodType]);

    return (
      <div>
        <Weather
          type={periodType}
          forecastTime={HLYBStore.currCase.forecastTime}
          backTrackTime={HLYBStore.backTrackTime}
        />
        <SwitchPeriodTimeCom
          defaultForecastTime={HLYBStore.currCase.forecastTime}
          periodType={periodType}
          handleValChanged={(e: number) => {
            HLYBStore.currCase.forecastTime = e;
          }}
          isRenderLoading={!HLYBStore.currCase.isResultRenderDone} // 是否正在Loading?
          handleBacktrack={e => {
            handleBacktrack(e);
          }}
          currBackTrack={HLYBStore.backTrackTime}
        />
        {HLYBStore.currCase.isResultRenderDone && (
          <div className="core-area-outer bg-content-area-alpha">
            <div className="common-header-outer">
              <PanelHeader title={'流域淹没情况概览'} />
            </div>
            <div className="core-area-content">
              <img src={IMG_PATH.icon.floodArea} alt="" />
              <div className="core-area-desc">
                <Loading loadingFlag={floodAreaLoading} color="#fff" />
                {!floodAreaLoading && (
                  <Fragment>
                    <h1>
                      最大淹没面积:
                      <br />
                      <span>{Math.round(floodArea.max * 10) / 10}</span>
                      k㎡
                    </h1>
                    <h1>
                      最小淹没面积: <br />
                      <span>{Math.round(floodArea.min * 10) / 10}</span>
                      k㎡
                    </h1>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export { HLYBLeftCom };
