import { IMG_PATH } from '@/utils/const';

// 雨量站 - 各种状态传递 -- 只有警戒，产品说只要区分两种就ok
export const STATUS_COLOR_MAP = {
  3: {
    icon: IMG_PATH.icon.alarm_red,
    bgColor:
      'linear-gradient(270deg, rgba(75,11,14,0.7) 0%, rgba(255,77,86,0.5) 100%)'
  }
};
// 水位站-水库站 -- 超汛限状态
export const STATUS_COLOR_MAP_Reservoir = {
  3: {
    icon: IMG_PATH.icon.alarm_red,
    bgColor:
      'linear-gradient(270deg, rgba(75,11,14,0.7) 50%, rgba(255,77,86,0.5) 100%)'
  }
};

// 水位站-河道站 -- 超警戒·
// （0: 正常，1: 超警戒，2: 超保证）
export const STATUS_COLOR_MAP_River = {
  1: {
    icon: IMG_PATH.icon.alarm_red,
    bgColor:
      'linear-gradient(270deg, rgba(207,196,12,0.5) 0%, rgba(255,241,0,0.5) 100%)'
  },
  2: {
    icon: IMG_PATH.icon.alarm_red,
    bgColor:
      'linear-gradient(270deg, rgba(186,92,9,0.6) 0%, rgba(255,119,0,0.5) 100%)'
  }
};

export const SCOPE_LIST = [
  {
    id: 'river-range',
    url: 'geojson/河道范围.geojson',
    paintArea: {
      'fill-color': '#40F7F0',
      'fill-opacity': 0.8
    },
    type: 'area'
  },
  {
    id: 'wuqiang-range',
    url: 'geojson/武强溪流域1.geojson',
    paintLine: {
      'line-color': '#579AE6',
      'line-width': 5,
      'line-opacity': 0.8
    },
    type: 'line'
  }
  // {
  //   id: 'section-range',
  //   url: 'geojson/虚拟断面流域范围.geojson',
  //   paintLine: {
  //     'line-color': '#f2bbb2',
  //     'line-width': 7,
  //     'line-opacity': 0.8
  //   },
  //   paintArea: {
  //     'fill-color': 'red',
  //     'fill-opacity': [
  //       'case',
  //       ['boolean', ['feature-state', 'hover'], false],
  //       0.8,
  //       0.3
  //     ]
  //   },
  //   type: 'area'
  // },
  // {
  //   id: 'substream-range',
  //   url: 'geojson/子流域范围.geojson',
  //   paintLine: {
  //     'line-color': '#bbb2f2',
  //     'line-width': 10,
  //     'line-opacity': 0.8
  //   },
  //   paintArea: {
  //     'fill-color': 'blue',
  //     'fill-opacity': [
  //       'case',
  //       ['boolean', ['feature-state', 'hover'], false],
  //       0.8,
  //       0.3
  //     ]
  //   },
  //   type: 'area'
  // }
];
