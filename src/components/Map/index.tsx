/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { IMarker } from '@/domain/marker';
import {
  DEPTH_AMPLITUDE,
  IMG_PATH,
  MAPBOX_TOKEN,
  RISK_MAP,
  StaticDirUrl,
  villageTileInfo
} from '@/utils/const';
import RenderLayer from './3dtile-layer';
import GlobalStore from '@/store';
import { TerrainUtil } from '@ys/dte';
import { message } from 'antd';
import RenderMap from './render-map';
import { ShowServer } from '@/service/show';
import VillageTilePhotoGraph from './VillageTilePhotoGraph';
import TileCommonLayer from './3dtile-commom-layer';
import * as THREE from 'three';
import { mapPoint } from './marker';
import { Marker_IMG } from './marker/Marker';
import GUI from 'lil-gui';
import { Bounds } from 'html2canvas/dist/types/css/layout/bounds';

/**
 * mapbox的默认配置项;
 */
//沁水地图配置
export const MAPBOX_DEFAULT_CONFIG = {
  zoom: 11.5,
  // center: [112.3511, 35.7595], //沁水县整体的中心点位
  center: [112.10840043682327, 35.697320212642396], //todo920 暂时
  // center1: [112.1263948099143, 35.66458353408596],
  center1: [112.199223, 35.680607],
  pitch: 65,
  bearing: 0,
  minZoom: 10,
  defaultZoom: 12,
  maxZoom: 18,
  pitchWithRotate: true,
  maxBounds: [
    [
      111.9353116099999994, 35.3883795699999979, 112.7797823300000033,
      36.0629322300000013
    ]
  ]
};
/**
 * 创建天地图
 * @param id 容器的id
 * @returns 返回 天地图的地图对象
 */
export const getMapInstance = (id: string): Promise<mapboxgl.Map> => {
  return new Promise(async resolve => {
    let tempMapRender = new RenderMap();
    let map = await tempMapRender.initMapInstance({
      container: id,
      center: MAPBOX_DEFAULT_CONFIG.center as [number, number],
      token: MAPBOX_TOKEN,
      // style: 'mapbox://styles/mapbox/satellite-streets-v12',
      style: {
        version: 8,
        sources: {
          'osm-tiles1': {
            type: 'raster',
            tiles: [
              'http://10.0.4.131:4001/examples/Layer/img_w/China/{z}/{x}/{y}.png'
            ],
            tileSize: 256
          },
          // 'osm-tiles1': {
          //   type: 'raster',
          //   // "scheme": "tms",
          //   tiles: [
          //     // 影像底图
          //     `https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/TDT/img_w/{z}/{x}/{y}.png`
          //   ],
          //   tileSize: 256
          // },
          'osm-tiles11': {
            type: 'raster',
            // "scheme": "tms",
            tiles: [
              // 影像底图
              // `http://10.0.4.131:4001/qinshuiCounty/Layer/img_w/{z}/{x}/{y}.png`
              `http://10.0.4.131:4001/qinshuiCounty/Layer/img_w/DOM/{z}/{x}/{y}.png`
            ],
            tileSize: 256,
            bounds: [
              111.9353116099999994, 35.3883795699999979, 112.7797823300000033,
              36.0629322300000013
            ]
          }
        },
        layers: [
          {
            id: 'simple-tiles1',
            type: 'raster',
            source: 'osm-tiles1',
            minzoom: 8
            // maxzoom: 17
          },
          {
            id: 'simple-tiles11',
            type: 'raster',
            source: 'osm-tiles11',
            minzoom: 11
            // maxzoom: 17
          }
        ]
      },
      preserveDrawingBuffer: true,
      bearing: MAPBOX_DEFAULT_CONFIG.bearing,
      minZoom: MAPBOX_DEFAULT_CONFIG.minZoom,
      pitchWithRotate: MAPBOX_DEFAULT_CONFIG.pitchWithRotate
    });
    // if (GlobalStore.isShow3dTile) {
    //   villageTileInfo.map(async item => {
    //     let flowLayer3D = await addVillageTileToMap(
    //       map,
    //       id,
    //       item.center,
    //       item.layerId,
    //       item.render3dtileParam,
    //       item.tilePath,
    //       item.tilePosition
    //     );
    //     map.addLayer(flowLayer3D as any);
    //   });
    // }
    map.on('zoomend', e => {
      let currZoom = e.target.getZoom();
      GlobalStore.setCurrZoom(currZoom);
    });
    map.on('click', e => {
      console.log('e click', e);
    });
    map.on('rotate', e => {
      let angle = e.target.getBearing();
      GlobalStore.setAngle(angle);
    });
    map.on('pitch', e => {
      let tempPitch = e.target.getPitch();
      if (tempPitch == 0) {
        GlobalStore.setMapView('2D');
      } else {
        GlobalStore.setMapView('3D');
      }
    });
    resolve(map);
  });
};
/**
 * 向地图中添加倾斜摄影
 * @param map 地图对象
 * @param id 地图容器id
 * @param layerId 村庄图层id
 * @param tilePath 村庄倾斜摄影的数据源
 * @param tilePosition 倾斜摄影位置修正
 * @param render3dtileParam 村庄倾斜摄影的相关配置
 * @returns
 */
