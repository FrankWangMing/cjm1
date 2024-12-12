/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 */
import { MarkerObj } from '@/components/Map';
import { IMarker } from '@/domain/marker';
import { MomentFormatStr } from '@/utils/const';
import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';
import moment from 'moment';
import GlobalStore from '@/store';
import {
  formatMarkerData,
  removeMapLineLayer,
  getCreekData,
  MapOfLine
} from '../util';

export interface IRequestTimeProp {
  startTime: string;
  endTime: string;
}

/**
 * @param GENERALIZED_GRAPH 概化图
 * @param RAINFALL_STATION 雨量站
 * @param GAUGING_STATION_RIVER 水位站 - 河道站
 * @param GAUGING_STATION_RESERVOIR 水位站 - 水库站
 * @param FLOW_STATION 流量站
 * @param MONITOR_STATION 视频监控
 * @param RESERVOIR_STATION 水库站
 * @param EMBANKMENT_STATION 堤坝
 * @param PONDS_STATION 山塘
 */
type ModalType =
  | 'GENERALIZED_GRAPH'
  | 'RAINFALL_STATION'
  | undefined
  | 'GAUGING_STATION'
  | 'GAUGING_STATION_RIVER'
  | 'GAUGING_STATION_RESERVOIR'
  | 'FLOW_STATION'
  | 'MONITOR_STATION'
  | 'RESERVOIR_STATION'
  | 'EMBANKMENT_STATION'
  | 'PONDS_STATION'
  | 'IMPORTANT_VILLAGE';

