/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import * as THREE from 'three';
import {
  addBorder,
  addVillageTileToMap,
  handleLayerShow,
  MAPBOX_DEFAULT_CONFIG,
  MarkerObj,
  removeBorder
} from '@/components/Map';
import { IMarker } from '@/domain/marker';
import { IRiskItem, IVillageBase } from '@/domain/valley';
import { IMG_PATH, MapboxLayerId } from '@/utils/const';
import { flow, makeAutoObservable } from 'mobx';
import { ISectionBase } from '@/domain/section';
import { MapboxLayer } from '@/components/Map/MapboxLayer';
import { message } from 'antd';
import { history } from '@/utils/history';
import { QueryFloodPreventPdfRes } from '@/service';
import { core, TileRenderLayer } from 'ys-dte';
import GUI from 'lil-gui';
//暂时无用的
import RenderLayer from '@/components/Map/3dtile-layer';
import { Render3dtile } from '@ys/dte';
import {
  DEPTH_AMPLITUDE,
  sixTileInfo,
  StaticDirUrl,
  villageTileInfo
} from '@/utils/const';
interface MapFlyToProps {
  pitch?: number;
  center?: [number, number];
  zoom?: number;
  bearing?: number;
}

class GlobalStore {
  constructor() {
    makeAutoObservable(this);
  }
  // rem值的调整;
  fontSize = 1;
  updateFontSize(fontSize) {
    this.fontSize = fontSize;
  }

  // 当前工况的总帧数;
  nFrames = 0;
  /**
   * 更新当前工况的总帧数;
   * @param frames 帧数  number
   *
   */
  updateNFrames(frames: number) {
    this.nFrames = frames;
  }
  // 村庄的数据
  villageList: IVillageBase[] = [];

  // 根据村庄数据 + 传递进来的村庄风险数据 => 打点需要的村庄数据
  getVillageMarkerList = (e: IRiskItem[]): IMarker[] => {
    let resultList: IMarker[] = [];
    if (e.length > 0) {
      this.villageList.map(baseItem => {
        let riskItemObj = e.find(item => {
          return baseItem.id == item.natureVillageId;
        });
        if (riskItemObj) {
          let tempObj = {
            id: baseItem.id,
            longitude: baseItem.longitude,
            latitude: baseItem.latitude,
            type: 'village',
            icon: IMG_PATH.riskLevelMarker[riskItemObj!.riskLevel],
            risk: riskItemObj!.riskLevel,
            name:
              riskItemObj.region +
              riskItemObj.administrativeVillage +
              riskItemObj.natureVillageName,
            nameShowCss: { marginTop: -110 + 'rem' }
          };
          resultList.push(tempObj);
        }
      });
    } else {
      this.villageList.map(item => {
        let tempObj = {
          id: item.id,
          longitude: item.longitude,
          latitude: item.latitude,
          type: 'village',
          icon: IMG_PATH.riskLevelMarker[0],
          risk: 0,
          name: item.town + item.administrationVillage + item.natureVillage,
          nameShowCss: { marginTop: -110 + 'rem' }
        };
        resultList.push(tempObj);
      });
    }
    return resultList;
  };

  // 断面数据
  sectionMarkerList: IMarker[] = [];
  sectionBaseList: ISectionBase[] = [];

  customerGeometry: THREE.BufferGeometry | null = null;
  setCustomerGeometry(e: THREE.BufferGeometry) {
    this.customerGeometry = e;
  }
  getVillageItemById(id: number): IVillageBase[] {
    return this.villageList.filter(item => {
      return item.id == id;
    });
  }

  /**
   * 全局使用的map对象
   */
  map: mapboxgl.Map | undefined = undefined;
  setMap(e: mapboxgl.Map | undefined) {
    this.map = e;
  }
  // 地图的视角相关
  map_view: '2D' | '3D' = '2D';
  // 点击2d/3d切换时候地图响应时间
  setDefaultMapView() {
    this.map?.flyTo({
      pitch: this.map_view === '2D' ? 0 : 65
    });
  }
  setMapView(e: '2D' | '3D') {
    this.map_view = e;
  }
  mapboxLayer: MapboxLayer | null = null;
  async disposeMapboxLayer() {
    if (this.map) {
      this.map.getLayer(MapboxLayerId.resultLayerId) &&
        (await this.map?.removeLayer(MapboxLayerId.resultLayerId));
      this.mapboxLayer?.dispose();
      this.mapboxLayer = null;
    }
  }
  // 创建mapboxLayer;
  createMapboxLayer = async () => {
    this.mapboxLayer = new MapboxLayer(
      this.map!,
      [112.10840043682327, 35.697320212642396],
      MapboxLayerId.resultLayerId
    );
  };
  resultPathList: string[] = [];
  // 地图 - 重置视角
  async map_resetDefaultView() {
    let pathName = history.location.pathname;
    this.setMapView('3D');
    this.map_flyTo({
      pitch: 75,
      center: [
        MAPBOX_DEFAULT_CONFIG.center[0],
        MAPBOX_DEFAULT_CONFIG.center[1]
      ],
      // zoom: pathName == '/slyzt' ? 12.5 : MAPBOX_DEFAULT_CONFIG.defaultZoom,
      zoom: MAPBOX_DEFAULT_CONFIG.defaultZoom,
      bearing: MAPBOX_DEFAULT_CONFIG.bearing
    });
    this.isResetView = Math.random();
  }
  /**
   * 自定义地图flyTo
   * @param param0
   */
  async map_flyTo({ bearing, center, zoom, pitch }: MapFlyToProps) {
    // this.map?.setPointer();
    this.map?.flyTo({
      pitch: pitch,
      center: center,
      zoom: zoom,
      bearing: bearing || MAPBOX_DEFAULT_CONFIG.bearing
    });
  }
  isResetView: number = 0;

