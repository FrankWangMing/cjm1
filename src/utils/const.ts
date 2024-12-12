import { MenuListProp } from '@/domain/menu';
import { IRiskItem } from '@/domain/valley';
import moment, { Moment } from 'moment';

/**
 * 定义一些全局都将使用到的常量
 */
export const JWT_TOKEN_KEY = 'TOKEN';
/**
 * 天地图的token，企业账号
 */
export const TDT_TOKEN = '5d82ea252b9bcd7c70a48697f2f14a5a';
/**
 * mapbox的token，bin_wang;
 */
// export const MAPBOX_TOKEN = "pk.123"
//  =
export const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYmlud25hZyIsImEiOiJjbDE0ZXB5ZGgwOXVhM2RvamNtd2JiZGxrIn0.sEVbroN0zj4ztS1AputKCQ';

/**
 * 标题等可以配置的内容
 */
export const TITLE = {
  title: '沁水县水利',
  header_title: '沁水县水利数字孪生平台',
  subTitle: '沁水县'
  // whichRiver: '（武强溪）'
};
/**
 * 菜单栏数据
 */
export const MENU_LIST: MenuListProp[] = [
  // {
  //   title: '四预一张图',
  //   routerPath: '/slyzt',
  //   isHaveColorBar: false,
  //   position: 'left'
  // },
  {
    title: '精准预报', //洪涝预报
    routerPath: '/hlyb',
    isHaveColorBar: true,
    position: 'left'
  },
  {
    title: '智能预警', //风险预警
    routerPath: '/fxyj',
    isHaveColorBar: false,
    position: 'left'
  },
  {
    title: '沉浸预演', //情景预演
    routerPath: '/yyfp',
    isHaveColorBar: true,
    position: 'right'
  },
  {
    title: '标准预案', //联动预案
    routerPath: '/ldya',
    isHaveColorBar: true,
    position: 'right'
  }
];

/**
 * 所有图片的链接
 */
