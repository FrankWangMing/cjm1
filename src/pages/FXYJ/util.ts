import { LegendComLeftProp } from '@/components/LegendCom';
import { IMarker } from '@/domain/marker';
import { getCSVData } from '@/utils';
import { IMG_PATH } from '@/utils/const';
import { ModalType } from './store';
import GlobalStore from '@/store';
import { map_drawLine } from '@/components/Map';

/**
 * 获取所有点位数据然后形成打点信息;
 */
const formatMarkerData = (
  list:
    | IRainfallStationItem[]
    | IGaugingStationItem[]
    | IEmbankmentStationItem[]
    | IPondsStationItem[]
    | IReservoirStationItem[],
  type: ModalType
): IMarker[] => {
  let resultList: IMarker[] = [];
  let hoverStyle =
    'background-image:linear-gradient(180deg, rgba(0,5,17,0.50) 0%, #282C35 100%);';
  switch (type) {
    // 雨量站
    case 'RAINFALL_STATION':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.stationId,
          longitude: item.longitude,
          latitude: item.latitude,
          type: type,
          icon: ICON_MAP[type][item.status],
          name: item.name,
          data: '雨量：' + Number(item.rain).toFixed(1) + ' mm',
          hoverStyle,
          nameShowCss: { marginTop: -100 + 'rem' }
        };
        resultList.push(tempObj);
      });
      break;
    // 重点村落
    case 'IMPORTANT_VILLAGE':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.id,
          longitude: item.longitude,
          latitude: item.latitude,
          type: type,
          icon: ICON_MAP[type][0],
          name:
            item.town +
            '-' +
            item.administrationVillage +
            '-' +
            item.natureVillage,
          hoverStyle,
          nameShowCss: { marginTop: -100 + 'rem' }
        };
        resultList.push(tempObj);
      });
      // resultList = resultList.concat([
      //   {
      //     id: Math.random(),
      //     longitude: 118.48205919875318,
      //     latitude: 29.440857756166068,
      //     name: '中洲镇人民政府',
      //     type: '',
      //     icon: IMG_PATH.markerIcon.goverment,
      //     nameShowCss: { marginTop: -100 + 'rem' }
      //   },
      //   {
      //     id: Math.random(),
      //     longitude: 118.55359634320536,
      //     latitude: 29.430696990491825,
      //     name: '汾口镇人民政府',
      //     type: '',
      //     icon: IMG_PATH.markerIcon.goverment,
      //     nameShowCss: { marginTop: -100 + 'rem' }
      //   }
      // ]);
      break;
    // 堤防
    case 'EMBANKMENT_STATION':
      list.map(item => {
        let tempObjStart: IMarker = {
          id: item.dikeId,
          latitude: item.startLat,
          longitude: item.startLon,
          type: type,
          icon: IMG_PATH.markerIcon[type],
          name: item.name + '起点',
          hoverStyle,
          nameShowCss: { marginTop: -60 + 'rem' }
        };
        let tempObjEnd: IMarker = {
          id: item.dikeId,
          latitude: item.endLat,
          longitude: item.endLon,
          type: type,
          icon: IMG_PATH.markerIcon[type],
          name: item.name + '终点',
          hoverStyle,
          nameShowCss: { marginTop: -60 + 'rem' }
        };
        resultList.push(tempObjStart, tempObjEnd);
      });
      break;
    // 水位站 - 河道站
    case 'GAUGING_STATION_RIVER':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.stationId,
          longitude: item.longitude,
          latitude: item.latitude,
          type: type,
          icon: ICON_MAP[type][item.status],
          name: item.name,
          data: '水位：' + Number(item.waterLevel).toFixed(2) + ' m',
          hoverStyle,
          nameShowCss: { marginTop: -100 + 'rem' }
        };
        resultList.push(tempObj);
      });
      break;
    // 水位站 - 水库站
    case 'GAUGING_STATION_RESERVOIR':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.stationId,
          longitude: item.longitude,
          latitude: item.latitude,
          type: type,
          icon: ICON_MAP[type][item.status],
          name: item.name,
          hoverStyle,
          nameShowCss: { marginTop: -100 + 'rem' },
          data: '水位：' + Number(item.waterLevel).toFixed(2) + ' m'
        };
        resultList.push(tempObj);
      });
      break;
    // 监控点位
    case 'MONITOR_STATION':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.cameraId,
          longitude: item.longitude,
          latitude: item.latitude,
          type: type,
          icon: IMG_PATH.markerIcon[type],
          name: item.districtName,
          hoverStyle,
          nameShowCss: { marginTop: -100 + 'rem' }
        };
        resultList.push(tempObj);
      });
      break;
    // 山塘
    case 'PONDS_STATION':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.dikeId,
          longitude: item.middleLon,
          latitude: item.middleLat,
          type: type,
          icon: IMG_PATH.markerIcon[type],
          name: item.name,
          hoverStyle,
          nameShowCss: { marginTop: -60 + 'rem' }
        };
        resultList.push(tempObj);
      });
      break;
    // 水库站
    case 'RESERVOIR_STATION':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.reservoirId,
          longitude: item.longitude,
          latitude: item.latitude,
          type: type,
          icon: IMG_PATH.markerIcon[type],
          name: item.name,
          hoverStyle,
          data: '类型：' + item.type,
          nameShowCss: { marginTop: -80 + 'rem' }
        };
        resultList.push(tempObj);
      });
      break;
    // FLOW_STATION 流量站
    case 'FLOW_STATION':
      list.map(item => {
        let tempObj: IMarker = {
          id: item.stationId,
          longitude: item.longitude,
          latitude: item.latitude,
          type: type,
          icon: IMG_PATH.markerIcon[type],
          name: item.name,
          hoverStyle,
          nameShowCss: { marginTop: -60 + 'rem' }
        };
        resultList.push(tempObj);
      });
      break;
  }
  return resultList;
};
// 当前展示的图层为：
const LAYER_LIST: { key: string; title: string }[] = [
  // {
  //   key: 'GENERALIZED_GRAPH',
  //   title: '概化图'
  // },
  // {
  //   key: 'IMPORTANT_VILLAGE',
  //   title: '重点村落'
  // },
  {
    key: 'RAINFALL_STATION',
    title: '雨量站'
  },
  {
    key: 'GAUGING_STATION',
    title: '水位站'
  },
  // {
  //   key: 'FLOW_STATION',
  //   title: '流量站'
  // },
  {
    key: 'MONITOR_STATION',
    title: '视频监控'
  },
  {
    key: 'RESERVOIR_STATION',
    title: '水库'
  }
  // {
  //   key: 'EMBANKMENT_STATION',
  //   title: '堤防'
  // },
  // {
  //   key: 'PONDS_STATION',
  //   title: '山塘'
  // }
];