// const gui = new GUI();
export const addVillageTileToMap = async (
  map: mapboxgl.Map,
  id: string,
  center: [number, number],
  layerId: string,
  tilePath: string,
  tilePosition: [number, number, number],
  render3dtileParam: {
    scaleUP: number;
    offset: number;
    msse: number;
    scaleXY: number;
    disposeEND: boolean;
    threshold?: number;
  }
): Promise<TileCommonLayer | null> => {
  return new Promise(resolve => {
    let dom = document.getElementById(id)!;
    let flowLayer3D = new TileCommonLayer({
      id: layerId,
      center: center,
      dom,
      position: new THREE.Vector3(...tilePosition),
      url: tilePath,
      map
      // gui
    });
    // let flowLayer3D = new VillageTilePhotoGraph(
    //   map,
    //   center,
    //   dom,
    //   layerId,
    //   render3dtileParam,
    //   tilePath,
    //   tilePosition
    // );
    resolve(flowLayer3D);
  });
};

interface MarkerObjAddProps {
  map: mapboxgl.Map | null;
  markerList: Array<IMarker>;
  handleClick: Function;
  handleHover?: Function;
}
/**
 * 标记点对象相关操作封装
 * @param remove 删除标记点
 * @param add 添加标记点map，markerList
 */
export const MarkerObj: {
  remove: Function;
  add: Function;
} = {
  /**
   * 删除标记点
   * @param allMarker
   */
  remove: async () => {
    // if (GlobalStore.isShow3dTile) {
    //   await GlobalStore.flowLayer3D?.label2d.removeByType();
    //   await GlobalStore.flowLayer3D?.removeLine();
    // } else {
    // @ts-ignore
    GlobalStore.map?.removeAllMapMarker();
    // }
  },
  /**
   * 添加标记到threeJs里面去
   * @param map 地图实例化对象
   * @param markerList 村庄数据list
   * @param handleMarkerClick 点击标记点处理事件;
   */
  add: ({
    map = GlobalStore.map!,
    markerList,
    handleClick
  }: MarkerObjAddProps) => {
    if (map) {
      markerList.map(async (item: IMarker) => {
        if (item) {
          const el = createMarkerDom(item, handleClick);
          var popup = new mapboxgl.Popup({
            offset: item.nameShowOuterCss ? 50 : 0
          }).setHTML(
            ` <div class='marker' style="border-radius:4rem;color:#fff;padding:5rem;font-family:AlibabaPuHuiTiR;font-size:14rem;font-weight:normal;">${
              item.name
            }<br/>${item.data || ''}</div>`
          );
          // 开始打点
          // if (GlobalStore.isShow3dTile) {
          //   // threeJs打点
          //   let tempArr2 = lngLat2Xyz({
          //     lng: item.longitude,
          //     lat: item.latitude,
          //     map: GlobalStore.map,
          //     flowLayer3D: GlobalStore.flowLayer3D!
          //   });
          //   GlobalStore.flowLayer3D?.label2d.addLabels([
          //     { position: tempArr2 as [number, number, number], customHTML: el }
          //   ]);
          // } else {
          // mapbox原生打点

          // let tempMarker = new mapboxgl.Marker(el).setLngLat([
          //   item.longitude,
          //   item.latitude
          // ]);
          // tempMarker.getElement().addEventListener('mouseover', function () {
          //   debounce(() => {
          //     GlobalStore.currZoom < 13 && popup.addTo(map);
          //   }, 0)();
          // });
          // tempMarker.getElement().addEventListener('mouseout', function () {
          //   popup.remove();
          // });
          // tempMarker.setPopup(popup);
          // tempMarker.addTo(map);

          el.getElement().addEventListener('mouseover', function () {
            debounce(() => {
              GlobalStore.currZoom < 13 && popup.addTo(map);
            }, 0)();
          });
          el.getElement().addEventListener('mouseout', function () {
            popup.remove();
          });
          el.setPopup(popup);
          el.addTo(map);
          // }
        }
      });
    }
  }
};
// 点位上弹窗需要有背景图片的打点类型
const needBckImgList = [
  'village',
  'section',
  'RAINFALL_STATION',
  'GAUGING_STATION_RIVER',
  'GAUGING_STATION_RESERVOIR',
  'FLOW_STATION'
];
// 格式化点位上弹窗
const createMarkerDom = (item, handleClick) => {
  let width = item.width || 20;
  let height = item.height || 20;
  let backgroundImage = needBckImgList.includes(item.type)
    ? `url(${IMG_PATH.markerNameBck[item.risk]})`
    : 'linear-gradient(180deg, rgba(0, 5, 17, 0.50) 0%, #282C35 100%)';
  let borderColor = item.type === 'village' ? 'transparent' : 'rgba(1,1,1,0)';
  let maxWidth = item.type === 'village' ? '110rem' : 'unset';
  let animateColor = 'rgba(234, 9, 20, 0.9)';
  /**
   * 设置Icon跳动
   */
  // 是否心跳
  let animation = 'unset';
  let animationCssStr = 'heartBit 0.5s alternate infinite';
  // 如果是水库超限;
  switch (item.type) {
    case 'RAINFALL_STATION':
      // 雨量站超限？
      if ([IMG_PATH.markerIcon['RAINFALL_STATION_3Level']].includes(item.icon))
        animation = animationCssStr;
      break;
    case 'GAUGING_STATION_RIVER':
      // 河道站-河道站
      if (
        [
          IMG_PATH.markerIcon['GAUGING_STATION_RIVER_3Level'],
          IMG_PATH.markerIcon['GAUGING_STATION_RIVER_2Level'],
          IMG_PATH.markerIcon['GAUGING_STATION_RIVER_1Level']
        ].includes(item.icon)
      ) {
        animation = animationCssStr;
        if (item.icon == IMG_PATH.markerIcon['GAUGING_STATION_RIVER_1Level']) {
          animateColor = 'rgba(247, 235, 9, 0.7)';
        }
      }
      break;
    case 'GAUGING_STATION_RESERVOIR':
      // 河道站-水库站
      if (
        [IMG_PATH.markerIcon['GAUGING_STATION_RESERVOIR_3Level']].includes(
          item.icon
        )
      )
        animation = animationCssStr;
      break;
    default:
      animation = 'unset';
  }
  // 如果是村庄点位要添加子元素展示村庄名字
  let titleJsx = (
    <div
      className="markerBlock"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: item.height || 0
      }}>
      <div
        className="marker"
        style={{
          zIndex: 1,
          borderRadius: 4 + 'rem',
          backgroundImage: backgroundImage,
          borderWidth: 1 + 'px',
          borderStyle: 'solid',
          borderColor: borderColor,
          color: '#fff',
          fontFamily: 'AlibabaPuHuiTiR',
          fontSize: 14 + 'rem',
          fontWeight: 'normal',
          padding: 5 + 'rem',
          maxWidth: maxWidth,
          ...item.nameShowCss
        }}>
        {item.name}
        <br />
        {item.data || ''}
      </div>
      {animation != 'unset' && (
        <div className="alarm-icon-container">
          <div
            className="alarm-icon-circle"
            style={{ backgroundColor: animateColor }}></div>
          <div
            className="alarm-icon-circle"
            style={{ backgroundColor: animateColor }}></div>
          <div
            className="alarm-icon-circle"
            style={{ backgroundColor: animateColor }}></div>
          <div
            className="alarm-icon-circle"
            style={{ backgroundColor: animateColor }}></div>
        </div>
      )}
    </div>
  );
  let mappoint = mapPoint(
    [item.longitude, item.latitude],
    <Marker_IMG
      width={width}
      height={height}
      imgUrl={item.icon}
      titleJsx={titleJsx}
      isAlwaysShowTitle={false}
    />,
    () => {
      GlobalStore.map_flyTo({
        center: [item.longitude, item.latitude],
        zoom: 16,
        pitch: 65
      });
      handleClick(item.id, item.type);
    }
  );
  return mappoint;
};
/**
 * 将经纬度点位转换成3dTile使用的xyz坐标
 */