export const IMG_PATH = {
  ldyalefttable: '/images/ldyalefttable.png',
  layout: {
    header: {
      bgImg: '/images/layout/header/layout_header_top_bg_1.svg',
      leftTab: '/images/layout/header/layout_header_top_leftTab.png',
      rightTab: '/images/layout/header/layout_header_top_rightTab.png',
      leftTabSelected:
        '/images/layout/header/layout_header_top_LeftTab_selected.png',
      rightTabSelected:
        '/images/layout/header/layout_header_top_rightTab_selected.png'
    },
    titleBg: '/images/layout/title_bg.png',
    side: {
      open: '/images/layout/close.svg',
      close: '/images/layout/open.svg'
    },
    center: {
      tab: '/images/layout/center/sub_tab.svg',
      tabSelected: '/images/layout/center/sub_tab_selected.svg',
      bottomTab: '/images/layout/center/sub_tab_bottom_tab.png',
      bottomTabSelected: '/images/layout/center/sub_tab_bottom_tab_selected.png'
    },
    bigger: '/images/layout/bigger.svg'
  },
  riskLevel: {
    1: '/images/icons/risk_1.png',
    2: '/images/icons/risk_2.png',
    3: '/images/icons/risk_3.png',
    0: '/images/icons/risk_0.png'
  },
  riskLevelMarker: {
    1: '/images/icons/riskMaker_1.svg',
    2: '/images/icons/riskMaker_2.svg',
    3: '/images/icons/riskMaker_3.svg',
    0: '/images/icons/riskMaker_0.svg'
  },
  markerNameBck: {
    1: '/images/icons/markerNameBck_1.png',
    2: '/images/icons/markerNameBck_2.png',
    3: '/images/icons/markerNameBck_2.png',
    0: '/images/icons/markerNameBck_0.png'
  },
  overview: {
    villageExpand: '/images/overview/village_expand.svg',
    // blockFace: '/images/overview/block-face.svg'
    blockFace: '/images/overview/block-face.svg'
  },
  icon: {
    radioIcon: '/images/icons/radioIcon.svg',
    radioInner: '/images/icons/radioInner.png',
    search: '/images/icons/search.png',
    modalTabSelected: '/images/icons/modal-tab-selected.png',
    modalTabUnSelected: '/images/icons/modal-tab-unselected.png',
    defaultView: '/images/icons/default_view.png',
    switch2D: '/images/icons/switch2D.png',
    switch3D: '/images/icons/switch3D.png',
    compass: 'images/icons/compass.svg',
    cityManage: 'images/icons/cityManage.svg',
    emergencyManage: 'images/icons/emergencyManage.svg',
    transManage: 'images/icons/transManage.svg',
    weatherManage: 'images/icons/weatherManage.svg',
    attendance_rescue_team: 'images/icons/attendance_rescue_team.svg', // 出勤救援队伍
    settlement_point_enabled: 'images/icons/settlement_point_enabled.svg', // 已启用安置点
    manager_arrive_rate: 'images/icons/manager_arrive_rate.svg', // 责任人到岗率
    totalTrans: 'images/icons/totalTrans.svg', // 总转移
    safe_transfer: 'images/icons/safe_transfer.png', // 建议无转移
    immediate_transfer: 'images/icons/immediate_transfer.png', // 建议立即转移
    immediate_transfer_arrow: 'images/icons/immediate_transfer_arrow.svg', // 建议立即转移
    prepare_transfer: 'images/icons/prepare_transfer.png', // 建议准备转移
    prepare_transfer_arrow: 'images/icons/prepare_transfer_arrow.svg', // 建议准备转移
    textTitle: 'images/icons/text_title.svg', // 文字标题
    edit: 'images/icons/edit.svg',
    confirm: 'images/icons/confirm.svg',
    confirm_waiting: '/images/icons/confirm_waiting.png',
    cancel: 'images/icons/cancel.svg',
    delete: 'images/icons/delete.svg',
    exitYanshi: 'images/icons/exit-yanshi.svg', // 退出演示
    inYanshi: 'images/icons/in-yanshi.svg', // 退出演示
    fanhui: 'images/icons/fanhui.svg', //返回
    open3DTile: 'images/icons/open3dtile.svg', // 打开倾斜摄影
    close3DTile: 'images/icons/close3dtile.svg', // 关闭倾斜摄影
    floodArea: '/images/icons/floodArea.png',
    risk_info_0: '/images/icons/risk_info_0.svg',
    risk_info_1: '/images/icons/risk_info_1.svg',
    risk_info_2: '/images/icons/risk_info_2.svg',
    risk_info_3: '/images/icons/risk_info_3.svg',
    alarm_red: '/images/icons/alarm_red.svg',
    zhongZhou: '/images/icons/中洲镇.png',
    fenKou: '/images/icons/汾口镇.png',
    rain: '/images/icons/rain.png',
    //todo920
    rainWarn: 'images/icons/rainWarn.svg', //雨量预警
    gaugingWarn: 'images/icons/gaugingWarn.svg', //水位预警
    riverWarn: 'images/icons/riverWarn.svg' //河道预警
  },
  process: {
    play: '/images/process/play.png',
    front: '/images/process/front.png',
    back: '/images/process/back.png',
    replay: '/images/process/replay.png',
    pause: '/images/process/pause.png'
  },
  damBg: '/images/dam_bg.png',
  damBgWithLine: '/images/dam_bg_withLine.png',
  markerIcon: {
    RAINFALL_STATION: '/images/markerIcon/RAINFALL_STATION.svg',
    RAINFALL_STATION_3Level: '/images/markerIcon/RAINFALL_STATION_3Level.svg',
    RAINFALL_STATION_2Level: '/images/markerIcon/RAINFALL_STATION_2Level.svg',
    RAINFALL_STATION_1Level: '/images/markerIcon/RAINFALL_STATION_1Level.svg',
    GAUGING_STATION_RIVER: '/images/markerIcon/GAUGING_STATION_RIVER.svg',
    GAUGING_STATION_RIVER_3Level:
      '/images/markerIcon/GAUGING_STATION_RIVER_3Level.svg',
    GAUGING_STATION_RIVER_2Level:
      '/images/markerIcon/GAUGING_STATION_RIVER_2Level.svg',
    GAUGING_STATION_RIVER_1Level:
      '/images/markerIcon/GAUGING_STATION_RIVER_1Level.svg',
    GAUGING_STATION_RESERVOIR:
      '/images/markerIcon/GAUGING_STATION_RESERVOIR.svg',
    GAUGING_STATION_RESERVOIR_3Level:
      '/images/markerIcon/GAUGING_STATION_RESERVOIR_3Level.svg',
    GAUGING_STATION_RESERVOIR_2Level:
      '/images/markerIcon/GAUGING_STATION_RESERVOIR_2Level.svg',
    GAUGING_STATION_RESERVOIR_1Level:
      '/images/markerIcon/GAUGING_STATION_RESERVOIR_1Level.svg',
    MONITOR_STATION: '/images/markerIcon/MONITOR_STATION.svg',
    IMPORTANT_VILLAGE: '/images/markerIcon/IMPORTANT_VILLAGE.png',
    RESERVOIR_STATION: '/images/markerIcon/RESERVOIR_STATION.svg',
    EMBANKMENT_STATION: '/images/markerIcon/EMBANKMENT_STATION.svg',
    PONDS_STATION: '/images/markerIcon/PONDS_STATION.svg',
    FLOW_STATION: '/images/markerIcon/flowStation.svg',
    shelter: '/images/markerIcon/shelter.svg', //避灾安置点icon
    warehouse: '/images/markerIcon/warehouse.svg', //防汛物资仓库
    goverment: '/images/markerIcon/goverment.png'
  },
  dashboard: '/images/仪表盘.svg',
  selectedBg5: '/images/selected_bg5.svg',
  selectedBg1: '/images/selected_bg1.svg',
  selectedBg2: '/images/selected_bg2.svg',
  selectedBg3: '/images/selected_bg3.svg',
  selectedButton: '/images/selected_button.png',
  selectedButton2: '/images/selected_button2.png',
  selectedButton3: '/images/selected_button3.png',
  buttonBg: '/images/button_bg.png',
  buttonBg1: '/images/button_bg1.png',
  buttonBg2: '/images/button_bg2.png',
  buttonBg3: '/images/button_bg3.png',

  // 水深流速组合风险判断结果表
  riskDescTable1: '/images/riskDescTable1.png',
  riskDescTable2: '/images/riskDescTable2.png',
  // 堤坝折线图片map
  dibaLine: '/images/diba-line.png',
  // 水利一张图 -
  noRisk_slyzt: '/images/norisk_slyzt.png',
  echartHandle: '/images/echartHandle.svg'
};

