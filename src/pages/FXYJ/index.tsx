/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import {
  CenterBottom,
  CenterContentLoading,
  CenterModalCom,
  LeftCom,
  RightCom
} from '@/components/LayoutsCom';
import { LegendComLeft } from '@/components/LegendCom';
import { LegendComRight } from '@/components/LegendCom';
import { GlobalLayoutWrapper } from '@/style';
import { FXYJWrapper } from './style';
import { useMount, useSafeState, useUnmount, useUpdateEffect } from 'ahooks';
import { Left, Right } from './components';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import GlobalStore from '@/store';
import { Provider, useStore } from './store/index';
import { AlarmServer, ShenjiServer } from '@/service';
import { IMG_PATH, ShowModeProjectId, getForecastTime } from '@/utils/const';
import { ShelterModal } from './components/ShelterModal';
import { WarehouseModal } from './components/WarehouseModal';
import moment from 'moment';
import { Radio, Space } from 'antd';
import { history } from 'umi';
import { LEGEND_MAP } from './util';
import { MonitorServer } from '@/service';
import { ShowServer } from '@/service/show';
import { CenterModalComContent } from './components/CenterModalCom/CenterModalComContent';
import { ICON_MAP } from './const';
const Component = observer(() => {
  const store = useStore();
  useUnmount(() => {
    store.dispose();
  });
  useMount(() => {
    let pathName = history.location.pathname.split('/')[1];
    ShenjiServer.sendAuditLog(pathName);
  });
  /**
   * 查询所有避灾安置场所列表
   */
  const getShelterData = async () => {
    const { list } = await AlarmServer.shelter.list();
    store.shelterData.loading = true;
    store.shelterData.data = list.map(item => {
      return {
        id: item.id,
        longitude: item.longitude,
        latitude: item.latitude,
        type: 'shelter',
        icon: IMG_PATH.markerIcon.shelter,
        name: item.name,
        width: 20,
        height: 20,
        nameShowOuterCss: { marginBottom: 130 + 'rem' },
        nameShowCss: { marginBottom: 130 + 'rem' }
      };
    });
    store.shelterData.loading = false;
  };

  /**
   * 查询仓库点列表
   */
  const getWareHouseData = async () => {
    store.wareHouseData.loading = true;
    const { list } = await AlarmServer.warehouse.list();
    store.wareHouseData.data = list.map(item => {
      return {
        id: item.id,
        longitude: item.longitude,
        latitude: item.latitude,
        type: 'warehouse',
        icon: IMG_PATH.markerIcon.warehouse,
        name: item.name,
        width: 20,
        height: 20,
        nameShowOuterCss: { marginBottom: 70 + 'rem' },
        nameShowCss: { marginBottom: 70 + 'rem' },
        popUpCss: {}
      };
    });
    store.wareHouseData.loading = false;
  };
  // 查询监控列表
  const getMonitorData = async () => {
    store.monitorData.loading = true;
    const data = await MonitorServer.getAllCameras();
    store.monitorData.data = data.cameras.map(item => {
      return {
        id: item.cameraId,
        longitude: item.longitude,
        latitude: item.latitude,
        type: 'monitor',
        icon: IMG_PATH.markerIcon.MONITOR_STATION,
        name: item.districtName,
        width: 20,
        height: 20,
        nameShowOuterCss: { marginBottom: 70 + 'rem' },
        nameShowCss: { marginBottom: 70 + 'rem' },
        popUpCss: {}
      };
    });
    store.monitorData.loading = false;
  };
  //查询雨量站的数据
  const getRainStation = async () => {
    const rainfallData = await ShowServer.rainfallStation.list(
      store.requestTime
    );
    store.rainStationData.data = rainfallData.map(item => {
      return {
        id: item.stationId,
        longitude: item.longitude,
        latitude: item.latitude,
        type: 'RAINFALL_STATION',
        icon: ICON_MAP['RAINFALL_STATION'][item.status],
        risk: item.status,
        data: '雨量：' + Number(item.rain).toFixed(1) + ' mm',
        name: item.name,
        width: 20,
        height: 20,
        nameShowOuterCss: { marginBottom: 70 + 'rem' },
        nameShowCss: { marginBottom: 70 + 'rem' },
        popUpCss: {}
      };
    });
    store.rainStationData.loading = false;
  };
  //水位站
  const getGaugingStationData = async () => {
    const gaugingData = await ShowServer.gaugingStation.list();
    // 水位站 - 河道站
    const gauging_river = gaugingData.filter(item => {
      return item.type === 'ZZ';
    });
    // 水位站 - 水库站
    const gauging_reservoir = gaugingData.filter(item => {
      return item.type === 'RR';
    });
    store.gauging_riverData.data = gauging_river.map(item => {
      return {
        id: item.stationId,
        longitude: item.longitude,
        latitude: item.latitude,
        type: 'GAUGING_STATION_RIVER',
        icon: ICON_MAP['GAUGING_STATION_RIVER'][item.status],
        risk: item.status,
        data: '水位：' + Number(item.waterLevel).toFixed(2) + ' m',
        name: item.name,
        width: 20,
        height: 20,
        nameShowOuterCss: { marginBottom: 70 + 'rem' },
        nameShowCss: { marginBottom: 70 + 'rem' },
        popUpCss: {}
      };
    });
    store.gauging_reservoirData.data = gauging_reservoir.map(item => {
      return {
        id: item.stationId,
        longitude: item.longitude,
        latitude: item.latitude,
        type: 'GAUGING_STATION_RESERVOIR',
        icon: ICON_MAP['GAUGING_STATION_RESERVOIR'][item.status],
        risk: item.status,
        data: '水位：' + Number(item.waterLevel).toFixed(2) + ' m',
        name: item.name,
        width: 20,
        height: 20,
        nameShowOuterCss: { marginBottom: 70 + 'rem' },
        nameShowCss: { marginBottom: 70 + 'rem' },
        popUpCss: {}
      };
    });
    store.gauging_riverData.loading = false;
    store.gauging_reservoirData.loading = false;
  };
  //河道流量站
  const getFlowStationData = async () => {
    const { flowStations } = await ShowServer.flowStation.listOfAll();
    store.flowStationData.data = flowStations.map(item => {
      return {
        id: item.stationId,
        longitude: item.longitude,
        latitude: item.latitude,
        type: 'FLOW_STATION',
        icon: IMG_PATH.markerIcon.FLOW_STATION,
        risk: 0, //流量站待确定是否有风险等级
        name: item.name,
        width: 20,
        height: 20,
        nameShowOuterCss: { marginBottom: 70 + 'rem' },
        nameShowCss: { marginBottom: 70 + 'rem' },
        popUpCss: {}
      };
    });
    store.flowStationData.loading = false;
  };
  const [mapLoading, setMapLoading] = useSafeState<boolean>(true);
  useEffect(() => {
    if (!GlobalStore.map) return;
    GlobalStore.map_resetDefaultView();
    setMapLoading(false);
    getShelterData();
    getWareHouseData();
    getMonitorData();
    getRainStation();
    getGaugingStationData();
    getFlowStationData();
    store.getVillageVertex();
  }, [GlobalStore.map]);

  useUpdateEffect(() => {
    store.modalData.type != '' && (store.modalData.isVisible = true);
    if (store.modalData.type === 'shelter') {
      store.modalData.content = <ShelterModal id={store.modalData.id || -1} />;
    }
    if (store.modalData.type === 'warehouse') {
      store.modalData.content = (
        <WarehouseModal id={store.modalData.id || -1} />
      );
    }
    if (store.modalData.type === 'monitor') {
      //视频监控弹窗
      store.modalData.content = <CenterModalComContent />;
    }
    if (store.modalData.type === 'RAINFALL_STATION') {
      //雨量站弹窗
      store.modalData.content = <CenterModalComContent />;
    }
    if (
      store.modalData.type === 'GAUGING_STATION_RIVER' ||
      store.modalData.type === 'GAUGING_STATION_RESERVOIR'
    ) {
      //水位站
      store.modalData.content = <CenterModalComContent />;
    }
    if (store.modalData.type === 'FLOW_STATION') {
      //流量站
      store.modalData.content = <CenterModalComContent />;
    }
  }, [store.modalData.type]);
  return (
    <FXYJWrapper>
      <GlobalLayoutWrapper bottomChildren={null}>
        <LeftCom
          children={<Left />}
          isHideLeft={mapLoading}
          // legendCom={
          //   LEGEND_MAP[store.currLayer[0]]?.title && !store.modalData.id ? (
          //     <LegendComLeft title={LEGEND_MAP[store.currLayer[0]]?.title} />
          //   ) : null
          // }
          legendCom={
            LEGEND_MAP[store.currLayer[0]]?.title ? (
              <LegendComLeft title={LEGEND_MAP[store.currLayer[0]]?.title} />
            ) : null
          }
        />
        {(mapLoading || store.jsonLoading) && (
          <CenterContentLoading
            title={store.jsonLoading ? '结果加载中...' : '地图组件加载中...'}
          />
        )}
        <RightCom
          children={<Right />}
          legendCom={
            !store.modalData.isVisible ? (
              <>
                <div className="color-select-outer choice-forecastTime-outer">
                  <Radio.Group
                    onChange={async e => {
                      store.currSimAnimation?.show(false);
                      store.selectedForecastTime = e.target.value;
                      store.currProjectObj.forecastTime = e.target.value;
                      await store.loadResult();
                      let start = moment(),
                        end = moment(),
                        projectId = 0;
                      if (GlobalStore.isShowMode) {
                        projectId = ShowModeProjectId;
                        start = moment('2019-07-18 15:00:00');
                        end = moment('2019-07-18 15:00:00').add(
                          'h',
                          e.target.value
                        );
                      } else {
                        let { startTime, endTime } = getForecastTime(
                          store.time_loaded,
                          store.selectedForecastTime,
                          'h'
                        );
                        start = startTime;
                        end = endTime;
                      }
                      store.currProjectObj.caseId = projectId;
                      store.currProjectObj.startTime = start;
                      store.currProjectObj.endTime = end;
                      store.setCurrLayerId(store.currLayerId);
                      store.currSimAnimation?.show(true);
                    }}
                    value={store.selectedForecastTime}>
                    <Space direction="vertical">
                      <Radio key={1} value={1}>
                        近1小时
                      </Radio>
                      <Radio key={3} value={3}>
                        近3小时
                      </Radio>
                      {/* <Radio key={6} value={6}>
                        未来6小时
                      </Radio> */}
                    </Space>
                  </Radio.Group>
                </div>
                <LegendComRight
                  hideAnimateRes
                  currType={store.currLayerId}
                  handleLayersChange={store.setCurrLayerId}
                  bottom="0rem"
                />
              </>
            ) : null
          }
          isExpand={store.isExpandRight}
          isHideAll={store.isRightHideAll}
        />
        <CenterBottom
          layerList={[
            { key: 'shelter', title: '避灾安置点' },
            { key: 'warehouse', title: '防汛物资仓库' },
            { key: 'village', title: '重点防洪对象' },
            { key: 'MONITOR_STATION', title: '视频监控' },
            { key: 'RAINFALL_STATION', title: '雨量站' },
            { key: 'GAUGING_STATION', title: '水位站' },
            { key: 'FLOW_STATION', title: '河道流量站' }
          ]}
          isShowProcess={false}
          selectedMenu={store.currLayer}
          loadingStatusObj={{
            village: 'success',
            shelter: store.shelterData.loading ? 'loading' : 'success',
            warehouse: store.wareHouseData.loading ? 'loading' : 'success',
            MONITOR_STATION: store.monitorData.loading ? 'loading' : 'success',
            RAINFALL_STATION: store.rainStationData.loading
              ? 'loading'
              : 'success',
            GAUGING_STATION:
              store.gauging_riverData.loading &&
              store.gauging_reservoirData.loading
                ? 'loading'
                : 'success',
            FLOW_STATION: store.flowStationData.loading ? 'loading' : 'success'
          }}
          // isMutex={false}
          isMutex={false}
          handleActiveChange={(e, type) => {
            let activeTabs: string[] = [];
            //这几个tab是单选
            let mutexList = [
              'MONITOR_STATION',
              'RAINFALL_STATION',
              'GAUGING_STATION',
              'FLOW_STATION'
            ];
            if (mutexList.includes(type)) {
              //视频监控 雨量站 水位站 河道流量站 互斥选择
              activeTabs = [type];
            } else {
              //避灾安置点 防汛物资仓库 重点防洪对象 可多选且过滤掉mutexList
              activeTabs = e.filter(item => !mutexList.includes(item));
            }
            store.handleLayerChange(activeTabs);
          }}
          type={'warp'}
          number={3}
        />
        {store.modalData.type == 'shelter' ||
        store.modalData.type == 'warehouse' ||
        store.modalData.type === 'village' ? (
          <CenterModalCom
            style={
              (store.modalData.style &&
                JSON.parse(JSON.stringify(store.modalData.style))) ||
              {}
            }
            type={store.modalData.type}
            TitleDesc={<>{store.modalData.title} </>}
            TitleRightOpt={null}
            ContentDiv={store.modalData.content || <></>}
            open={store.modalData.isVisible ? Math.random() : undefined}
            size="large"
            closeModal={() => {
              store.modalData.type = '';
              store.modalData.isVisible = false;
              (store.modalData.title = ''), (store.modalData.style = null);
            }}
            loading={store.modalData.loading}
          />
        ) : (
          <>
            <CenterModalCom
              style={
                (store.modalData.style &&
                  JSON.parse(JSON.stringify(store.modalData.style))) ||
                {}
              }
              TitleRightOpt={null}
              ContentDiv={store.modalData.content || <></>}
              open={store.modalData.isVisible ? Math.random() : undefined}
              size={'large'}
              closeModal={() => {
                store.modalData.type = '';
                store.modalData.isVisible = false;
                (store.modalData.title = ''), (store.modalData.style = null);
              }}
              loading={store.modalData.loading}
            />
          </>
        )}
      </GlobalLayoutWrapper>
    </FXYJWrapper>
  );
});

export default () => {
  return (
    <Provider>
      <Component />
    </Provider>
  );
};