  // 删除图层;
  map_removeLayerById(id: string) {
    if (this.map && this.map.getLayer(id)) this.map.removeLayer(id);
  }
  // 千岛湖ID
  thousandOfLakeId: string = '3051';

  // 是否更新村庄数据标识
  isEditVillageInfo: boolean = false;
  isSubmitVillageInfoChange: number = 0;
  // 是否有编辑权限？
  isHaveRoleToEdit: boolean = true;

  // 是否是演示模式？
  isShowMode: boolean = false;
  setIsShowMode(e: boolean) {
    message.info(e ? '进入演示模式' : '退出演示模式');
    if (e) {
      localStorage.setItem('isShowMode', e + '');
    } else {
      localStorage.removeItem('isShowMode');
    }
    setTimeout(() => {
      this.isShowMode = e;
      location.reload();
    }, 1000);
  }
  update3DtileAndResultLayer() {
    if (!this.map) return;
    if (
      this.map.getLayer('chunan-3dtile-all') &&
      this.map.getLayer('3d-model-layer-id')
    )
      this.map.moveLayer('chunan-3dtile-all', '3d-model-layer-id'); // 结果文件置顶
  }
  // 是否渲染倾斜摄影
  isShow3dTile: boolean = false;
  //倾斜摄影的加载和卸载 使用ys-dte比较简易的用法
  layer3dtile: TileRenderLayer | undefined | null;
  setIsShow3DTile(bool: boolean) {
    // 开启倾斜摄影
    if (!this.layer3dtile) {
      // const gui = new GUI();
      this.map?.flyTo({
        center: [112.1307192124296, 35.66818427682112],
        zoom: 16
      });
      this.layer3dtile = new TileRenderLayer({
        center: [112.199223, 35.680607],
        url: 'http://10.0.4.131:4001/qinshuiCounty/3dtiles/tileset.json',
        raycastMap: false,
        map: this.map,
        id: 'tile-qs',
        position: new core.Vector3(-25, 72, -108) //高程1配置
        // gui
      });
    } else {
      //移除倾斜摄影
      // 不展示倾斜摄影
      this.layer3dtile = null;
      this.map_removeLayerById('tile-qs');
      this.map_resetDefaultView();
    }
    // 隐藏倾斜摄影
    // this.layer3dtile.render3dtile.group.visible = bool;
    this.isShow3dTile = bool;
  }
  /**
   * 关闭倾斜摄影 结果文件云图贴合地图
   */
  handleHide3DTile_RePaint() {
    this.mapboxLayer?.updateBottomDebounce();
  }
  // 当前地图上所有的点位数据
  currMarkerAddObjArr: {
    markerList: IMarker[];
    handleClick: Function | null;
  } = {
    markerList: [],
    handleClick: null
  };
  // 是否启用单点登录 - 浙水安澜
  isVerifyLogin: boolean = true;