export const RISK_MAP = {
  SELECT_RISK_LEVEL: [
    { label: '一级', value: 1 },
    { label: '二级', value: 2 },
    { label: '三级', value: 3 },
    { label: '无风险', value: 0 }
  ],
  RISKLEVEL_DESC_MAP: {
    0: '无风险',
    1: '一级风险',
    2: '二级风险',
    3: '三级风险'
  },
  VALUE_LIST: [0, 1, 2, 3],
  COLOR_LEVEL: {
    1: {
      bgColor: '#FF0000',
      name: '一级'
    },
    2: {
      bgColor: '#FF7700',
      name: '二级'
    },
    3: {
      bgColor: '#FFF100',
      name: '三级'
    },
    0: {
      bgColor: '#5af901',
      name: '无'
    }
  }
};

export const getForecastTime = (
  currTime: Moment,
  forecastTime: number,
  forecastType: 'h' | 'minute' | 'd'
): { startTime: Moment; endTime: Moment } => {
  let currNum = Number(moment(currTime).format('mm')); // 当前时间分钟数
  let distanceOfHalfClock = currNum - 30;
  let startTime, endTime;
  if (distanceOfHalfClock < 0) {
    // 半点之前 就是半点+预见期
    startTime = moment(currTime).format('YYYY/MM/DD HH:30');
    endTime = moment(currTime)
      .add(forecastType, forecastTime)
      .format('YYYY/MM/DD HH:30');
  } else {
    startTime = moment(currTime).add('h', 1).format('YYYY/MM/DD HH:00');
    endTime = moment(currTime)
      .add(forecastType, forecastTime + 1)
      .format('YYYY/MM/DD HH:00');
  }
  return {
    startTime: moment(startTime),
    endTime: moment(endTime)
  };
};