export function useModel() {
  const store = useLocalStore(
    (): {
      /**
       * 当前对应的图层
       */
      currLayerShow: string;
      /**
       * 弹窗对应的数据对象
       */
      currModal: {
        id: number | string | undefined;
        type: ModalType;
      };
      loadingOfMarkerData: {
        RAINFALL_STATION: string;
        IMPORTANT_VILLAGE: string;
        GAUGING_STATION: string;
        FLOW_STATION: string;
        MONITOR_STATION: string;
        RESERVOIR_STATION: string;
        EMBANKMENT_STATION: string;
        PONDS_STATION: string;
      };
      /**
       * 删除地图上的所有点位
       */
      deleteAllMarker: Function;
      /**
       * 初始化赋值操作
       */
      initStoreData: Function;
      /**
       * 默认选中的menu
       */
      selectBottomMenus: string[];
      /**
       * 销毁store中定义的方法
       */
      dispose: Function;
      markerObj: {
        RAINFALL_STATION: IMarker[];
        GAUGING_STATION_RIVER: IMarker[];
        GAUGING_STATION_RESERVOIR: IMarker[];
        FLOW_STATION: IMarker[];
        EMBANKMENT_STATION: IMarker[];
        MONITOR_STATION: IMarker[];
        RESERVOIR_STATION: IMarker[];
        PONDS_STATION: IMarker[];
      } | null;
      /**
       * 请求使用时间paramsTime
       */
      requestTime: IRequestTimeProp;
      /**
       * 打点操作
       */
      addMarker: Function;
      maintainStoreMarkerUtil: Function;
      /**堤防点位数据 */
      embankmentData: IEmbankmentStationItem[];
      /**
       * 堤防之间划线
       */
      drawEmbankmentLine: Function;
      /**
       * 选中的站点类型
       */
      allActiveType: string[];
      /**
       * 图层控制发生变化
       */
      handleLayerTypeChange: Function;
      /**
       * 点击点位地图漂移到该点 & 弹窗数据赋值，id 、type
       */
      handleMapFlyByClick: Function;
      /**
       * 底部导航栏是否只是css样式选中？
       */
      isJustCssActive_bottomLayer: boolean;
      isEnLargeMonitor: number | undefined;
      /**
       * 水库超限情况
       */
      reservoirOverflow: {
        middle: {
          num: number;
        };
        small: {
          num: number;
        };
      };
    } => ({
      allActiveType: [],
      currLayerShow: 'IMPORTANT_VILLAGE',
      currModal: {
        id: undefined,
        type: undefined
      },
      loadingOfMarkerData: {
        RAINFALL_STATION: 'loading',
        IMPORTANT_VILLAGE: 'loading',
        GAUGING_STATION: 'loading',
        FLOW_STATION: 'loading',
        MONITOR_STATION: 'loading',
        RESERVOIR_STATION: 'loading',
        EMBANKMENT_STATION: 'loading',
        PONDS_STATION: 'loading'
      },
      deleteAllMarker() {
        MarkerObj.remove();
      },
      initStoreData() {
        this.currModal = { id: undefined, type: undefined };
        this.loadingOfMarkerData = {
          RAINFALL_STATION: 'loading',
          IMPORTANT_VILLAGE: 'loading',
          GAUGING_STATION: 'loading',
          FLOW_STATION: 'loading',
          MONITOR_STATION: 'loading',
          RESERVOIR_STATION: 'loading',
          EMBANKMENT_STATION: 'loading',
          PONDS_STATION: 'loading'
        };
        this.markerObj = {
          RAINFALL_STATION: [],
          GAUGING_STATION_RIVER: [],
          GAUGING_STATION_RESERVOIR: [],
          FLOW_STATION: [],
          EMBANKMENT_STATION: [],
          MONITOR_STATION: [],
          RESERVOIR_STATION: [],
          PONDS_STATION: []
        };
      },
      selectBottomMenus: ['IMPORTANT_VILLAGE'],
      dispose() {
        this.deleteAllMarker();
        removeMapLineLayer();
        this.markerObj = null;
      },
      markerObj: null,
      requestTime: {
        startTime: moment().subtract('day', 1).format(MomentFormatStr),
        endTime: moment().format(MomentFormatStr)
      },
      addMarker(currType: string) {
        if (this.markerObj && this.markerObj[currType]) {
          let markerList = this.markerObj[currType];
          let handleClick = (id, type) => {
            this.currModal = {
              id,
              type
            };
          };
          GlobalStore.currMarkerAddObjArr = {
            markerList,
            handleClick
          };
          // 新增点位
          MarkerObj.add({
            map: GlobalStore.map,
            markerList,
            handleClick
          });
        }
      },
      maintainStoreMarkerUtil(type, data) {
        let markerData = formatMarkerData(data, type);
        if (this.markerObj) {
          this.markerObj[type] = markerData;
          this.loadingOfMarkerData[type] = 'success';
          if (this.selectBottomMenus.indexOf(type) != -1) {
            this.addMarker(type);
          }
        }
      },
      embankmentData: [],
      drawEmbankmentLine() {
        let tempArrOfLine: {
          start: [number, number];
          end: [number, number];
        }[] = [];
        this.embankmentData.map(item => {
          tempArrOfLine.push({
            start: [item.startLon, item.startLat],
            end: [item.endLon, item.endLat]
          });
        });
        GlobalStore.flowLayer3D?.drawLine(tempArrOfLine);
      },
      handleLayerTypeChange(
        allActiveType: string[],
        isResetDefaultView: boolean = true,
        isJustZoomChange: boolean = false
      ) {
        isResetDefaultView && GlobalStore.map_resetDefaultView();
        this.allActiveType = allActiveType; // 重新设置当前选中的点位Layer;
        this.deleteAllMarker(); // 删除所有点位数据
        !isJustZoomChange && removeMapLineLayer(); // 如果不仅仅是zoom变化，就删除地图上所有的线;
        this.currLayerShow = allActiveType[0]; //
        allActiveType.map(item => {
          if (item !== 'GAUGING_STATION') {
            if (item == 'GENERALIZED_GRAPH') {
              // 如果是概化图，不需要打点只需要展开弹窗就ok
            } else {
              this.addMarker(item);
              // 如果是堤防的话还要划线
              if (item == 'EMBANKMENT_STATION' && !isJustZoomChange) {
                MapOfLine.map(item => {
                  getCreekData(item.path, item.id);
                });
              }
            }
          } else {
            this.addMarker('GAUGING_STATION_RIVER');
            this.addMarker('GAUGING_STATION_RESERVOIR');
          }
        });
      },
      handleMapFlyByClick(
        longitude: number,
        latitude: number,
        modalId: number,
        modalType: ModalType,
        isFlyTo: boolean
      ) {
        this.handleLayerTypeChange([modalType], false);
        isFlyTo &&
          GlobalStore.map_flyTo({
            center: [longitude, latitude],
            zoom: 16,
            pitch: 65
          });
        this.currModal = {
          id: modalId,
          type: modalType
        };
        this.isJustCssActive_bottomLayer = false;
      },
      isJustCssActive_bottomLayer: false,
      isEnLargeMonitor: undefined,
      reservoirOverflow: {
        middle: {
          num: 0
        },
        small: {
          num: 0
        }
      }
    })
  );
  return store;
}
interface MapFlyByClickProp {}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStore = store.useStore;
export { ModalType };