interface LngLat2XyzProp {
  lng: number; // 经度
  lat: number; // 纬度
  map?: mapboxgl.Map; // 地图
  flowLayer3D?: RenderLayer | null; // 3D
}
export const lngLat2Xyz = ({
  lng,
  lat,
  map = GlobalStore.map,
  flowLayer3D = GlobalStore.flowLayer3D
}: LngLat2XyzProp): [number, number, number] | null => {
  if (
    lat >= 90 ||
    lat <= -90 ||
    lng <= -180 ||
    lng >= 180 ||
    lat == 0 ||
    lng == 0
  ) {
    message.error('经纬度数据有问题');
    return null;
  }
  if (flowLayer3D && map) {
    let lngLatMap = new mapboxgl.LngLat(lng, lat);
    let altitude = map.queryTerrainElevation(lngLatMap, {
      exaggerated: false
    });
    altitude = altitude! || lng || 0;
    let tempArr = TerrainUtil.coordinateTransform(
      { longitude: lng, latitude: lat, altitude: 0 },
      flowLayer3D.modelAsMercatorCoordinate
    );
    return [tempArr[0], altitude, -tempArr[1]];
  } else {
    return [0, 0, 0];
  }
};

export * from './MapboxLayer';
/**
 * 添加边界 -- 淳安
 * @param map
 */
