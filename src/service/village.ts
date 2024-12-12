/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

/**
 * 村庄服务接口
 */

import { IVillageBase, IVillageInfo } from '@/domain/valley';
import http from '@/utils/http';

const VillageServer = {
  /**
   * 获取所有村庄经纬度Id数据
   * @returns
   */
  villageList: async obj => {
    let { data } = await http.post('/village/list', { ...obj });
    return data;
  },
  /**
   * 获取所有村庄经纬度Id数据
   * @returns
   */
  allBaseList: async (): Promise<IVillageBase[]> => {
    let { data: data } = await http.get('/village/query');
    return data.villageLocation;
  },
  /**
   * 根据村庄Id查看村庄水深、流速水文和基础信息
   * @param villageId 村庄id
   * @param projectIds 工况id List
   * @param startTime 起始时间
   * @param endTime 结束时间
   * @param simulationType 仿真类型（1-预报 2-高水位 3-短时暴雨）
   * @returns
   */
  detailById: async (
    villageId: number,
    projectIds: number[],
    startTime: string,
    endTime: string,
    simulationType: number
  ): Promise<{ villageDetails: IVillageDetailRes[] }> => {
    let { data: data } = await http.post('/village/query/details', {
      villageId,
      projectIds,
      startTime,
      endTime,
      simulationType
    });
    return data;
  },
  updateInfoBatch: async (villages: IVillageInfo[]) => {
    const data = await http.post('/village/update/baseInfos', {
      villages
    });
    return data;
  }
};

// function format(data): IVillageDetailRes {
//   return {
//     deep: data.deep,
//     info: {
//       area: data.info.area,
//       huNum: data.info.huNum,
//       manager: data.info.manager,
//       managerPhone: data.info.managerPhone,
//       peopleCount: data.info.peopleCount,
//       villageName: data.info.name,
//       riskType: data.info.riskType
//     },
//     riskLevel: data.riskLevel,
//     velocity: data.velocity
//   };
// }
interface IVillageDetailRes {
  deep: { time: string; type: number; value: number }[];
  info: IVillageInfo;
  riskLevel: { time: string; riskLevel: number }[];
  velocity: { time: string; type: number; value: number }[];
}

export { VillageServer, IVillageDetailRes };