/**
 * 获取数值的最大最小值
 * @param type max | min
 * @param data 数组的属性值里面一定有value
 * @returns
 */
export const getMaxMin = (type: 'max' | 'min', data) => {
  return Math[type].apply(
    Math,
    data.map(item => {
      return item.value != undefined ? item.value : 0;
    })
  );
};

/**
 * 风险等级排序
 * @param tempRiskList
 * @returns
 */
export function sortData(tempRiskList): IRiskItem[] {
  if (tempRiskList) {
    let risk0 = tempRiskList.filter(item => {
      return item.riskLevel == 0;
    });
    let risk1 = tempRiskList.filter(item => {
      return item.riskLevel == 1;
    });
    let risk2 = tempRiskList.filter(item => {
      return item.riskLevel == 2;
    });
    let risk3 = tempRiskList.filter(item => {
      return item.riskLevel == 3;
    });

    return [].concat(risk1).concat(risk2).concat(risk3).concat(risk0);
  } else {
    return [];
  }
}

// 图标的虚线以及坐标相关设置
export const CHART_DATA = {
  axis: {
    grid: {
      line: {
        style: {
          stroke: 'rgba(255,255,255,0.3)',
          lineWidth: 1,
          lineDash: [4, 4]
        }
      },
      alignTick: true
    },
    label: {
      style: {
        fill: '#ffffff' // 文本的颜色
      }
    },
    line: {
      style: {
        stroke: '#ffffff',
        fill: '#ffffff'
      }
    }
  }
};

/**
 * 物理量控制器
 */
export const PHYSICAL_KEYWORDS = {
  水深: 'WATER DEPTH',
  流速: 'SCALAR VELOCITY',
  历时: 'DURATION',
  最大水深: 'WATER DEPTH_maximum'
};
export const IntervalForecastTimeMap = {
  1: 4,
  3: 9,
  6: 14,
  12: 34,
  24: 64
};

/**
 * 静态文件路径
 */
export const StaticDirUrl = {
  geo_ca: 'api/resource/staticDir/geo_ca_4326.json.gz',
  mesh: 'api/resource/staticDir/mesh.json.gz',
  // coarse_geo_ca: 'api/resource/staticDir/geo_ca_coarse_4326.json.gz',
  // coarse_mesh: 'api/resource/staticDir/mesh_coarse.json.gz',
  coarse_geo_ca: 'api/resource/staticDir/geo_ca_4326.json.gz',
  coarse_mesh: 'api/resource/staticDir/mesh.json.gz',
  duration: 'floodedduration.json.gz',
  maxDepth: 'waterdepthmax.json.gz'
};

export const DingDingPageRouter = [
  '/dingding',
  '/pdfpreview',
  '/login',
  '/dealbrief',
  '/unitTest',
  '/updatePasswd'
];

export const deepClone = e => {
  return JSON.parse(JSON.stringify(e));
};