export const addBorder = async (map: mapboxgl.Map) => {
  if (GlobalStore.borderUrl == '') {
    const data = await ShowServer.getStaticLink(3);
    GlobalStore.borderUrl = data.link;
  }
  map.addLayer({
    id: 'wms-test-layers',
    type: 'raster',
    source: {
      type: 'raster',
      tiles: [GlobalStore.borderUrl],
      tileSize: 256
    },
    paint: {}
  });
};
/**
 * 清除淳安边界
 */
export const removeBorder = () => {
  GlobalStore.map_removeLayerById('wms-test-layers');
  GlobalStore.map?.getSource('wms-test-layers') &&
    GlobalStore.map?.removeSource('wms-test-layers');
};

/**
 *
 * @param map 处理隐藏或者展示某个图层；不删除图层。
 * @param isShow
 * @param id
 */
export const handleLayerShow = (
  map: mapboxgl.Map = GlobalStore.map!,
  isShow: boolean = false,
  id: string
) => {
  if (map && map.getLayer(id)) {
    map.setLayoutProperty(id, 'visibility', isShow ? 'visible' : 'none');
  }
};

export const villageNameMarker = () => {
  handleLayerShow(GlobalStore.map, false, 'simple-tiles2');
  GlobalStore.villageList.map(item => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.innerHTML = `<p style="color:white;font-size:14rem;">${item.natureVillage}</p>`;
    let tempMarker = new mapboxgl.Marker(el).setLngLat([
      item.longitude,
      item.latitude
    ]);
    tempMarker.addTo(GlobalStore.map!);
  });
};

export const map_drawLine = ({
  map,
  coordinatesData,
  id
}: {
  map: mapboxgl.Map;
  coordinatesData: [number, number][];
  id: {
    source: string;
    layer: string;
  };
}) => {
  if (map) {
    if (
      map.getSource(id.source) == undefined &&
      map.getLayer(id.layer) == undefined
    ) {
      map.addSource(id.source, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinatesData
          }
        }
      });
      map.loadImage(IMG_PATH.dibaLine, (err, image) => {
        if (err) throw err;
        // @ts-ignore
        map.addImage('cross-line', image);
        map.addLayer({
          id: id.layer,
          type: 'line',
          source: id.source,
          paint: {
            'line-pattern': 'cross-line',
            'line-width': 16,
            'line-opacity': 0.99
          }
        });
      });
    }
    //  && map.removeLayer(id.layer);
    //  && map.removeSource(id.source);
  }
};

function debounce(func, delay) {
  let timerId;

  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}
