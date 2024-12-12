/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 断面数据的interface
 */

/**
 * @param id 断面id
 * @param lng 经度
 * @param lat 纬度
 * @param name 断面名称
 * @param data 图表数据
 */
interface ISection {
  id: number;
  lat: number;
  lng: number;
  name: string;
  data: {
    time: string;
    flow: number;
    rainfall: number;
  }[];
  projectId?: number;
  prepareTransfer?: number; // 准备转移水位
  immediateTransfer: number; // 立即转移水位
  forecastFlows?: { flow: number; time: string }[]; // 预测流量
  dikeAltitude?: number; // 堤防高程
}

/**
 * @param id 断面id
 * @param lng 经度
 * @param lat 纬度
 * @param name 断面名称
 * @param startPosition 断面起始点位置
 * @param endPosition 断面终点位置
 */
interface ISectionBase {
  id: number;
  lat: number;
  lng: number;
  name: string;
  startPosition: { lat: number; lng: number };
  endPosition: { lat: number; lng: number };
}

export { ISection, ISectionBase };