export const ForecastTimeIntervalMap = {
  1: 5,
  3: 1,
  6: 3,
  12: 5,
  24: 10
};
/**
 * 演示模式固定工况
 */
export const ShowModeProjectId = 99;

export const ShowModeTime = moment('2023-01-01 00:00:00');
// 前端界面显示时间
export const ShowModeUITime = moment('2019-07-18 09:00:00');
// 前后端交互时间格式
export const MomentFormatStr = 'YYYY-MM-DD HH:mm:ss';
// 图层ID
export const MapboxLayerId = {
  resultLayerId: '3d-model-layer-id', // 结果文件图层id
  tileId: '3d-model-3dtile', // 倾斜摄影图层id
  mapLineId: 'line-source'
};

/**
 * 缩放高程等级
 */
export const DEPTH_AMPLITUDE = {
  map_exaggeration: 1, // 地图3维高程
  tile_exaggeration: 0.1, // 地图3维高程
  result_bottomAmplitude: 1, // 结果文件
  ['3dTile']: 1 // 3d图层
};
// export const DEPTH_AMPLITUDE = {
//   map_exaggeration: 3, // 地图3维高程
//   result_bottomAmplitude: 3, // 结果文件
//   ['3dTile']: 0.95 // 3d图层
// };
export const SectionColorMap = {
  预测流量: '#c180ff',
  预测流量2: '#ff3bf8',
  降雨量: '#03ffff',
  河堤高程: '#f2f2f2',
  预测水位: '#0000bf',
  预测水位2: '#1369bf',
  准备转移水位: '#ff9400',
  立即转移水位: '#ed0000'
};

export const SectionLegendKeyList = [
  [
    {
      key: '预测流量',
      unit: '（m³/s）'
    },
    {
      key: '降雨量',
      unit: '（mm）'
    },
    {
      key: '河堤高程',
      unit: '（m）'
    }
  ],
  [
    {
      key: '预测水位',
      unit: '（m）'
    },
    {
      key: '准备转移水位',
      unit: '（m）'
    },
    {
      key: '立即转移水位',
      unit: '（m）'
    }
  ]
];

/**
 * 地图倾斜摄影数据
 * 配置项
 */
