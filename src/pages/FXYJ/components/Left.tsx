import { PanelHeader, TextHeader } from '@/components/Header';
import { MAPBOX_DEFAULT_CONFIG, MarkerObj } from '@/components/Map';
import { IMarker } from '@/domain/marker';
import { AlarmServer, ITransferInfos } from '@/service';
import {
  getForecastTime,
  IMG_PATH,
  MomentFormatStr,
  ShowModeProjectId,
  ShowModeTime
} from '@/utils/const';
import { useUpdateEffect } from '@umijs/hooks';
import { useSafeState, useMount } from 'ahooks';
import { Radio } from 'antd';
import { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import GlobalStore from '@/store';
import { observer, useLocalStore } from 'mobx-react-lite';
import moment, { Moment } from 'moment';
import { useStore, IRequestTimeProp } from '../store';
// 视频监控相关
import { VideoMonitor } from '../components/VideoMonitor';
import { MonitorServer } from '@/service';
import { ShowServer } from '@/service/show';
const Left = observer(() => {
  const IndexStore = useStore();
  const store = useLocalStore(
    (): {
      /**
       * 当前选中的卡片id
       */
      currCardId: string;
      /**
       * 卡片选中发生变化的事情
       */
      setCurrCardId: Function;
      transferInfos: ITransferInfos[];
      type: string;
    } => ({
      currCardId: '',
      type: '',
      setCurrCardId(e: string, isNeedClick: boolean) {
        this.type = e[2];
        this.currCardId = e;
        if (isNeedClick) {
          handleLeftCardClick();
        }
      },
      transferInfos: []
    })
  );
  const [alarmInfo, setAlarmInfo] = useSafeState<IResultRealAlarm>({
    rainAlarms: [],
    reservoirAlarms: [],
    riverAlarms: []
  });
  /**
   * 地图打点
   * @returns
   */
  const handleMarkerChange = async (): Promise<IMarker[]> => {
    return new Promise(resolve => {
      if (store.currCardId.length != 3) return;
      let tempVillageList = [];
      let tempIdArr = store.currCardId.split('&');
      let [index, key] = [
        tempIdArr[0],
        tempIdArr[1] == '0'
          ? 'immediately'
          : tempIdArr[1] == '1'
          ? 'prepare'
          : 'safe'
      ];
      tempVillageList = store.transferInfos[index][key];
      let markerList = formatMarkerData(tempVillageList, key);
      // 存到本界面的全局变量，为了以后改变Layer可以重新大到村庄点位
      IndexStore.currVillageData = markerList;
      IndexStore.currCardId = store.currCardId;
      if (IndexStore.currLayer.includes('village')) {
        MarkerObj.remove();
        MarkerObj.add({
          map: GlobalStore.map,
          markerList,
          handleClick: (id, type) => {
            IndexStore.handleVillageIdChange(id);
          }
        });
      }
      resolve(markerList);
    });
  };

  // useUpdateEffect(() => {
  //   // todo
  //   handleMarkerChange();
  //   IndexStore.handleLayerChange(IndexStore.currLayer, false);
  // }, [GlobalStore.currZoom]);

  /**
   * 处理选中的工况变化
   */
  const handleLeftCardClick = async () => {
    GlobalStore.map?.flyTo({
      zoom: MAPBOX_DEFAULT_CONFIG.minZoom,
      pitch: 0,
      bearing: 0,
      center: MAPBOX_DEFAULT_CONFIG.center as [number, number]
    });
    // 1 隐藏 云图、右侧框、弹窗;
    IndexStore.currSimAnimation?.show(false);
    IndexStore.isRightHideAll = true;
    IndexStore.modalData.id = -1;
    IndexStore.modalData.type = '';
    // 给弹窗中展示数据使用;
    IndexStore.currProjectObj.adjustType =
      store.currCardId.split('&')[1] == '1'
        ? '建议准备转移'
        : store.currCardId.split('&')[1] == '0'
        ? '建议立即转移'
        : '无需转移';
    IndexStore.currLayer = ['village'];
    handleMarkerChange();
  };

  const [updateTimeUI, setUpdateTimeUI] = useSafeState('');

  /**
   * 初始化左侧数据
   */
  const fetchInitData = async () => {
    let projectId = 0,
      startTime: Moment = moment();
    let queryIndex: { startTime: string; endTime: string }[] = [];
    if (GlobalStore.isShowMode) {
      // 演示模式
      projectId = ShowModeProjectId;
      startTime = ShowModeTime;
    } else {
      let { startTime: start } = getForecastTime(moment(), 0, 'h');
      startTime = start;
    }
    // 组件queryIndex数据
    [1, 3, 6].map(item => {
      queryIndex.push({
        startTime: startTime.format(MomentFormatStr),
        endTime: moment(startTime).add('h', item).format(MomentFormatStr)
      });
    });
    const data = await AlarmServer.queryTransferInfo(projectId, queryIndex);
    setUpdateTimeUI(data.updateTime);
    store.transferInfos = data.transferInfos;
    store.setCurrCardId('1&0', false);
    IndexStore.currLayer = ['village', 'warehouse', 'shelter'];
    IndexStore.time_loaded = moment();
    // handleMarkerChange();
    // IndexStore.handleLayerChange(IndexStore.currLayer, false);
  };

  useEffect(() => {
    if (
      IndexStore.shelterData.data.length > 0 &&
      IndexStore.wareHouseData.data.length > 0
    ) {
      handleMarkerChange();
      IndexStore.handleLayerChange(IndexStore.currLayer, false);
    }
  }, [
    IndexStore.shelterData.data,
    IndexStore.wareHouseData.data,
    store.transferInfos
  ]);
  const imgTotransfer = {
    immediately: `${IMG_PATH.icon.immediate_transfer}`,
    prepare: `${IMG_PATH.icon.prepare_transfer}`,
    safe: `${IMG_PATH.icon.safe_transfer}`
  };
  const riskTotransfer = {
    immediately: 1,
    prepare: 2,
    safe: 0
  };
  /**
   * 格式化地图打点数据
   * @param data 地图数据
   * @param type 点位类型
   * @returns
   */
  const formatMarkerData = (
    data: {
      id: number;
      latitude: number;
      longitude: number;
      village: string;
    }[],
    type: string
  ): IMarker[] => {
    let resList: IMarker[] = data.map(item => {
      return {
        id: item.id,
        longitude: item.longitude,
        latitude: item.latitude,
        // type: type,
        type: 'village',
        icon: imgTotransfer[type],
        risk: riskTotransfer[type],
        width: 20,
        height: 20,
        name: item.village,
        nameShowOuterCss: { marginBottom: 100 + 'rem' },
        nameShowCss: { marginBottom: 70 + 'rem' }
      };
    });
    return resList;
  };

  useEffect(() => {
    if (!GlobalStore.map) return;
    fetchInitData();
  }, [GlobalStore.map]);

  // 监控视频相关的fun
  const [currMonitorInfo, setCurrMonitorInfo] = useSafeState<monitorBaseInfo>();
  const [monitorBaseInfo, setMonitorBaseInfo] = useSafeState<monitorBaseInfo[]>(
    []
  );
  useMount(() => {
    getAllMonitorBaseInfo(); // 所有监控点位数据
    getRealAlarmData(IndexStore.requestTime); // 实时警情
  });

  /**
   * 获取所有视频监控的基本信息
   */
  const getAllMonitorBaseInfo = async () => {
    const data = await MonitorServer.getPictures();
    // console.log('视频监控 - 所有图片相关数据', data);
    setMonitorBaseInfo(data.pictures);
    setCurrMonitorInfo(data.pictures[0]);
  };
  /**
   * 放大视频监控弹窗
   */
  const handleEnLarge = () => {
    (IndexStore.modalData.id = currMonitorInfo?.id),
      (IndexStore.modalData.type = 'monitor');
    IndexStore.currLayer = ['MONITOR_STATION'];
    // IndexStore.isJustCssActive_bottomLayer = true;
    // IndexStore.selectBottomMenus = ['MONITOR_STATION'];
    // // 恢复至默认视角
    // IndexStore.handleMapFlyByClick(
    //   MAPBOX_DEFAULT_CONFIG.center[0],
    //   MAPBOX_DEFAULT_CONFIG.center[1],
    //   currMonitorInfo?.id,
    //   'MONITOR_STATION',
    //   false
    // );
  };
  const handleCarouselChange = (currIndex: number) => {
    setCurrMonitorInfo(monitorBaseInfo[currIndex]);
  };
  const handleClickMonitorByIndex = () => {
    (IndexStore.modalData.id = currMonitorInfo?.id),
      (IndexStore.modalData.type = 'monitor');
  };
  //实时警情相关
  const getRealAlarmData = async (param: IRequestTimeProp) => {
    const data = await ShowServer.realAlarm.info(param);
    setAlarmInfo(data);
    IndexStore.reservoirOverflow.small.num = data.reservoirAlarms.filter(
      item => {
        return item.reservoirType == 5;
      }
    ).length;
    IndexStore.reservoirOverflow.middle.num = data.reservoirAlarms.filter(
      item => {
        return item.reservoirType == 4;
      }
    ).length;
  };
  /**
   * 处理点击实时警情
   */
  const handleClickRealTimeAlarm = (e: string) => {
    switch (e) {
      case 'RAINFALL_STATION':
        if (alarmInfo.rainAlarms.length > 0) {
          // IndexStore.isJustCssActive_bottomLayer = true;
          IndexStore.currLayer = ['RAINFALL_STATION'];
          let currPoint = alarmInfo.rainAlarms[0];
          // IndexStore.handleMapFlyByClick(
          //   currPoint.longitude,
          //   currPoint.latitude,
          //   undefined,
          //   'RAINFALL_STATION',
          //   true
          // );
          IndexStore.handleMapFlyByClick(
            currPoint.longitude,
            currPoint.latitude,
            currPoint.stationId,
            'RAINFALL_STATION',
            true
          );
        }
        break;
      case 'GAUGING_STATION_RIVER':
        if (alarmInfo.riverAlarms.length > 0) {
          // IndexStore.isJustCssActive_bottomLayer = true;
          IndexStore.currLayer = ['GAUGING_STATION'];
          let currPoint = alarmInfo.riverAlarms[0];
          IndexStore.handleMapFlyByClick(
            currPoint.longitude,
            currPoint.latitude,
            currPoint.stationId,
            'GAUGING_STATION_RIVER',
            true
          );
        }
        break;
      case 'GAUGING_STATION_RESERVOIR':
        if (alarmInfo.reservoirAlarms.length > 0) {
          // IndexStore.isJustCssActive_bottomLayer = true;
          IndexStore.currLayer = ['GAUGING_STATION'];
          let currPoint = alarmInfo.reservoirAlarms[0];
          IndexStore.handleMapFlyByClick(
            currPoint.longitude,
            currPoint.latitude,
            currPoint.stationId,
            'GAUGING_STATION_RESERVOIR',
            true
          );
        }
        break;
      default:
        break;
    }
  };

  return (
    <LeftWrapper>
      <>
        <div className="common-header-outer">
          <PanelHeader title={'临界水位预警'} />
        </div>
        <div className="fxyj-left-content">
          <div className="topTime">数据更新时间：{updateTimeUI}</div>
          <Radio.Group className="custom-radio-group" value={store.currCardId}>
            {store.transferInfos.map((item, key) => {
              //todo 隐藏掉一个
              if (key !== 2) {
                return (
                  <Fragment key={key}>
                    {/* <div className="divide"></div> */}
                    <div className="timeTitle">
                      <div className="titleIcon"></div>
                      {`近${item.index}小时`}
                    </div>
                    <div className="sub-content">
                      {/* <div className="rainfall">
                      监测雨量：<span>{item.rain.toFixed(2)}</span> mm
                    </div> */}
                      <div className="flex-between">
                        {/* 立即转移 */}
                        <div
                          className={[
                            'village-radio-select-outer',
                            `${key}&0` === store.currCardId &&
                              'village-radio-selected'
                          ].join(' ')}
                          onClick={() => {
                            store.setCurrCardId(`${key}&0`, true);
                          }}>
                          <div className="select-top">
                            <img
                              src={IMG_PATH.icon.immediate_transfer}
                              alt="立即转移"
                            />
                            <div className="village-risk-num">
                              <span>{item.immediately.length}</span>
                            </div>
                          </div>
                          <div className="flex-center">
                            <Radio value={`${key}&0`}>
                              <span className="bottomSpan">立即转移</span>
                            </Radio>
                          </div>
                        </div>
                        {/* 建议准备转移 */}
                        <div
                          className={[
                            'village-radio-select-outer',
                            `${key}&1` === store.currCardId &&
                              'village-radio-selected'
                          ].join(' ')}
                          onClick={() => {
                            store.setCurrCardId(`${key}&1`, true);
                          }}>
                          <div className="select-top">
                            <img
                              src={IMG_PATH.icon.prepare_transfer}
                              alt="准备转移"
                            />
                            <div className="village-risk-num">
                              <span>{item.prepare.length}</span>
                            </div>
                          </div>
                          <div className="flex-center">
                            <Radio value={`${key}&1`}>
                              <span className="bottomSpan">准备转移</span>
                            </Radio>
                          </div>
                        </div>
                        {/* 建议无转移 */}
                        <div
                          className={[
                            'village-radio-select-outer',
                            `${key}&2` === store.currCardId &&
                              'village-radio-selected'
                          ].join(' ')}
                          onClick={() => {
                            store.setCurrCardId(`${key}&2`, true);
                          }}>
                          <div className="select-top">
                            <img
                              src={IMG_PATH.icon.safe_transfer}
                              alt="无转移"
                            />
                            <div className="village-risk-num">
                              <span>{item.safe.length}</span>
                            </div>
                          </div>
                          <div className="flex-center">
                            <Radio value={`${key}&2`}>
                              <span className="bottomSpan">无转移</span>
                            </Radio>
                          </div>
                        </div>
                      </div>
                    </div>
                    {key === 0 && <div className="divide"></div>}
                  </Fragment>
                );
              }
            })}
          </Radio.Group>
        </div>
      </>
      <>
        {/* 实时警情 */}
        <div className="realtime-alarm">
          <div className="common-header-outer">
            <PanelHeader title={'实时警情'} />
          </div>
          <div className="realtime-alarm-content bg-content-area-alpha">
            <div
              className={[
                'alarm-item',
                alarmInfo.rainAlarms.length > 0 ? 'alarm-item_selected' : ''
              ].join(' ')}
              // onClick={() => handleClickRealTimeAlarm('RAINFALL_STATION')}
            >
              <div className="alarmIcon">
                <span className="font-number">
                  {alarmInfo.rainAlarms.length}
                </span>
                <img src={IMG_PATH.icon.rainWarn} alt="雨量预警" />
                <p>雨量预警</p>
              </div>
            </div>
            <div
              className={[
                'alarm-item',
                alarmInfo.reservoirAlarms.length > 0
                  ? 'alarm-item_selected'
                  : ''
              ].join(' ')}
              // onClick={() => {
              //   handleClickRealTimeAlarm('GAUGING_STATION_RESERVOIR');
              // }}
            >
              <div className="alarmIcon">
                <span className="font-number">
                  {alarmInfo.reservoirAlarms.length}
                </span>
                <img src={IMG_PATH.icon.gaugingWarn} alt="水位预警" />
                <p>水位预警</p>
              </div>
            </div>
            <div
              className={[
                'alarm-item',
                alarmInfo.riverAlarms.length > 0 ? 'alarm-item_selected' : ''
              ].join(' ')}
              // onClick={() => {
              //   handleClickRealTimeAlarm('GAUGING_STATION_RIVER');
              // }}
            >
              <div className="alarmIcon">
                <span className="font-number">
                  {alarmInfo.riverAlarms.length}
                </span>
                <img src={IMG_PATH.icon.riverWarn} alt="流量预警" />
                <p>流量预警</p>
              </div>
            </div>
          </div>
        </div>
      </>
      <VideoMonitor
        handleEnLarge={handleEnLarge}
        handleCarouselChange={handleCarouselChange}
        handleClickMonitorByIndex={handleClickMonitorByIndex}
        currMonitorInfo={currMonitorInfo}
        monitorBaseInfo={monitorBaseInfo}
        currModal={{ id: '', type: '' }}></VideoMonitor>
    </LeftWrapper>
  );
});

const LeftWrapper = styled.div`
  /* 实时警情 */
  .realtime-alarm {
    margin-top: 20rem;
    .realtime-alarm-content {
      height: 152rem;
      border-radius: 0px 0px 4rem 4rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 16rem 44rem;

      .alarm-item {
        width: 80rem;
        cursor: pointer;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .alarmIcon {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          width: 80rem;

          img {
            /* margin: 12rem 0 8rem 0; */
            width: 59rem;
            height: 59rem;
          }
        }
        p {
          text-align: center;
          font-family: AlibabaPuHuiTiM;
          font-size: 14rem;
          color: #ffffff;
          margin-bottom: 15rem;
          line-height: 48rem;
          span {
            font-size: 20rem;
            text-align: right;
            margin-right: 10rem;
          }
        }
        p:nth-last-child(1) {
          margin: 0;
          line-height: 20rem;
        }
        position: relative;
        .selected-item {
          width: 70%;
          height: 9rem;
          position: absolute;
          bottom: 5rem;
          background: linear-gradient(
            180deg,
            rgba(255, 77, 86, 0) 0%,
            rgba(255, 77, 86, 0.5) 100%
          );
        }
      }
      .alarm-item:hover {
        background: rgba(255, 255, 255, 0.16);
        border-radius: 2px;
      }
      .alarm-item_selected {
        p,
        span {
          color: #ff5e5e !important;
        }
      }
    }
  }
  .fxyj-left-content {
    .custom-radio-group {
      width: 100%;
    }
    div {
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
      span {
        font-family: DIN-BlackItalic;
        font-size: 32rem;
        color: #ffffff;
        line-height: 39rem;
      }
    }
    width: 420rem;
    /* min-height: 922rem; */
    padding: 10rem 20rem 20rem 20rem;
    background-image: linear-gradient(
      180deg,
      rgba(0, 13, 17, 0.45) 0%,
      rgba(40, 49, 53, 0.9) 100%
    );
    border-radius: 0rem 0rem 4rem 4rem;
    .sub-title {
      width: 100%;
      height: 40rem;
      text-align: center;
      background-image: linear-gradient(
        180deg,
        rgba(0, 5, 17, 0.5) 0%,
        #282c35 100%
      );
      border: 1rem solid rgba(151, 151, 151, 1);
      border-radius: 20rem;
      font-size: 24rem;
      margin-bottom: 10rem;
    }
    .sub-content {
      .rainfall {
        font-size: 24rem;
        text-align: center;
        margin-bottom: 10rem;
      }
    }
    .topTime {
      font-family: MicrosoftYaHei;
      font-size: 16rem;
      color: #ffffff;
      line-height: 20rem;
      font-weight: 400;
      margin-bottom: 20rem;
    }
    .divide {
      width: 100%;
      border-bottom: 1rem dashed rgba(151, 151, 151, 1);
      margin: 15rem 0;
    }
    .timeTitle {
      margin-bottom: 16rem;
      font-family: MicrosoftYaHei-Bold;
      font-size: 16rem;
      color: #ffffff;
      line-height: 20rem;
      font-weight: 700;
      display: flex;
      flex-direction: row;
      align-items: center;
      .titleIcon {
        background: #3cdcff;
        border-radius: 1px;
        height: 16rem;
        width: 4rem;
        margin-right: 8rem;
      }
    }
    .ant-radio-wrapper {
      margin: 0rem;
      padding: 0rem;
      span {
        padding: 0rem;
        margin: 0rem;
      }
      .ant-radio {
        height: 18rem;
        line-height: 18rem;
        margin-right: 5rem;
      }
    }
    .ant-radio-inner {
      background-color: rgba(1, 1, 1, 0);
      width: 12rem;
      height: 12rem;
    }
    .ant-radio-wrapper:hover .ant-radio,
    .ant-radio:hover .ant-radio-inner,
    .ant-radio-input:focus + .ant-radio-inner {
      border-color: #fff;
    }
    .ant-radio-checked .ant-radio-inner {
      border-color: #fff;
      background: rgba(1, 1, 1, 0);
    }
    .ant-radio-checked .ant-radio-inner::after {
      background-color: #fff;
    }
    .ant-radio-checked::after {
      border: 1rem solid #fff !important;
    }
  }
  .village-radio-select-outer {
    transition: all 200ms;
    /* width: 170rem;
    height: 124rem; */
    width: 120rem;
    height: 122rem;
    padding: 15rem;
    background: rgba(149, 174, 255, 0.2);
    border-radius: 2rem;
    cursor: pointer;
    .select-top {
      display: flex;
      justify-content: space-between;
      img {
        width: 52rem;
        height: 52rem;
        margin-right: 15rem;
      }
      .village-risk-num {
        span {
          font-size: 32rem;
          margin-right: 5rem;
        }
      }
    }
    .flex-center {
      .bottomSpan {
        font-size: 18rem;
        color: #ffffff;
        line-height: 18rem;
      }
      font-size: 18rem;
    }
  }
  .village-radio-select-outer:hover {
    background-color: #1e90ff90;
    box-shadow: -2rem 5rem #888888;
  }
  .village-radio-selected,
  .village-radio-selected:hover {
    background-color: #1e90ff90;
    box-shadow: unset;
  }
`;

export { Left };
