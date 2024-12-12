/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * TODOLIST
 * 1. type的配置应该定义一下
 */

/**
 * @param id id用来查询弹窗数据
 * @param name name点位名称
 * @param longitude 经度
 * @param latitude 纬度
 * @param type 弹窗类型
 * @param icon 标点的图形
 * @param risk 风险等级
 * @param data 额外数据
 * @param hoverStyle 是否可以悬浮展示相关tips？如果有传递此值就可以hover
 */
export interface IMarker {
  id: number | string;
  longitude: number;
  latitude: number;
  type: string;
  icon: string;
  risk?: number;
  name?: string;
  data?: {};
  hoverStyle?: string;
  width?: number;
  height?: number;
  marginTop?: number;
  nameShowOuterCss?: object;
  nameShowCss?: object;
  popUpCss?: object;
}

export interface IShelter {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
}
export interface IShelterDetail {
  address: string;
  appraisalReport: string;
  area: number;
  capacity: number;
  completionTime: string;
  isAppraised: string;
  isPrefabricated: string;
  latitude: number;
  longitude: number;
  name: string;
  structure: string;
}

export interface IWarehouse {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
}
export interface IWarehouseRes {
  id: number;
  items: {
    common_name: string;
    id: number;
    management_method: string;
    model: string;
    name: string;
    production_date: string;
    quantity: number;
    shelf_life: number;
    unit: string;
  }[];
  name: string;
}
