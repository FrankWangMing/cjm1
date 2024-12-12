/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 */
import { createStore } from '@/utils/store';
import { useLocalStore } from 'mobx-react-lite';
import { MarkerObj } from '@/components/Map';
import { IMarker } from '@/domain/marker';
import { IRiskItem } from '@/domain/valley';
import { WaterResampleAnimation } from '@ys/dte';
import { Moment } from 'moment';
import GlobalStore from '@/store';
import { PHYSICAL_KEYWORDS } from '@/utils/const';

export const INIT_FORECAST_TIME = 12;
export function useModel() {
  const store = useLocalStore(
    (): {
      periodType: 'week' | 'day';
      currCase: {
        caseId: number;
        isResultRenderDone: boolean;
        loadedNum: number;
        villageRiskList: IRiskItem[];
        forecastTime: number;
        period: {
          startTime: Moment | undefined;
          endTime: Moment | undefined;
        };
        NFrames: number;
      };
      loadNumPercent: string;
      isShowProcess: boolean;
      currLayers: string[];
      currLayerId: string;
      handleTypeChange: Function;
      addMarker: Function;
      currModalObj: {
        title: string | null;
        content: JSX.Element | null;
        loading: boolean;
        type: string | null;
        id: number;
      };
      markerList: {
        village: IMarker[];
        section: IMarker[];
      };
      simAnimationMap: {
        [key: string]: WaterResampleAnimation | null;
      } | null;
      setSimAnimationMap: Function;
      simAnimation: WaterResampleAnimation | null;
      dispose: Function;
      isSimAnimationChange: number;
      backTrackTime: Moment | null;
      backTrackCalc: boolean;
    } => ({
      periodType: 'day',
      simAnimation: null,
      simAnimationMap: null,
      setSimAnimationMap(e: {}) {
        this.simAnimationMap = e;
      },
      /**
       * 标记点的数据
       */
      markerList: {
        village: [],
        section: []
      },
      /**
       * 弹窗内容
       */
      currModalObj: {
        title: null,
        content: null,
        loading: false,
        type: null,
        id: 0
      },
      /**
       * 添加标记点位
       */
      addMarker() {
        MarkerObj.remove();
        if (this.currLayers.includes('village')) {
          //重要防灾村落
          let markerList = GlobalStore.getVillageMarkerList(
            this.currCase.villageRiskList
          );
          let handleClick = (id, clickType) => {
            if (this.currCase.villageRiskList.length > 0) {
              this.currModalObj.type = clickType;
              this.currModalObj.id = id;
            }
          };
          MarkerObj.add({
            map: GlobalStore.map,
            markerList,
            handleClick
          });
        }
        if (this.currLayers.includes('section')) {
          //防洪控制断面
          let markerList = GlobalStore.sectionMarkerList;
          let handleClick = (id, clickType) => {
            if (this.currCase.villageRiskList.length > 0) {
              this.currModalObj.type = clickType;
              this.currModalObj.id = id;
            }
          };
          MarkerObj.add({
            map: GlobalStore.map,
            markerList,
            handleClick
          });
          console.log('防洪控制断面', markerList);
        }
      },
      /**
       * 当前选中展示的图层
       */
      currLayerId: '',
      /**
       * 物理量切换的处理事件
       * @param e
       */
      handleTypeChange(e: string) {
        GlobalStore.popUp?.remove();
        this.isSimAnimationChange = Math.random();
        GlobalStore.mapboxLayer?.disposeVirtualPoint();
        this.currLayerId = e;
        this.simAnimation?.show(false);
        if (this.simAnimationMap) {
          this.simAnimation =
            this.simAnimationMap[
              [PHYSICAL_KEYWORDS.水深, PHYSICAL_KEYWORDS.流速].includes(e)
                ? 'animateCloud'
                : 'staticCloud'
            ];
          if (this.currLayers.includes('risk')) {
            this.simAnimation?.show(true);
            this.simAnimation?.setRenderDataType(e);
            this.simAnimation?.setColorTheme(e);
            if (GlobalStore.mapboxLayer) {
              GlobalStore.mapboxLayer.water = this.simAnimation;
            }
          }
        }
      },
      currLayers: [],
      currCase: {
        isResultRenderDone: false,
        loadedNum: 0,
        caseId: 0,
        villageRiskList: [],
        forecastTime: INIT_FORECAST_TIME,
        period: {
          startTime: undefined,
          endTime: undefined
        },
        NFrames: -1
      },
      /**
       * 进度条百分比
       */
      get loadNumPercent() {
        let resultStr = '0%';
        if (this.currCase.NFrames == 0) {
          resultStr = '0%';
        } else {
          resultStr =
            ((this.currCase.loadedNum * 100) / this.currCase.NFrames).toFixed(
              2
            ) + '%';
        }
        return resultStr;
      },
      /**
       * 是否展示进度条
       */
      get isShowProcess() {
        return (
          (this.currLayers.includes('risk') &&
            this.currCase.isResultRenderDone &&
            [PHYSICAL_KEYWORDS.水深, PHYSICAL_KEYWORDS.流速].includes(
              this.currLayerId
            )) ||
          (this.currCase.isResultRenderDone && this.currCase.NFrames == 0)
        );
      },
      /**
       * 切换工况销毁对象
       */
      async dispose() {
        this.currModalObj = {
          title: null,
          content: null,
          loading: false,
          type: null,
          id: 0
        };
        this.currCase = {
          isResultRenderDone: false,
          loadedNum: 0,
          caseId: 0,
          villageRiskList: [],
          forecastTime: INIT_FORECAST_TIME,
          period: {
            startTime: undefined,
            endTime: undefined
          },
          NFrames: -1
        };
        MarkerObj.remove();
        await this.simAnimation?.dispose();
        if (this.simAnimationMap) {
          for (let i in this.simAnimationMap) {
            await this.simAnimationMap[i]?.dispose();
          }
        }
        GlobalStore.disposeMapboxLayer();
        this.simAnimationMap = null;
        this.simAnimationMap = null;
      },
      isSimAnimationChange: Math.random(),
      backTrackTime: null,
      backTrackCalc: false
    })
  );
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStore = store.useStore;