export const villageTileInfo: {
  index: number;
  center: [number, number];
  layerId: string;
  render3dtileParam: {
    scaleUP: number;
    offset: number;
    msse: number;
    scaleXY: number;
    disposeEND: boolean;
    threshold?: number;
    intensity?: number;
  };
  tilePath: string;
  tilePosition: [number, number, number];
}[] = [
  {
    index: 1,
    layerId: 'village-3dtile-qiangchuankan',
    center: [118.56253, 29.41663],
    render3dtileParam: {
      scaleUP: 1,
      offset: -2,
      msse: 24,
      scaleXY: 1.03,
      disposeEND: false,
      intensity: 1.4,
      threshold: 0.7
    },
    // tilePath: 'http://10.0.1.66:4000/chunan/QCZ-3dtiles-0523/tileset.json',
    tilePath:
      'https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/chunan/QCZ-3dtiles-0523/tileset.json',
    // tilePosition: [0, 173.85, 0],
    // tilePosition: [0, 46 - 2, 0]
    tilePosition: [0, 65.5, 0]
  },
  {
    index: 2,
    layerId: 'village-3dtile-sheduncun',
    center: [118.547296, 29.446508],
    render3dtileParam: {
      scaleUP: 1,
      offset: -2,
      msse: 24,
      scaleXY: 1.03,
      disposeEND: false,
      intensity: 1.4,
      threshold: 0.7
    },
    // tilePath: 'http://10.0.1.66:4000/chunan/SDC-3dtiles/tileset.json',
    tilePath:
      'https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/chunan/SDC-3dtiles-0530/tileset.json',
    //  tilePosition: [0, 149.35, 0],
    // tilePosition: [0, 30 - 2, 0]
    tilePosition: [0, 42.5, 0]
  },
  {
    index: 3,
    layerId: 'village-3dtile-hongxingcun',
    center: [118.56695, 29.4255],
    render3dtileParam: {
      scaleUP: 1,
      offset: -2,
      msse: 24,
      scaleXY: 1.03,
      disposeEND: false,
      intensity: 1.4,
      threshold: 0.7
    },
    // tilePath: 'http://10.0.1.66:4000/chunan/CWH-3dtiles/tileset.json',
    tilePath:
      'https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/chunan/CWH-3dtiles-0530/tileset.json',
    // tilePosition: [0, 163, 0]
    // tilePosition: [0, 48.1 - 2, 0]
    tilePosition: [0, 61.5, 0]
  },
  {
    index: 4,
    layerId: 'village-3dtile-shuinancunweihui',
    center: [118.548371, 29.42836],
    render3dtileParam: {
      scaleUP: 1,
      offset: -2,
      msse: 24,
      scaleXY: 1.03,
      disposeEND: false,
      intensity: 1.6,
      threshold: 0.7
    },
    // tilePath: 'http://10.0.1.66:4000/chunan/NCWH-3dtiles/tileset.json',
    tilePath:
      'https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/chunan/NCWH-3dtiles-0530/tileset.json',
    // tilePosition: [0, 137.2, 0]
    // tilePosition: [0, 26.6 - 2, 0]
    tilePosition: [0, 37, 0]
  },
  {
    index: 5,
    layerId: 'village-3dtile-fenkoucunweihui',
    center: [118.53729, 29.42923],
    render3dtileParam: {
      scaleUP: 1,
      offset: -2,
      msse: 24,
      scaleXY: 1.03,
      disposeEND: false,
      intensity: 1.3,
      threshold: 0.7
    },
    // tilePath: 'http://10.0.1.66:4000/chunan/S-3dtiles/tileset.json',
    // tilePath: 'http://10.0.1.66:4000/chunan/S-zip-3dtiles/tileset.json',
    tilePath:
      'https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/chunan/S-3dtiles/tileset.json',
    // tilePosition: [0, 161.5, 0]
    tilePosition: [0, 56, 0]
  }
];

/**
 * 分段切开的53个村庄的倾斜摄影p1-p6
 */