const LEGEND_MAP: {
  RAINFALL_STATION: LegendComLeftProp;
  GAUGING_STATION: LegendComLeftProp;
} = {
  RAINFALL_STATION: {
    width: 242,
    title: '雨情图例'
  },
  GAUGING_STATION: {
    width: 242,
    title: '水情图例'
  }
};
const ICON_MAP = {
  RAINFALL_STATION: {
    0: IMG_PATH.markerIcon.RAINFALL_STATION,
    1: IMG_PATH.markerIcon.RAINFALL_STATION_1Level,
    2: IMG_PATH.markerIcon.RAINFALL_STATION_2Level,
    3: IMG_PATH.markerIcon.RAINFALL_STATION_3Level
    // 根据状态修正（0：0，1：0-30mm，2：30-50mm，3：>50mm）
  },
  GAUGING_STATION_RIVER: {
    0: IMG_PATH.markerIcon.GAUGING_STATION_RIVER,
    1: IMG_PATH.markerIcon.GAUGING_STATION_RIVER_1Level,
    2: IMG_PATH.markerIcon.GAUGING_STATION_RIVER_2Level,
    3: IMG_PATH.markerIcon.GAUGING_STATION_RIVER_3Level
    // 水位站状态（0：正常，1：超警戒，2：超保证，3：超汛限）
  },
  GAUGING_STATION_RESERVOIR: {
    0: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR,
    1: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR_1Level,
    2: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR_2Level,
    3: IMG_PATH.markerIcon.GAUGING_STATION_RESERVOIR_3Level
    // 水位站状态（0：正常，1：超警戒，2：超保证，3：超汛限）
  },
  IMPORTANT_VILLAGE: {
    0: IMG_PATH.markerIcon.IMPORTANT_VILLAGE
  }
};

