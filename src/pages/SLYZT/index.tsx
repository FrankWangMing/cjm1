import { SLYZTWrapper } from './style';
import { useSafeState, useUnmount, useUpdateEffect } from 'ahooks';
import { GlobalLayoutWrapper } from '@/style';
import {
  CenterBottom,
  CenterContentLoading,
  CenterModalCom,
  CenterTop,
  LeftCom,
  RightCom,
  SideDecoratorLine
} from '@/components/LayoutsCom';
import {
  SLYZTLeftCom,
  SLYZTRightCom,
  CenterModalComContent
} from './components';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import GlobalStore from '@/store';
import { ShowServer } from '@/service/show';
import { LAYER_LIST, LEGEND_MAP } from './util';
import { LegendComLeft } from '@/components/LegendCom';
import { Provider, useStore } from './store';
import { message } from 'antd';
import {
  MonitorServer,
  SectionServer,
  ShenjiServer,
  VillageServer
} from '@/service';
import { CurrRiskDesc } from './components/CurrRiskDesc';
import { history } from 'umi';
import { IMarker } from '@/domain/marker';
import { IMG_PATH } from '@/utils/const';
import { SCOPE_LIST } from './const';

const Component = observer(() => {
  const SLYZTStore = useStore();

  const getMarkerDataObj = {
    // 获取 雨量站点位数据
    rainfallData: async () => {
      const rainfallData = await ShowServer.rainfallStation.list(
        SLYZTStore.requestTime
      );
      SLYZTStore.maintainStoreMarkerUtil('RAINFALL_STATION', rainfallData);
    },
    // 获取 水位站点位数据
    gaugingData: async () => {
      const gaugingData = await ShowServer.gaugingStation.list();
      // 水位站 - 河道站
      const gauging_river = gaugingData.filter(item => {
        return item.type === 'ZZ';
      });
      // 水位站 - 水库站
      const gauging_reservoir = gaugingData.filter(item => {
        return item.type === 'RR';
      });
      // 水位站 - 河道站
      SLYZTStore.maintainStoreMarkerUtil(
        'GAUGING_STATION_RIVER',
        gauging_river
      );
      // 水位站 - 水库站
      SLYZTStore.maintainStoreMarkerUtil(
        'GAUGING_STATION_RESERVOIR',
        gauging_reservoir
      );
      SLYZTStore.loadingOfMarkerData['GAUGING_STATION'] = 'success';
    },
    // 获取 水库点位数据
    reservoirData: async () => {
      const reservoirData = await ShowServer.reservoirStation.list();
      SLYZTStore.maintainStoreMarkerUtil('RESERVOIR_STATION', reservoirData);
    },
    // 获取 视频监控点位数据
    monitorData: async () => {
      const monitorData = await MonitorServer.getAllCameras();
      SLYZTStore.maintainStoreMarkerUtil(
        'MONITOR_STATION',
        monitorData.cameras
      );
    },
    // 获取 堤防点位数据
    embankmentData: async () => {
      const embankmentData = await ShowServer.embankmentStation.list();
      SLYZTStore.embankmentData = embankmentData;
      SLYZTStore.maintainStoreMarkerUtil('EMBANKMENT_STATION', embankmentData);
    },
    // 获取 山塘点位数据
    pondsData: async () => {
      const pondsData = await ShowServer.pondStation.list();
      SLYZTStore.maintainStoreMarkerUtil('PONDS_STATION', pondsData);
    },
    // 获取 所有流量站数据
    flowStation: async () => {
      const { flowStations } = await ShowServer.flowStation.listOfAll();
      SLYZTStore.maintainStoreMarkerUtil('FLOW_STATION', flowStations);
    },
    // 获取 重点村落数据
    village: async () => {
      const data = await VillageServer.allBaseList();
      SLYZTStore.maintainStoreMarkerUtil('IMPORTANT_VILLAGE', data);
    }
  };
  // 获取 所有点位数据;
  const getAllMarkerData = async () => {
    getMarkerDataObj.rainfallData(); // 获取雨量站详情
    getMarkerDataObj.gaugingData(); // 获取水位站详情
    getMarkerDataObj.reservoirData(); // 获取水库详情
    getMarkerDataObj.embankmentData(); // 获取堤防详情
    getMarkerDataObj.pondsData(); // 获取山塘详情
    getMarkerDataObj.monitorData(); // 获取监控点位数据详情
    getMarkerDataObj.flowStation(); // 获取所有流量站详情
    getMarkerDataObj.village(); // 获取所有重点村落详情
  };

  /**
   * 恢复默认视角 会关闭弹窗
   */
  useUpdateEffect(() => {
    if (!SLYZTStore.isJustCssActive_bottomLayer) {
      SLYZTStore.currModal.id = undefined;
    }
  }, [GlobalStore.isResetView]);

  /**
   * 获取村庄相关数据
   */
  const getVillageBaseList = async () => {
    let villageBaseInfoList = await VillageServer.allBaseList();
    // 获取村庄的数据存入到全局的Store(GlobalStore)里面
    GlobalStore.villageList = villageBaseInfoList;
  };

  /**
   * 获取所有断面基础信息
   */
  const getSectionBaseList = async () => {
    let sectionBaseInfoList = await SectionServer.listOfLngLat();
    let resList: IMarker[] = [];
    sectionBaseInfoList.map(item => {
      resList.push({
        id: item.id,
        longitude: item.lng,
        latitude: item.lat,
        type: 'section',
        icon: IMG_PATH.overview.blockFace,
        name: item.name,
        hoverStyle:
          'background-image:linear-gradient(180deg, rgba(0,5,17,0.50) 0%, #282C35 100%);',
        width: 120,
        nameShowCss: { marginTop: -80 + 'rem' }
      });
    });
    GlobalStore.sectionBaseList = sectionBaseInfoList;
    GlobalStore.sectionMarkerList = resList;
  };

  /**
   * 获取视频的静态链接
   */
  const setVideoPlatformUrl = async () => {
    const data = await ShowServer.getStaticLink(2);
    GlobalStore.videoPlatformUrl = data.link;
  };
  useEffect(() => {
    let pathName = history.location.pathname.split('/')[1];
    ShenjiServer.sendAuditLog(pathName);
    GlobalStore.setHtmlFontSize(); // 登录接口进来后重新设置一下字体大小设置rem匹配;
    message.destroy();
    SLYZTStore.initStoreData(); // 初始化mobx监听数据
    if (!GlobalStore.map) return;
    GlobalStore.map_resetDefaultView();
    setLoading(false);
    getAllMarkerData();
    getVillageBaseList();
    getSectionBaseList();
    setVideoPlatformUrl();

    // 添加轮廓线和区域
    SCOPE_LIST.forEach(item => {
      handleScopeVisible({
        map: GlobalStore.map!,
        id: item.id,
        isVisible: true,
        source_url: item.url,
        paintLine: item.paintLine,
        paintArea: item.paintArea,
        type: item.type
      });
    });
  }, [GlobalStore.map]);

  /**
   * 添加轮廓线
   * @param map 地图实例
   * @param id 图层id
   * @param source_url 图层url
   * @param paint 样式配置
   */
  const addLineLayer = (
    map: mapboxgl.Map,
    id: string,
    source_url: string | undefined,
    paint: any
  ) => {
    map.addSource(`${id}_SOURCE`, {
      type: 'geojson',
      // @ts-ignore
      data: source_url
    });
    map.addLayer({
      id: id,
      type: 'line',
      source: `${id}_SOURCE`,
      paint: paint
    });
  };
  /**
   * 添加区域
   * @param map 地图实例
   * @param id 图层id
   * @param source_url 图层url
   * @param paint 样式配置
   */
  const addAreaLayer = (
    map: mapboxgl.Map,
    id: string,
    source_url: string | undefined,
    paint: any
  ) => {
    map.addSource(`${id}_SOURCE`, {
      type: 'geojson',
      // @ts-ignore
      data: source_url
    });
    map.addLayer({
      id: id,
      type: 'fill',
      source: `${id}_SOURCE`,
      paint: paint
    });
  };
  /**
   * 控制轮廓线显示或隐藏
   */
  const handleScopeVisible = ({
    map,
    id,
    isVisible,
    source_url,
    paintLine,
    paintArea,
    type
  }: {
    map: mapboxgl.Map;
    id: string;
    isVisible: boolean;
    source_url?: string;
    paintLine?: any;
    paintArea?: any;
    type?: string;
  }) => {
    const currLayer = map.getLayer(id);
    if (!currLayer) {
      type == 'area'
        ? addAreaLayer(map, id, source_url, paintArea)
        : addLineLayer(map, id, source_url, paintLine);
    }
    if (isVisible) {
      map.setLayoutProperty(id, 'visibility', 'visible');
    } else {
      map.setLayoutProperty(id, 'visibility', 'none');
    }
  };

  useUpdateEffect(() => {
    // 地图层级发生变化 重新绘制点位和线段;
    SLYZTStore.handleLayerTypeChange([SLYZTStore.currLayerShow], false, true);
    SCOPE_LIST.forEach(item => {
      if (!GlobalStore.map) return;
      handleScopeVisible({
        map: GlobalStore.map,
        id: item.id,
        isVisible: GlobalStore.currZoom < 13
      });
    });
  }, [GlobalStore.currZoom]);

  useUnmount(() => {
    // 隐藏轮廓线和区域
    SCOPE_LIST.forEach(item => {
      if (!GlobalStore.map) return;
      handleScopeVisible({
        map: GlobalStore.map,
        id: item.id,
        isVisible: false
      });
    });
    SLYZTStore.dispose();
    message.destroy();
  });
  const [loading, setLoading] = useSafeState(true);

  return (
    <SLYZTWrapper>
      <GlobalLayoutWrapper bottomChildren={null}>
        {/* 左侧栏目 */}
        {SLYZTStore.currLayerShow != 'GENERALIZED_GRAPH' && (
          <LeftCom
            children={<SLYZTLeftCom />}
            legendCom={
              LEGEND_MAP[SLYZTStore.currLayerShow]?.title &&
              !SLYZTStore.currModal.id ? (
                <LegendComLeft
                  title={LEGEND_MAP[SLYZTStore.currLayerShow]?.title}
                />
              ) : null
            }
            isHideLeft={false}
            legendComWidth={LEGEND_MAP[SLYZTStore.currLayerShow]?.width}
          />
        )}
        {/* 右侧栏目 */}
        {SLYZTStore.currLayerShow != 'GENERALIZED_GRAPH' && (
          <RightCom children={<SLYZTRightCom />} isExpand={true} />
        )}
        {/* 中间顶部 */}
        <CenterTop children={<CurrRiskDesc />} />
        {loading && <CenterContentLoading title="地图数据加载中..." />}
        {/* 中间栏目 */}
        {SLYZTStore.currLayerShow == 'GENERALIZED_GRAPH' && (
          <div className="modal-bigger">
            <img
              className="modal-content-img"
              src="/images/GENERALIZED_GRAPH1.gif"
              alt="概览图"
              draggable={false}
            />
            <img
              onClick={() => {
                SLYZTStore.selectBottomMenus = ['RAINFALL_STATION'];
                SLYZTStore.isJustCssActive_bottomLayer = false;
                SLYZTStore.handleLayerTypeChange(['RAINFALL_STATION'], true);
              }}
              className="modal-close-icon"
              src="/images/icons/close.png"
              alt=""
            />
          </div>
        )}
        {/* 中间底部，图层控制样式 */}
        <CenterBottom
          layerList={LAYER_LIST}
          isShowProcess={false}
          selectedMenu={SLYZTStore.selectBottomMenus}
          loadingStatusObj={{
            GENERALIZED_GRAPH: 'success',
            RAINFALL_STATION: SLYZTStore.loadingOfMarkerData.RAINFALL_STATION,
            IMPORTANT_VILLAGE: SLYZTStore.loadingOfMarkerData.IMPORTANT_VILLAGE,
            GAUGING_STATION: SLYZTStore.loadingOfMarkerData.GAUGING_STATION,
            FLOW_STATION: SLYZTStore.loadingOfMarkerData.FLOW_STATION,
            MONITOR_STATION: SLYZTStore.loadingOfMarkerData.MONITOR_STATION,
            RESERVOIR_STATION: SLYZTStore.loadingOfMarkerData.RESERVOIR_STATION,
            EMBANKMENT_STATION:
              SLYZTStore.loadingOfMarkerData.EMBANKMENT_STATION,
            PONDS_STATION: SLYZTStore.loadingOfMarkerData.PONDS_STATION
          }}
          disable={
            SLYZTStore.loadingOfMarkerData.RAINFALL_STATION == 'loading' ||
            SLYZTStore.loadingOfMarkerData.GAUGING_STATION == 'loading' ||
            SLYZTStore.loadingOfMarkerData.FLOW_STATION == 'loading' ||
            SLYZTStore.loadingOfMarkerData.MONITOR_STATION == 'loading' ||
            SLYZTStore.loadingOfMarkerData.RESERVOIR_STATION == 'loading' ||
            SLYZTStore.loadingOfMarkerData.EMBANKMENT_STATION == 'loading' ||
            SLYZTStore.loadingOfMarkerData.PONDS_STATION == 'loading'
          }
          isMutex={true}
          handleActiveChange={e => {
            SLYZTStore.handleLayerTypeChange(e);
          }}
          isJustCssSelected={SLYZTStore.isJustCssActive_bottomLayer}
        />
        {SLYZTStore.currModal.id != undefined &&
          SLYZTStore.currLayerShow != 'GENERALIZED_GRAPH' && (
            <CenterModalCom
              ContentDiv={<CenterModalComContent />}
              open={SLYZTStore.currModal.type}
              closeModal={() => {
                SLYZTStore.currModal = {
                  id: undefined,
                  type: undefined
                };
              }}
              size={
                SLYZTStore.currModal.type == 'EMBANKMENT_STATION' ||
                SLYZTStore.currModal.type == 'IMPORTANT_VILLAGE'
                  ? 'small'
                  : SLYZTStore.currModal.type == 'PONDS_STATION'
                  ? 'middle'
                  : 'large'
              }
              TitleRightOpt={null}
            />
          )}
        {/* 周边的背景颜色条 */}
        <SideDecoratorLine />
      </GlobalLayoutWrapper>
    </SLYZTWrapper>
  );
});

export default () => {
  return (
    <Provider>
      <Component />
    </Provider>
  );
};
