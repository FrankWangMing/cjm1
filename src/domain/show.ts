/**
 * 堤防站点
 * 使用位置：1. 查询所有堤防返回值
 */
interface IEmbankmentStationItem {
  dikeId: number;
  endLat: number;
  endLocation: string;
  endLon: number;
  name: string;
  startLat: number;
  startLocation: string;
  startLon: number;
}
/**
 * 堤防站点详情
 * 使用位置：1. 根据堤防id查询堤防详情返回值
 */
interface IEmbankmentStationDetail {
  floodStandard: string;
  length: number;
  level: string;
  mainFunction: string;
  name: string;
  pattern: string;
  type: string;
}

/**
 * 山塘站点
 * 使用位置：1. 查询所有山塘站点数据
 */
interface IPondsStationItem {
  dikeId: number;
  middleLat: number;
  middleLon: number;
  name: string;
}
/**
 * 山塘站点
 * 使用位置：1. 根据id查询山塘站点详情
 */
interface IPondsStationDetail {
  affeArea: number;
  affePopu: number;
  irrigArea: number;
  location: string;
  mainFunction: string;
  mainRiverLen: number;
  name: string;
  rcdsArea: number;
  totalVol: number;
  type: string;
}

/**
 * 雨量站站点
 * @param usePlace1 查询所有雨量站数据返回值
 */
interface IRainfallStationItem {
  latitude: number;
  longitude: number;
  name: string;
  rain: number;
  stationId: number;
  status: number;
}

/**
 * 雨量站站点详情
 * @param usePlace1 查询所有雨量站点接口返回值
 */
interface IRainfallStationDetail {
  endTime: string;
  name: string;
  rain: number;
  rainArray: { time: string; value: number }[];
  stationId: number;
  startTime: string;
}

/**
 * 水库站站点列表
 * @param usePlace1 查询所有水库站点接口返回值
 */
interface IReservoirStationItem {
  latitude: number;
  longitude: number;
  name: string;
  reservoirId: number;
}

/**
 * 水库站站点详情
 * @param usePlace1 查询所有水库站点详情接口返回值
 */
interface IReservoirStationDetail {
  maxDamHeight: number;
  damTopHeight: number;
  damTopLength: number;
  damTopWide: number;
  designWaterLevel: number;
  checkWaterLevel: number;
  commonReservoirVolume: number;
  commonWaterLevel: number;
  deadWaterLevel: number;
  floodLimitWaterLevel: number;
  highWaterLevel: number;
  mainFunction: string;
  name: string;
  rainArea: number;
  realWaterLevel: number;
  reservoirType: number;
  reservoirVolume: number;
}

/**
 * 水位站站点详情
 * @param usePlace1 查询所有水位站站点详情接口返回值
 */
interface IGaugingStationItem {
  latitude: number;
  longitude: number;
  name: string;
  stationId: number;
  type: string;
  status: number;
  waterLevel: number;
}

interface IGaugingStationDetail {
  alarmWaterLevel: number;
  guaranteeWaterLevel: number;
  name: string;
  realWaterLevel: number;
  realWaterLevelHour: string[];
  type: string;
}

/**
 * 所有河道站
 */
interface IRiverStationItem {
  alarmWaterLevel: number;
  guaranteeWaterLevel: number;
  latitude: number;
  longitude: number;
  name: string;
  realWaterLevel: number;
  stationId: number;
}
interface IRiverStationDetail {
  guaranteeWaterLevel: number;
  name: string;
  realWaterLevel: number;
}

/**
 * 实时警情 返回结果定义
 */
interface IResultRealAlarm {
  rainAlarms: {
    latitude: number;
    longitude: number;
    name: string;
    stationId: number;
  }[];
  reservoirAlarms: {
    latitude: number;
    longitude: number;
    name: string;
    reservoirType: number;
    stationId: number;
  }[];
  riverAlarms: {
    latitude: number;
    longitude: number;
    name: string;
    stationId: number;
  }[];
}

/**
 * 所有河道站
 */
interface IResultRiverStationItem {
  stationId: number;
  name: string;
  longitude: number;
  latitude: number;
  realWaterLevel: number;
  alarmWaterLevel: number;
  guaranteeWaterLevel: number;
}

/**
 * 流量站单个数据
 */
interface IFlowStationItem {
  latitude: number;
  longitude: number;
  name: string;
  stationId: number;
}

/**
 * 流量站详情返回值
 */
interface IFlowStationRes {
  endTime: string;
  list: {
    flow: number;
    speed: number;
    time: string;
  }[];
  name: string;
  startTime: string;
}
