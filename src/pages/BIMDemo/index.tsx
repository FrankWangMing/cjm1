import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  getMapController,
  MapDTEOptions,
  mapboxgl,
  MapDTEController,
  CommonLayer,
  core,
  TerrainUtils
} from 'ys-dte';
import GUI from 'lil-gui';
import styled from 'styled-components';
import { historys } from '@/utils/history';

const Wrapper = styled.div`
  .lil-gui {
    position: absolute;
    z-index: 2000 !important;
  }
  .bottom-bar {
    z-index: 1000;
    position: absolute;
    width: 100%;
    height: 47px;
    bottom: 20px;
    display: flex;
    justify-content: space-around;
  }
  .btn {
    cursor: pointer;
    height: 47px;
    width: fit-content;
    padding: 0 10px;
    line-height: 47px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    text-align: center;
    color: #fff;
    font-size: 16px;
    background-image: url('http://10.0.4.131:4001/examples/img/icon/item-select-192.png');
  }

  .btn.active {
    background-image: url('http://10.0.4.131:4001/examples/img/icon/item-select-192.png');
  }

  .btn.active {
    background-image: url('http://10.0.4.131:4001/examples/img/icon/item-select-active-172.png');
  }
`;
/**
 * 确定的几个场馆数据
 */
const VenueData = {
  HUANG_LONG_GYM: {
    key: 'HUANG_LONG_GYM',
    label: '黄龙体育中心',
    mapInfo: {
      center: [120.12819134470715, 30.26854009610929],
      zoom: 15.994511589659519,
      bearing: 0,
      pitch: 70
    }
  },
  ZI_JIN_GANG_GYM: {
    label: '浙大紫金港体育馆',
    mapInfo: {
      center: [120.08412283268694, 30.308495518808286],
      zoom: 15.994511589659519,
      bearing: 0,
      pitch: 70
    }
  },
  XI_HU_GAO_ER_FU: {
    label: '西湖国际高尔夫球场',
    mapInfo: {
      center: [120.05960188395579, 30.171950296628893],
      zoom: 15.527235151771048,
      bearing: 0,
      pitch: 70
    }
  },
  ZHE_GONG_DA_SPORT: {
    label: '浙工大板球运动场',
    mapInfo: {
      center: [120.0303997659895, 30.228830773887864],
      zoom: 16.0915268715911,
      bearing: 0,
      pitch: 70
    }
  }
};
const ALL_3D_MODAL_DATA = [
  {
    url: `/westlake-urban-flooding/BIM/huanglong.glb`,
    position: [8833, 1, -7441],
    scale: [1, 1.2, 1],
    center: [120.128818, 30.268279],
    type: 'glb',
    name: '黄龙体育中心',
    priority: 2,
    loadingKey: 'HUANG_LONG_GYM'
  }
  // {
  //   url: `/westlake-urban-flooding/BIM/zjg.glb`,
  //   position: [4440.643005481062, 1, -11960.70832995625],
  //   scale: [3.5, 5.5, 3.5],
  //   type: 'glb',
  //   name: '浙大紫金港体育馆',
  //   priority: 4,
  //   loadingKey: 'ZI_JIN_GANG_GYM'
  // },
  // {
  //   url: `/westlake-urban-flooding/BIM/BM/gao-1113.glb`,
  //   position: [2078.662620081755, 1, 3240.6034758134892],
  //   scale: [0.68, 0.68, 0.68],
  //   type: 'glb-tree',
  //   name: '高尔夫球场',
  //   priority: 50,
  //   loadingKey: 'XI_HU_GAO_ER_FU'
  // },
  // {
  //   url: `/westlake-urban-flooding/BIM/pingfen.glb`,
  //   position: [-727.3095900661775, 1, -3084.089734797413],
  //   scale: [1.1, 1.5, 1.1],
  //   type: 'glb',
  //   name: '浙工大板球场',
  //   priority: 100,
  //   loadingKey: 'ZHE_GONG_DA_SPORT'
  // }
];
// source 不分先后
let sources: mapboxgl.Sources = {
  bg: {
    type: 'raster',
    // "scheme": "tms",
    tiles: [
      // 影像底图
      `http://10.0.4.131:4001/westlake-urban-flooding/Layer/img_w/dark/{z}/{x}/{y}.png`
    ],
    // 指定范围可避免超出地图范的请求
    //  bounds:[116.974010467529,36.584987640381 ,117.252101898193,36.433753967285],
    // bounds:[118.1835307540926152,28.9892543570044587 , 119.4671989401006016,30.1906186535410797],

    tileSize: 256,
    maxzoom: 18
    // minzoom:8
  },
  xihu: {
    data: 'http://10.0.4.131:4001/examples/json/geojson/adminScope_0.geojson',
    type: 'geojson'
  },
  xihu_BM: {
    type: 'vector',
    scheme: 'tms',
    tiles: [
      `http://10.0.4.131:4001/westlake-urban-flooding/Garagekit/{z}/{x}/{y}.pbf`
    ],
    minzoom: 10,
    maxzoom: 18
  }
};
// layers   靠后的在上面，和css一样后来居上
let layers: mapboxgl.AnyLayer[] = [
  {
    type: 'raster',
    id: 'bg',
    source: 'bg'
  },
  {
    id: 'edge',
    type: 'line',
    source: 'xihu',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#8ce5ff',
      'line-width': 2
    }
  },
  {
    id: 'fill',
    type: 'fill',
    source: 'xihu',
    layout: {},
    paint: {
      'fill-color': 'rgba(68, 198, 251,0.8)',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.8,
        0.3
      ]
    }
  },
  {
    id: 'xi-building',
    source: 'xihu_BM',
    'source-layer': 'xihucut', // 这个名称对应数据链接的source-layer名称
    type: 'fill-extrusion',
    paint: {
      'fill-extrusion-color': [
        'interpolate',
        ['linear'],
        ['get', 'height'],
        0,
        'rgba(184,234,255,0.8)',
        75,
        'rgba(184,234,255,0.8)',
        150,
        'rgba(184,234,255,0.8)'
      ],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-opacity': 0.7
    }
  }
];
let defaultSet: MapDTEOptions = {
  // container:'domid',
  zoom: 14,
  pitch: 45, // 俯角，0-85   0是完全俯视图
  bearing: 45, // 初始方位，从北方逆时针旋转
  center: [120.09457420602212, 30.153840721214266], //longitude 经度（竖线）, latitude 纬度（横线）
  maxZoom: 20,
  minZoom: 3,
  style: {
    sources,
    layers,
    glyphs: 'http://10.0.4.131:4001/glyphs/{fontstack}/{range}.pbf',
    version: 8
  },
  terrainHeight: 1, // 高程拉伸系数 默认是1
  // terrainBounds:[111.8847656250000000,31.9746780395507813 , 114.1094970703125000,33.1842041015625000],
  terrain: false
};

