import { Fragment, useEffect, useRef } from 'react';
import { useSafeState, useMount } from 'ahooks';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  RightOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { PanelHeader, TextHeader } from '@/components/Header';
import { TableCssCom } from '@/components/TableCssCom';
import { ShowServer } from '@/service/show';
import { spliceArrBySize } from '@/utils';
import { IRequestTimeProp, useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { MonitorServer } from '@/service';
import { MAPBOX_DEFAULT_CONFIG } from '@/components/Map';
import { STATUS_COLOR_MAP } from '../const';
import { DownloadBtn } from './DownloadBtn';
import { VideoMonitor } from '../components/VideoMonitor';
const SLYZTLeftCom = observer(() => {
  const SLYZTStore = useStore();
  // 所有雨量站数据
  const [allRainFallStation, setAllRainFallStation] = useSafeState<
    IRainfallStationItem[][]
  >([]);
  const [alarmInfo, setAlarmInfo] = useSafeState<IResultRealAlarm>({
    rainAlarms: [],
    reservoirAlarms: [],
    riverAlarms: []
  });

  // 雨情统计数据
  const [faceRain, setFaceRain] = useSafeState();
  /**
   * 获取实时警情数据
   * @param param
   */
  const getRealAlarmData = async (param: IRequestTimeProp) => {
    const data = await ShowServer.realAlarm.info(param);
    // console.info('获取实时警情数据', data);
    setAlarmInfo(data);
    SLYZTStore.reservoirOverflow.small.num = data.reservoirAlarms.filter(
      item => {
        return item.reservoirType == 5;
      }
    ).length;
    SLYZTStore.reservoirOverflow.middle.num = data.reservoirAlarms.filter(
      item => {
        return item.reservoirType == 4;
      }
    ).length;
  };
  /**
   * 获取雨情统计数据
   * @param param
   */
  const getRainStatistic = async (param: IRequestTimeProp) => {
    const data = await ShowServer.statistic.rain(param);
    setFaceRain(data.faceRain);
  };
  /**
   * 获取所有雨量站数据
   * @param param
   */
  const getAllRainStation = async (param: IRequestTimeProp) => {
    const data = await ShowServer.rainfallStation.list(param);
    // console.log('统计数据 - 雨情统计数据', data);
    const newData = spliceArrBySize(data, 5);
    setAllRainFallStation(newData);
  };

  useMount(() => {
    getRealAlarmData(SLYZTStore.requestTime); // 实时警情
    getRainStatistic(SLYZTStore.requestTime); // 雨量统计
    getAllRainStation(SLYZTStore.requestTime); // 所有雨量站
    getAllMonitorBaseInfo(); // 所有监控点位数据
  });

  /**
   * 放大视频监控弹窗
   */
  const handleEnLarge = () => {
    SLYZTStore.currModal = {
      id: currMonitorInfo?.id,
      type: 'MONITOR_STATION'
    };
    SLYZTStore.isJustCssActive_bottomLayer = true;
    SLYZTStore.selectBottomMenus = ['MONITOR_STATION'];
    // 恢复至默认视角
    SLYZTStore.handleMapFlyByClick(
      MAPBOX_DEFAULT_CONFIG.center[0],
      MAPBOX_DEFAULT_CONFIG.center[1],
      currMonitorInfo?.id,
      'MONITOR_STATION',
      false
    );
  };

  const ref = useRef<CarouselRef | null>(null);

  const [monitorBaseInfo, setMonitorBaseInfo] = useSafeState<monitorBaseInfo[]>(
    []
  );
  const [currMonitorInfo, setCurrMonitorInfo] = useSafeState<monitorBaseInfo>();

  /**
   * 获取所有视频监控的基本信息
   */
  const getAllMonitorBaseInfo = async () => {
    const data = await MonitorServer.getPictures();
    // console.log('视频监控 - 所有图片相关数据', data);
    setMonitorBaseInfo(data.pictures);
    setCurrMonitorInfo(data.pictures[0]);
  };

  const handleCarouselChange = (currIndex: number) => {
    setCurrMonitorInfo(monitorBaseInfo[currIndex]);
  };

  const handleClickMonitorByIndex = () => {
    SLYZTStore.currModal = {
      id: currMonitorInfo?.id,
      type: 'MONITOR_STATION'
    };
  };

  /**
   * 处理点击实时警情
   */
  const handleClickRealTimeAlarm = (e: string) => {
    switch (e) {
      case 'RAINFALL_STATION':
        if (alarmInfo.rainAlarms.length > 0) {
          SLYZTStore.isJustCssActive_bottomLayer = true;
          SLYZTStore.selectBottomMenus = ['RAINFALL_STATION'];
          let currPoint = alarmInfo.rainAlarms[0];
          SLYZTStore.handleMapFlyByClick(
            currPoint.longitude,
            currPoint.latitude,
            undefined,
            'RAINFALL_STATION',
            true
          );
        }
        break;
      case 'GAUGING_STATION_RIVER':
        if (alarmInfo.riverAlarms.length > 0) {
          SLYZTStore.isJustCssActive_bottomLayer = true;
          SLYZTStore.selectBottomMenus = ['GAUGING_STATION'];
          let currPoint = alarmInfo.riverAlarms[0];
          SLYZTStore.handleMapFlyByClick(
            currPoint.longitude,
            currPoint.latitude,
            undefined,
            'GAUGING_STATION',
            true
          );
        }
        break;
      case 'GAUGING_STATION_RESERVOIR':
        if (alarmInfo.reservoirAlarms.length > 0) {
          SLYZTStore.isJustCssActive_bottomLayer = true;
          SLYZTStore.selectBottomMenus = ['GAUGING_STATION'];
          let currPoint = alarmInfo.reservoirAlarms[0];
          SLYZTStore.handleMapFlyByClick(
            currPoint.longitude,
            currPoint.latitude,
            undefined,
            'GAUGING_STATION',
            true
          );
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleClickRealTimeAlarm(SLYZTStore.currLayerShow);
  }, [SLYZTStore.currLayerShow]);

  return (
    <Fragment>
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
            onClick={() => handleClickRealTimeAlarm('RAINFALL_STATION')}>
            <div>
              <p>
                <span className="font-number">
                  {alarmInfo.rainAlarms.length}
                </span>
                个
              </p>
              <p>雨情预警</p>
            </div>
            {/* {selectedItem == 'RAINFALL_STATION' && (
              <div className="selected-item"></div>
            )} */}
          </div>
          <div
            className={[
              'alarm-item',
              alarmInfo.reservoirAlarms.length > 0 ? 'alarm-item_selected' : ''
            ].join(' ')}
            onClick={() => {
              handleClickRealTimeAlarm('GAUGING_STATION_RESERVOIR');
            }}>
            <div>
              <p>
                <span className="font-number">
                  {alarmInfo.reservoirAlarms.length}
                </span>
                个
              </p>
              <p>水库超限</p>
            </div>
          </div>
          <div
            className={[
              'alarm-item',
              alarmInfo.riverAlarms.length > 0 ? 'alarm-item_selected' : ''
            ].join(' ')}
            onClick={() => {
              handleClickRealTimeAlarm('GAUGING_STATION_RIVER');
            }}>
            <div>
              <p>
                <span className="font-number">
                  {alarmInfo.riverAlarms.length}
                </span>
                个
              </p>
              <p>河道超警</p>
            </div>
          </div>
        </div>
      </div>
      {/* 雨情统计 */}
      <div className="rainfall-static">
        <div className="common-header-outer">
          <PanelHeader
            title={'雨情统计'}
            OperationFc={<DownloadBtn case_type="雨情统计" />}
          />
        </div>
        <div className="rainfall-static-content bg-content-area-alpha">
          <p className="rainfall-static-desc">
            武强溪近24小时面雨量：
            <span className="font-number">{Number(faceRain)?.toFixed(1)} </span>
            mm
          </p>
          <TextHeader title="雨量站" fontSize="18rem" lineHeight="50rem" />
          <div className="table-outer">
            <TableCssCom
              TitleList={[
                <Fragment>测站名称</Fragment>,
                <Fragment>近24小时雨量</Fragment>
              ]}
              typeList={['name', 'rain']}
              valList={allRainFallStation}
              unit="mm"
              carouselPageHeight="250rem"
              colorInfoObj={STATUS_COLOR_MAP}
              handleItemClick={async item => {
                SLYZTStore.isJustCssActive_bottomLayer = true;
                SLYZTStore.selectBottomMenus = ['RAINFALL_STATION'];
                SLYZTStore.handleMapFlyByClick(
                  item.longitude,
                  item.latitude,
                  undefined,
                  'RAINFALL_STATION',
                  true
                );
              }}
            />
          </div>
        </div>
      </div>
      {/* 视频监控 */}
      <VideoMonitor
        handleEnLarge={handleEnLarge}
        handleCarouselChange={handleCarouselChange}
        handleClickMonitorByIndex={handleClickMonitorByIndex}
        currMonitorInfo={currMonitorInfo}
        monitorBaseInfo={monitorBaseInfo}
        currModal={SLYZTStore.currModal}></VideoMonitor>
      <div className="video-monitor" style={{ display: 'none' }}>
        <div className="common-header-outer">
          <PanelHeader
            title={'视频监控'}
            // OperationFc={<OperationCom handleEnLarge={handleEnLarge} />}
          />
        </div>
        <div className="video-monitor-content bg-content-area-alpha">
          <div className="flex-between">
            <p>{currMonitorInfo?.title}</p>
            {/* <div
              className="view-all-btn flex-center"
              onClick={handleEnLarge}>{`查看全部 >>`}</div> */}
          </div>
          <div className="cus-carousel-outer">
            {monitorBaseInfo.length > 0 ? (
              <Fragment>
                <Carousel
                  dots={false}
                  ref={ref}
                  afterChange={handleCarouselChange}>
                  {monitorBaseInfo.map(item => {
                    return (
                      <div key={item.id} onClick={handleClickMonitorByIndex}>
                        <img src={item.path} alt={item.title} />
                      </div>
                    );
                  })}
                </Carousel>
                <div
                  className="cur-carousel-operation cur-carousel-operation-left flex-center"
                  onClick={() => {
                    ref.current?.prev();
                  }}>
                  <LeftOutlined />
                </div>
                <div
                  className="cur-carousel-operation cur-carousel-operation-right flex-center"
                  onClick={() => {
                    ref.current?.next();
                  }}>
                  <RightOutlined />
                </div>
              </Fragment>
            ) : (
              <>暂无数据</>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
});

// interface OperationComProp {
//   handleEnLarge: Function;
// }
// /**
//  * 标题栏目的右上角操作栏目
//  * @returns
//  */
// const OperationCom = observer((props: OperationComProp) => {
//   const SLYZTStore = useStore();
//   return (
//     <div
//       style={{
//         position: 'absolute',
//         right: '20rem',
//         cursor: 'pointer',
//         fontSize: '30rem'
//       }}
//       onClick={() => {
//         props.handleEnLarge();
//       }}>
//       {SLYZTStore.currModal?.type == 'MONITOR_STATION' ? (
//         <FullscreenExitOutlined />
//       ) : (
//         <FullscreenOutlined />
//       )}
//     </div>
//   );
// });

export { SLYZTLeftCom };
