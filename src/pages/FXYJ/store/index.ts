/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 */
import { useUpdateEffect } from 'ahooks';
import { createStore } from '@/utils/store';
import { WaterResampleAnimation } from '@ys/dte';
import { useLocalStore } from 'mobx-react-lite';
import GlobalStore from '@/store';
import { Moment } from 'moment';
import moment from 'moment';
import { MarkerObj } from '@/components/Map';
import { getCreekData2Obj } from '@/utils';
import { IMarker } from '@/domain/marker';
import {
  MomentFormatStr,
  PHYSICAL_KEYWORDS,
  ShowModeProjectId,
  getForecastTime
} from '@/utils/const';
import { ForecastServer } from '@/service';
import { message } from 'antd';
export interface IRequestTimeProp {
  startTime: string;
  endTime: string;
}
export type ModalType =
  | 'GENERALIZED_GRAPH'
  | 'RAINFALL_STATION' //雨量站
  | 'GAUGING_STATION'
  | 'GAUGING_STATION_RIVER' //水位站 河道
  | 'GAUGING_STATION_RESERVOIR' //水位站 水库
  | 'FLOW_STATION' //流量站
  | 'MONITOR_STATION' //监控
  | 'RESERVOIR_STATION'
  | 'EMBANKMENT_STATION'
  | 'PONDS_STATION'
  | 'IMPORTANT_VILLAGE';