const imgLoader = new core.TextureLoader();
const addBIM2Map = (container: string) => {
  let domContainer = document.getElementById(container);
  const DTEOptions: MapDTEOptions = {
    container,
    ...defaultSet
    // terrain:false,
  };
  const res: { gui?: GUI; map: mapboxgl.Map } = {};
  // 初始化地图
  getMapController(DTEOptions).then(
    async (map: mapboxgl.Map & MapDTEController) => {
      res.map = map;
      res.gui = new GUI({ container: domContainer });
      let mercator = mapboxgl.MercatorCoordinate.fromLngLat(
        [120.03796573209667, 30.201106647390958] // 这个center就是threeLayer的center
      );
      const threeLayer = new CommonLayer({
        map,
        center: [120.03796573209667, 30.201106647390958],
        id: 'three'
      });

      imgLoader.load(
        'http://10.0.4.131:4001/examples/Skybox/whiteEnv.png',
        texture => {
          texture.mapping = core.EquirectangularReflectionMapping;
          threeLayer.scene.environment = texture;
        }
      );

      ALL_3D_MODAL_DATA.forEach(item => {
        //  在只知道经纬度的情况下，通过下面这种方式转换直角坐标，
        /*  const center = VenueData[item.loadingKey].mapInfo.center;
      const position =  TerrainUtils.coordinateTransformXY( center[0], center[1],mercator);
      */
        threeLayer
          .addBIM({
            position: item.position,
            rotation: [0, 0, 0],
            scale: item.scale,
            url: 'http://10.0.4.131:4001/' + item.url,
            name: item.name,
            priority: item.priority,
            gui: res.gui, //  模型位置可以同gui做进一步调整。

            editMesh(mesh: core.Mesh) {} // 这个方法会递归遍历模型中所有的mesh
          })
          .then(model => {
            //  这里才是整个模型的引用
          });
      });

      map.on('click', e => {
        console.log(e.lngLat.lng, e.lngLat.lat, e);
      });

      const guiOpt = {
        fullscreen() {
          if (!document.fullscreenElement) {
            domContainer.requestFullscreen();
          }
        }
      };

      res.gui.add(guiOpt, 'fullscreen');

      map.on('click', e => {
        console.log(e.lngLat.lng, e.lngLat.lat, e);
      });
      return map;
    }
  );
  return res;
};
const Start: React.FC<any> = () => {
  const mapInfo = useRef({});
  const [activeBtn, udpateActiveBtn] = useState('默认视角');
  useEffect(() => {
    const res = addBIM2Map('dte');
    mapInfo.current = res;
    return () => {
      res?.map?.remove();
    };
  }, []);
  const handleMapFly = useCallback((item: { loadingKey: string }) => {
    const { map } = mapInfo.current;
    if (!map) return;
    map.flyTo({
      ...VenueData[item.loadingKey].mapInfo,
      // speed: 1,
      // curve: 1,
      // easing: (t) => t,
      essential: true
    });
  }, []);
  return (
    <Wrapper>
      <div id="dte" style={{ height: 'calc(100vh - 4px)' }}>
        <div className="bottom-bar">
          {ALL_3D_MODAL_DATA.map(item => (
            <div
              className={activeBtn === item.loadingKey ? 'btn  active' : 'btn'}
              key={item.loadingKey}
              onClick={() => handleMapFly(item)}>
              {item.name}
            </div>
          ))}
          <div
            className="btn"
            onClick={() => {
              mapInfo.current.map?.flyTo({
                zoom: 10.5,
                pitch: 0, // 俯角，0-85   0是完全俯视图
                bearing: -13.39999999999975, // 初始方位，从北方逆时针旋转
                center: [120.03796573209667, 30.201106647390958], //longitude 经度（竖线）, latitude 纬度（横线）
                essential: true
              });
            }}>
            恢复默认视角
          </div>
          <div
            className="btn"
            onClick={() => {
              historys.push('/hlyb', true);
            }}>
            返回主平台
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Start;
