/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

export type IRisk = 1 | 2 | 3 | 0;
/**
 * 村庄对象的基础约束
 * @param id 村庄id
 * @param longitude 经度
 * @param latitude 纬度
 */
export interface IVillageBase {
  id: number;
  longitude: number;
  latitude: number;
  administrationVillage: string;
  natureVillage: string;
  town: string;
}

export interface IRiskItem {
  natureVillageId: number;
  riskLevel: IRisk;
  region: string;
  administrativeVillage: string;
  natureVillageName: string;
}

export interface IVillageInfo {
  area: number;
  huNum: number;
  manager: string;
  managerPhone: string;
  peopleCount: number;
  villageName?: string;
  name?: string;
  riskType?: string;
  villageId?: number;
}