export function useModel() {
  const store = useLocalStore(
    (): {
      /**
       * 界面加载好的时间
       */
      time_loaded: Moment;
      /**
       * 当前展示的水动力对象
       */
      currSimAnimation: WaterResampleAnimation | null;
      /**
       * 当前展示的水动力对象-设置
       */
      setCurrSimAnimation: Function;
      /**
       * 左侧卡片对应的水动力对象以及caseId合集。
       */
      left_waterCaseIdMap: {
        [key: string]: {
          simAnimation: WaterResampleAnimation | null;
          caseId: number;
        };
      };
      /**
       * 当前选中工况的
       */
      currLayerId: string;
      setCurrLayerId: Function;
      /**
       * 是否隐藏右侧所有的东西
       */
      isRightHideAll: boolean;
      /**
       * 是否展开右侧的弹窗;
       */
      isExpandRight: boolean;
      /**
       * 弹窗数据
       */
      modalData: {
        id?: number;
        type: string | undefined;
        title: string;
        content: JSX.Element | null;
        isVisible?: boolean;
        loading: boolean;
        style?: any;
      };
      /**
       * 当前工况的数据对象
       */
      currProjectObj: {
        villageId: number;
        forecastTime: number;
        startTime: Moment;
        endTime: Moment;
        caseId: number;
        adjustType: string;
        loading: boolean;
        town: string;
        adminVillage: string;
        natureVillage: string;
      };
      dispose: Function;
      jsonLoading: boolean;
      villageVertexData: {
        [key: number]: {
          name: string;
          x0: number;
          y0: number;
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          x3: number;
          y3: number;
        };
      };
      getVillageVertex: Function;
      // 地图是否视角转动结束与否
      isMapRotateDone: boolean;
      // 当前转移村落点位数据
      currVillageData: IMarker[];
      currVillageId: number;
      // 村庄 点击事件
      handleVillageIdChange: Function;
      shelterData: {
        data: IMarker[];
        loading: boolean;
      }; // 安置场所
      // 仓库
      wareHouseData: {
        data: IMarker[];
        loading: boolean;
      };
      //监控
      monitorData: {
        data: IMarker[];
        loading: boolean;
      };
      //雨量站
      rainStationData: {
        data: IMarker[];
        loading: boolean;
      };
      //水位站 河道
      gauging_riverData: {
        data: IMarker[];
        loading: boolean;
      };
      //水位站 水库
      gauging_reservoirData: {
        data: IMarker[];
        loading: boolean;
      };
      //河道流量站
      flowStationData: {
        data: IMarker[];
        loading: boolean;
      };
      handleLayerChange: Function;
      currLayer: string[];
      // 当前选中的右侧的预见期;
      selectedForecastTime: number;
      selectedCardType: string;
      // 当前选中的左侧卡片id;
      currCardId: string;
      // 加载结果文件;
      loadResult: Function;
      //监控相关
      isEnLargeMonitor: number | undefined;
      /**
       * 请求使用时间paramsTime
       */
      requestTime: IRequestTimeProp;
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
      /**
       * 点击点位地图漂移到该点 & 弹窗数据赋值，id 、type
       */
      handleMapFlyByClick: Function;
    } => ({
      // 纯纯的加载结果文件不带任何其他逻辑
      async loadResult() {
        let _this = this;
        let mapKey = _this.currCardId[2] + '&' + _this.selectedForecastTime;
        let currWaterSimObj = _this.left_waterCaseIdMap[mapKey];
        if (currWaterSimObj) {
          _this.setCurrSimAnimation(currWaterSimObj);
          return;
        }
        // 加载云图数据
        try {
          _this.jsonLoading = true;
          _this.left_waterCaseIdMap[mapKey] = {
            simAnimation: null,
            caseId: 0
          };
          let { startTime: start, endTime: end } = getForecastTime(
            _this.time_loaded,
            _this.selectedForecastTime,
            'h'
          );
          // 还没有发起过请求
          let startTime = '',
            endTime = '',
            projectId = 0,
            calType = 1;
          if (GlobalStore.isShowMode) {
            //  演示模式
            projectId = ShowModeProjectId;
            startTime = moment('2023-01-01 06:00:00').format(MomentFormatStr);
            endTime = moment('2023-01-01 06:00:00')
              .add('h', _this.selectedForecastTime)
              .format(MomentFormatStr);
            calType = 4;
          } else {
            startTime = start.format(MomentFormatStr);
            endTime = end.format(MomentFormatStr);
          }
          const data = await ForecastServer.calcStart(
            startTime,
            endTime,
            projectId
          );
          _this.left_waterCaseIdMap[mapKey].caseId = data.projectId;
          // 获取静态云图
          const { path: jsonPath } = await ForecastServer.cloudQuery({
            startTime,
            endTime,
            projectId,
            calType
          });
          if (data.nFrameList.length > 0) {
            if (GlobalStore.mapboxLayer == null) {
              await GlobalStore.createMapboxLayer();
            }
            // 加载历时云图文件
            let tempSimAnimation =
              await GlobalStore.mapboxLayer?.loadResultSimAnimation({
                renderDataType: PHYSICAL_KEYWORDS.最大水深,
                colorTheme: PHYSICAL_KEYWORDS.最大水深,
                // jsonPath.split('8051')[1]
                // resultPathList: [jsonPath.split('8311')[1]],
                resultPathList: [jsonPath],
                handleLoadedNum: () => {},
                _sumFrames: 1
              });
            GlobalStore.map?.addLayer(
              GlobalStore.mapboxLayer as mapboxgl.AnyLayer
            );
            _this.left_waterCaseIdMap[mapKey].simAnimation = tempSimAnimation;
            _this.setCurrSimAnimation(_this.left_waterCaseIdMap[mapKey]);
          }
          _this.jsonLoading = false;
        } catch (e) {
          message.error('结果加载出错了');
        }
      },
      currCardId: '',
      time_loaded: moment(),
      currSimAnimation: null,
      async setCurrSimAnimation(e: {
        simAnimation: WaterResampleAnimation;
        caseId: number;
      }) {
        this.currSimAnimation = e.simAnimation;
        if (GlobalStore.mapboxLayer) {
          GlobalStore.mapboxLayer.water = e.simAnimation;
          // 切换的时候重新贴合。
          await GlobalStore.map?.once('idle');
          GlobalStore.handleHide3DTile_RePaint();
        }
      },
      left_waterCaseIdMap: {},
      currLayerId: '',
      setCurrLayerId(e: string) {
        GlobalStore.popUp?.remove();
        this.currSimAnimation?.show(true);
        this.currLayerId = e;
        this.currSimAnimation?.setColorTheme(e);
        this.currSimAnimation?.setRenderDataType(e);
      },
      isRightHideAll: true,
      isExpandRight: false,
      modalData: {
        id: -1,
        type: '',
        title: '',
        content: null,
        isVisible: false,
        loading: false
      },
      currProjectObj: {
        villageId: -1,
        forecastTime: 3,
        startTime: moment(),
        endTime: moment(),
        caseId: -1,
        adjustType: '',
        loading: false,
        town: '',
        adminVillage: '',
        natureVillage: ''
      },
      dispose() {
        MarkerObj.remove();
        this.currSimAnimation?.dispose();
        for (let i in this.left_waterCaseIdMap) {
          this.left_waterCaseIdMap[i].simAnimation?.dispose();
        }
      },
      jsonLoading: false,
      villageVertexData: {},
      async getVillageVertex() {
        this.villageVertexData = await getCreekData2Obj(
          'creek_data/village-vertex.csv'
        );
      },
      isMapRotateDone: false,
      currVillageData: [],
      currVillageId: -1,
      async handleVillageIdChange(villageId: number) {
        await this.loadResult();
        this.currVillageId = villageId;
        this.isMapRotateDone = false;
        this.setCurrLayerId(PHYSICAL_KEYWORDS.最大水深);
        let [currVillageObj] = GlobalStore.getVillageItemById(villageId);
        let forecastTime = this.currProjectObj.forecastTime;
        if (currVillageObj) {
          // 点击村庄展开右侧
          this.isRightHideAll = false;
          this.isExpandRight = true;
          this.currProjectObj.loading = true;
          let { startTime, endTime } = getForecastTime(
            this.time_loaded,
            forecastTime,
            'h'
          );
          if (GlobalStore.isShowMode) {
            startTime = moment('2019-07-18 15:00:00');
            endTime = moment('2019-07-18 15:00:00').add('h', forecastTime);
          }
          this.currProjectObj = {
            villageId,
            forecastTime,
            startTime,
            endTime,
            caseId:
              this.left_waterCaseIdMap[
                this.currCardId[2] + '&' + this.selectedForecastTime
              ].caseId,
            adjustType: this.currProjectObj.adjustType,
            loading: false,
            adminVillage: currVillageObj.administrationVillage,
            town: currVillageObj.town,
            natureVillage: currVillageObj.natureVillage
          };
          GlobalStore.map?.flyTo({
            pitch: 0,
            bearing: 0,
            zoom: 17,
            center: [currVillageObj.longitude, currVillageObj.latitude]
          });
          await GlobalStore.map?.once('idle');
          this.isMapRotateDone = true;
        }
      },
      shelterData: {
        data: [],
        loading: true
      },
      wareHouseData: {
        data: [],
        loading: true
      },
      monitorData: {
        data: [],
        loading: true
      },
      rainStationData: {
        data: [],
        loading: true
      },
      // gaugingStationData: {
      //   data: [],
      //   loading: true
      // },
      gauging_riverData: {
        data: [],
        loading: true
      },
      gauging_reservoirData: {
        data: [],
        loading: true
      },
      flowStationData: {
        data: [],
        loading: true
      },
      currLayer: ['village', 'warehouse', 'shelter'],
      // currLayer: ['village'],
      async handleLayerChange(e: string[], isResetDefaultView: boolean = true) {
        console.log('选中的tab store', e, this.shelterData.data);
        if (
          [
            'MONITOR_STATION',
            'RAINFALL_STATION',
            'GAUGING_STATION',
            'FLOW_STATION'
          ].includes(e[0])
        ) {
          isResetDefaultView && GlobalStore.map_resetDefaultView();
        }
        this.currLayer = e;
        // 首先删除所有点位;
        MarkerObj.remove();
        if (e.includes('village')) {
          // 村庄
          // console.log('重点防洪对象', this.currVillageData);
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.currVillageData,
            handleClick: (id, type) => {
              this.handleVillageIdChange(id);
            }
          });
        }
        if (e.includes('shelter')) {
          // 避灾安置场所  避灾安置点
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.shelterData.data,
            handleClick: (id, type) => {
              this.modalData.id = id;
              this.modalData.type = type;
            }
          });
        }
        if (e.includes('warehouse')) {
          // 库点物资信息
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.wareHouseData.data,
            handleClick: (id, type) => {
              this.modalData.id = id;
              this.modalData.type = type;
            }
          });
        }
        if (e.includes('MONITOR_STATION')) {
          // 监控打点
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.monitorData.data,
            handleClick: (id, type) => {
              this.modalData.id = id;
              this.modalData.type = type;
            }
          });
        }
        if (e.includes('RAINFALL_STATION')) {
          //雨量站打点
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.rainStationData.data,
            handleClick: (id, type) => {
              this.modalData.id = id;
              this.modalData.type = type;
            }
          });
        }
        //水位站打点
        if (e.includes('GAUGING_STATION')) {
          //水位站水库
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.gauging_reservoirData.data,
            handleClick: (id, type) => {
              this.modalData.id = id;
              this.modalData.type = type;
            }
          });
          //水位站河道
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.gauging_riverData.data,
            handleClick: (id, type) => {
              this.modalData.id = id;
              this.modalData.type = type;
            }
          });
        }
        //河道流量站打点
        if (e.includes('FLOW_STATION')) {
          // console.log('打点流量站', this.flowStationData.data);
          MarkerObj.add({
            map: GlobalStore.map,
            markerList: this.flowStationData.data,
            handleClick: (id, type) => {
              this.modalData.id = id;
              this.modalData.type = type;
            }
          });
        }
      },
      selectedForecastTime: 3,
      selectedCardType: '',
      //视频监控相关
      isEnLargeMonitor: undefined,
      requestTime: {
        startTime: moment().subtract('day', 1).format(MomentFormatStr),
        endTime: moment().format(MomentFormatStr)
      },
      //实时警情相关的
      reservoirOverflow: {
        middle: {
          num: 0
        },
        small: {
          num: 0
        }
      },
      handleMapFlyByClick(
        longitude: number,
        latitude: number,
        modalId: number,
        modalType: ModalType,
        isFlyTo: boolean
      ) {
        let markType = '';
        if (
          ['GAUGING_STATION_RESERVOIR', 'GAUGING_STATION_RIVER'].includes(
            modalType
          )
        ) {
          markType = 'GAUGING_STATION';
        } else {
          markType = modalType;
        }
        this.handleLayerChange([markType], false);
        isFlyTo &&
          GlobalStore.map_flyTo({
            center: [longitude, latitude],
            zoom: 16,
            pitch: 65
          });
        this.modalData.id = modalId;
        this.modalData.type = modalType;
        // this.isJustCssActive_bottomLayer = false;
      }
    })
  );
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStore = store.useStore;