/**
 * 获取CSV文件数据得到[x,y,z]数据;
 * @param path 文件路径
 * @returns
 */
const getCreekData = async (
  path: string,
  mapId: {
    source: string;
    layer: string;
  }
) => {
  const csvArr = await getCSVData(path);
  let line_data_arr: [number, number, number][] = [];
  let map_line_data_arr: [number, number][] = [];
  csvArr.map((item: Array<string>, index) => {
    if (index != 0 && item.length > 2) {
      line_data_arr.push([
        Number(item[1]),
        Number(item[2]),
        Number(item[3]) * 1.6 + 1
      ]);
      map_line_data_arr.push([Number(item[1]), Number(item[2])]);
    }
  });
  // if (GlobalStore.isShow3dTile) {
  //   removeMapLineLayer();
  //   // 展示倾斜摄影
  //   GlobalStore.flowLayer3D?.drawBrokeLine(line_data_arr, false);
  // } else {
  // 关闭倾斜摄影
  // if (
  //   GlobalStore.map.getLayer(mapId.layer) == undefined ||
  //   GlobalStore.map.getLayer(mapId.source) == undefined
  // )
  map_drawLine({
    map: GlobalStore.map!,
    coordinatesData: map_line_data_arr,
    id: mapId
  });
  // }
  return {
    line_data_arr: line_data_arr,
    map_line_data_arr: map_line_data_arr
  };
};

/**
 * 清除堤坝在map对象上的划线
 */
const removeMapLineLayer = () => {
  if (GlobalStore.map)
    MapOfLine.map(item => {
      let sourceId = item.id.source;
      GlobalStore.map?.getSource(sourceId) &&
        GlobalStore.map.removeSource(sourceId);
      GlobalStore.map_removeLayerById(item.id.layer);
    });
};

const MapOfLine = [
  {
    path: 'creek_data/long-men_right.csv',
    id: {
      source: 'long-men_right-source',
      layer: 'long-men_right-layer'
    }
  },
  {
    path: 'creek_data/long-men_left.csv',
    id: {
      source: 'long-men_left-source',
      layer: 'long-men_left-layer'
    }
  },
  {
    path: 'creek_data/fen-kou_right.csv',
    id: {
      source: 'fen-kou_right-source',
      layer: 'fen-kou_right-layer'
    }
  },
  {
    path: 'creek_data/fen-kou_left.csv',
    id: {
      source: 'fen-kou_left-source',
      layer: 'fen-kou_left-layer'
    }
  },
  {
    path: 'creek_data/zhong-zhou_right.csv',
    id: {
      source: 'zhong-zhou_right-source',
      layer: 'zhong-zhou_right-layer'
    }
  },
  {
    path: 'creek_data/zhong-zhou_left.csv',
    id: {
      source: 'zhong-zhou_left-source',
      layer: 'zhong-zhou_left-layer'
    }
  },
  {
    path: 'creek_data/dian-men-qian-xi_right.csv',
    id: {
      source: 'dian-men-qian-xi_right-source',
      layer: 'dian-men-qian-xi_right-layer'
    }
  },
  {
    path: 'creek_data/dian-men-qian-xi_left.csv',
    id: {
      source: 'dian-men-qian-xi_left-source',
      layer: 'dian-men-qian-xi_left-layer'
    }
  }
];

export {
  formatMarkerData,
  LAYER_LIST,
  LEGEND_MAP,
  getCreekData,
  MapOfLine,
  removeMapLineLayer
};