export const sixTileInfo: {
  index: number;
  center: [number, number];
  layerId: string;
  tilePath: string;
  tilePosition: [number, number, number];
  render3dtileParam: any;
}[] = [
  {
    index: 1,
    layerId: '3dSNC',
    center: [118.5483, 29.42862],
    tilePath: 'http://10.0.4.131:4001/ca/3dSNC/tileset.json',
    tilePosition: [0, 128, 0],
    render3dtileParam: {
      scaleUP: 1,
      offset: 0,
      msse: 24,
      scaleXY: 1,
      disposeEND: false,
      intensity: 0,
      threshold: 0.8
    }
  },
  {
    index: 2,
    layerId: '3dHXC',
    center: [118.567128, 29.425382],
    tilePath: 'http://10.0.4.131:4001/ca/3dHXC/tileset.json',
    // tilePosition: [0, 144.5, 0],
    tilePosition: [0, 155.5, 0],
    render3dtileParam: {
      scaleUP: 1,
      offset: 0,
      msse: 24,
      scaleXY: 1,
      disposeEND: false,
      intensity: 0,
      threshold: 0.8
    }
  },
  {
    index: 3,
    layerId: '3dSDC',
    center: [118.5473, 29.44668],
    tilePath: 'http://10.0.4.131:4001/ca/3dSDC/tileset.json',
    tilePosition: [0, 140, 0],
    render3dtileParam: {
      scaleUP: 1,
      offset: 0,
      msse: 24,
      scaleXY: 1,
      disposeEND: false,
      intensity: 0,
      threshold: 0.8
    }
  },
  {
    index: 4,
    layerId: '3dFKZS',
    center: [118.53725, 29.42935],
    tilePath: 'http://10.0.4.131:4001/ca/3dFKZS/tileset.json',
    tilePosition: [0, 153, 0],
    render3dtileParam: {
      scaleUP: 1,
      offset: 0,
      msse: 24,
      scaleXY: 1,
      disposeEND: false,
      intensity: 0,
      threshold: 0.8
    }
  },
  {
    index: 5,
    layerId: '3dQSKC',
    center: [118.56243, 29.4164],
    tilePath: 'http://10.0.4.131:4001/ca/3dQSKC/tileset.json',
    tilePosition: [0, 163.5, 0],
    render3dtileParam: {
      scaleUP: 1,
      offset: 0,
      msse: 24,
      scaleXY: 1,
      disposeEND: false,
      intensity: 0,
      threshold: 0.8
    }
  }
  // 完整倾斜摄影
  // {
  //   index: 3,
  //   layerId: 'chunan-3dtile-all',
  //   center: [118.50017, 29.42508],
  //   tilePath:
  //     // 'https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/3dtiles/ChunAn-cut-0328/tileset.json',
  //     'https://cae-static-1252829527.cos.ap-shanghai.myqcloud.com/CAEGIS/3dtiles/3dtile-11-15/tileset.json',
  //   tilePosition: [0, 615, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // }
  // // p3 done
  // {
  //   index: 3,
  //   layerId: 'section-3dtile-p3',
  //   center: [118.518371, 29.4239323],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p3/tileset.json',
  //   tilePosition: [0, 143, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // // p4 done
  // {
  //   index: 4,
  //   layerId: 'section-3dtile-p4',
  //   center: [118.53142, 29.404239],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p4/tileset.json',
  //   tilePosition: [0, 139, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // // done
  // {
  //   index: 5,
  //   layerId: 'section-3dtile-p5',
  //   center: [118.562934, 29.468674],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p5/tileset.json',
  //   tilePosition: [0, 137, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // // done
  // {
  //   // DONE
  //   index: 6.1,
  //   layerId: 'section-3dtile-p6.1',
  //   center: [118.53009, 29.36951],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p6.1/tileset.json',
  //   tilePosition: [0, 317, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // // DONE
  // {
  //   index: 6.2,
  //   layerId: 'section-3dtile-p6.2',
  //   center: [118.577141, 29.395132],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p6.2/tileset.json',
  //   tilePosition: [0, 140, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // {
  //   index: 6.3,
  //   layerId: 'section-3dtile-p6.3',
  //   center: [118.577819, 29.35192],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p6.3/tileset.json',
  //   tilePosition: [0, 212, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // {
  //   // done
  //   index: 1.1,
  //   layerId: 'section-3dtile-p1.1',
  //   center: [118.3946, 29.463142],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p1.1/tileset.json',
  //   tilePosition: [0, 285, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // {
  //   // done
  //   index: 1.2,
  //   layerId: 'section-3dtile-p1.2',
  //   center: [118.45414, 29.48179],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p1.2/tileset.json',
  //   tilePosition: [0, 192, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // {
  //   // done
  //   index: 2.1,
  //   layerId: 'section-3dtile-p2.1',
  //   center: [118.485505, 29.450987],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p2.1/tileset.json',
  //   tilePosition: [0, 178, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // },
  // {
  //   // done
  //   index: 2.2,
  //   layerId: 'section-3dtile-p2.2',
  //   center: [118.453289, 29.389867],
  //   tilePath: 'http://10.0.1.66:4000/chunan/0630fenduan/p2.2/tileset.json',
  //   tilePosition: [0, 196, 0],
  //   render3dtileParam: {
  //     scaleUP: 1,
  //     offset: 0,
  //     msse: 24,
  //     scaleXY: 1,
  //     disposeEND: true,
  //     intensity: 0,
  //     threshold: 0
  //   }
  // }
];