  /**
   * 跳转到另一个路由的公共方法
   */
  async leaveCurrPage() {
    try {
      await MarkerObj.remove(); // 清除打点
      this.mapboxLayer?.disposeVirtualPoint(); // 清除虚拟测点数据
      this.mapboxLayer?.abortLoadFile(); // 放弃处于加载中的结果文件
      this.disposeMapboxLayer(); // 销毁文件图层
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('请求被中止:', error);
      } else {
        console.error('发生错误:', error);
      }
    }
  }
  currZoom: number = 0;
  setCurrZoom(e: number) {
    this.currZoom = e;
  }
  // 当前地图的距离正北的角度
  angle: number = 0;
  setAngle(e: number) {
    this.angle = e;
  }
  videoPlatformUrl: string = '';
  wsUrl: string = '';
  borderUrl: string = '';
  // 虚拟测点
  popUp: mapboxgl.Popup | undefined = undefined;
  // 地图marker点位对应数据
  popUpList: mapboxgl.Popup[] = [];
  // 地图上点位数据
  markerList: mapboxgl.Marker[] = [];
  briefDataStash: QueryFloodPreventPdfRes | undefined = undefined;
  isRefresh: boolean = true; // 是否是强制刷新界面
  setHtmlFontSize!: Function;

  // flowLayer3D: null | RenderLayer = null;   // threejs3D图层
  // render3dtile: Render3dtile | null = null;  //旧的倾斜摄影用到的
  //倾斜摄影的加载和卸载，使用自己封装的tile 到时候不需要的时候删掉
  // async setIsShow3DTile(e: boolean) {
  //   if (!e) {
  //     // 不展示倾斜摄影
  //     this.map?.getSource('mapbox-dem') == undefined &&
  //       this.map?.addSource('mapbox-dem', {
  //         type: 'raster-dem',
  //         url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
  //         // url: './dem.json',
  //         tileSize: 512,
  //         maxzoom: 14
  //       });
  //     this.map?.setTerrain({
  //       source: 'mapbox-dem',
  //       exaggeration: 1
  //     });
  //     // addBorder(this.map!); // 淳安边界
  //     // sixTileInfo.map(item => {
  //     //   this.map_removeLayerById(item.layerId);
  //     // });
  //     this.map?.removeLayer(MapboxLayerId.tileId);
  //     this.render3dtile = null;
  //     this.map_resetDefaultView();
  //     // handleLayerShow(this.map!, false, MapboxLayerId.tileId);
  //     // if (this.map?.getLayer(MapboxLayerId.tileId)) {
  //     //   this.map.getLayer(MapboxLayerId.tileId);
  //     //   this.map.setLayoutProperty(MapboxLayerId.tileId, 'visibility', 'none');
  //     // }
  //     // this.map?.moveLayer('3d-model-layer-id', 'chunan-3dtile-all');
  //   } else {
  //     // this.map?.getSource('mapbox-dem-cus') == undefined &&
  //     //   this.map?.addSource('mapbox-dem-cus', {
  //     //     type: 'raster-dem',
  //     //     // url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
  //     //     url: './dem.json',
  //     //     tileSize: 512,
  //     //     maxzoom: 14
  //     //   });

  //     this.map?.flyTo({
  //       center: [112.1307192124296, 35.66818427682112],
  //       zoom: 18
  //     });
  //     this.map?.setTerrain({
  //       source: 'mapbox-dem-cus',
  //       exaggeration: 1
  //     });
  //     /**
  //      * 展示倾斜摄影数据
  //      */
  //     // sixTileInfo.map(async item => {
  //     //   let flowLayer3D = await addVillageTileToMap(
  //     //     this.map!,
  //     //     'map',
  //     //     item.center,
  //     //     item.layerId,
  //     //     item.tilePath,
  //     //     item.tilePosition,
  //     //     item.render3dtileParam
  //     //   );
  //     //   this.map?.addLayer(flowLayer3D as any);
  //     // });
  //     // this.update3DtileAndResultLayer();
  //     // this.map?.setTerrain({
  //     //   source: 'mapbox-dem',
  //     //   exaggeration: 0
  //     // });
  //     if (!this.render3dtile) {
  //       let dom = document.getElementById('map');
  //       let flowLayer = new RenderLayer(
  //         this.map!,
  //         MAPBOX_DEFAULT_CONFIG.center1 as any,
  //         dom as any
  //       );
  //       // @ts-ignore
  //       this.render3dtile = flowLayer;
  //     }
  //     // @ts-ignore
  //     this.map?.addLayer(this.render3dtile);
  //     /**
  //      * NEW OPEN 3dtile
  //      */
  //     // villageTileInfo.map(async item => {
  //     //   let flowLayer3D = await addVillageTileToMap(
  //     //     this.map,
  //     //     'map',
  //     //     item.center,
  //     //     item.layerId,
  //     //     item.render3dtileParam,
  //     //     item.tilePath,
  //     //     item.tilePosition
  //     //   );
  //     //   console.log(item.layerId, flowLayer3D);
  //     //   this.map?.addLayer(flowLayer3D as any);
  //     //   this.map?.setTerrain({
  //     //     source: 'mapbox-dem',
  //     //     exaggeration: DEPTH_AMPLITUDE.tile_exaggeration
  //     //   });
  //     // });
  //     // this.map?.setTerrain({
  //     //   source: 'mapbox-dem',
  //     //   exaggeration: 0
  //     // });
  //     this.mapboxLayer?.updateBottomDebounce();
  //   }
  //   this.isShow3dTile = e;
  //   this.mapboxLayer?.debounce();
  // }
}

export default new GlobalStore();
