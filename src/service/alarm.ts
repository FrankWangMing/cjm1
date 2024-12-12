/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import {
  IShelter,
  IShelterDetail,
  IWarehouse,
  IWarehouseRes
} from '@/domain/marker';
import http from '@/utils/http';
import { alarmData } from './mock';
/**
 * 预警相关数据接口
 */
const AlarmServer = {
  // 风险预警 - 查询预警转移信息
  queryTransferInfo: async (
    projectId: number,
    queryIndex: { startTime: string; endTime: string }[]
  ): Promise<IQueryTransferInfo> => {
    const { data: data } = await http.post('alarm/queryalarmtransferinfos', {
      projectId,
      queryIndex
    });
    //todo920
    // return alarmData;
    return data;
  },
  /**
   * 预警责任人
   * 按照村落查询预警责任人信息
   * @param villageId 村庄id
   * @returns 责任人列表
   */
  queryAlarmOwners: async (villageId: number) => {
    const { data: data } = await http.get('/alarm/queryalarmowners', {
      params: {
        villageId
      }
    });
    return data;
  },
  /**
   * 防御对象清单
   * 按村落查询预警影响人口信息
   * @param villageId 村庄id
   * @returns 人员列表
   */
  queryAlarmInfluencePeople: async (villageId: number) => {
    const { data: data } = await http.get('alarm/queryalarminfluencepeople', {
      params: { villageId }
    });
    return data;
  },
  /**
   * 查询风险
   * @param params {startTime:'2022-01-01 00:00:00',endTime:'2022-01-01 00:00:00'}
   * @returns
   */
  queryAlarmRisks: async (params: {
    projectId: number;
    id: number;
    startTime: string;
    endTime: string;
  }) => {
    const { data: data } = await http.get('/alarm/queryriskforecast', {
      params: params
    });
    return data;
  },
  // 批量更新预警责任人信息
  // UpdateAlarmOwners
  updateAlarmOwners: async (alarmOwnersList: {}[]) => {
    const data = await http.post('/alarm/updateAlarmOwners', {
      alarmOwners: alarmOwnersList
    });
    return data;
  },
  // 批量删除预警责任人信息
  deleteAlarmOwners: async (ids: number[]) => {
    const data = await http.post('/alarm/deleteAlarmOwners', {
      ids
    });
    return data;
  },
  // 批量删除影响人口信息
  deleteAlarmInfluencePeople: async (ids: number[]) => {
    const data = await http.post('/alarm/deleteAlarmInfluencePeople', {
      ids
    });
    return data;
  },
  // 新增影响人口数据
  // updateAlarmInfluencePeople
  updateAlarmInfluencePeople: async (influencePeople: {}[]) => {
    const data = await http.post('/alarm/updateAlarmInfluencePeople', {
      influencePeople
    });
    return data;
  },
  /**
   * 避灾安置场所
   */
  shelter: {
    list: async (): Promise<{ list: IShelter[] }> => {
      const { data: data } = await http.get('/shelter/query');
      return data;
    },
    detail: async (id: number): Promise<IShelterDetail> => {
      const { data: data } = await http.get('/shelter/query/detail', {
        params: {
          id
        }
      });
      return data;
    }
  },
  /**
   * 仓库点列表
   */
  warehouse: {
    list: async (): Promise<{ list: IWarehouse[] }> => {
      const { data } = await http.get('/warehouse/query');
      return data;
    },
    detail: async (id: number): Promise<IWarehouseRes> => {
      const { data } = await http.get('/warehouse/query/detail', {
        params: {
          id
        }
      });
      return data;
    }
  },
  /**
   * 数据仓同步影响人口
   */
  syncInfluence: async () => {
    const { data } = await http.get('/alarm/sync/influence');
    return data;
  },
  /**
   * 数据仓同步责任人
   */
  syncOwners: async () => {
    const { data } = await http.get('/alarm/sync/owners');
    return data;
  },
  /**
   * 仓库数据下载
   * @param id
   */
  downloadWareHouse: async (id: number): Promise<{ filePath: string }> => {
    const { data } = await http.get('/warehouse/download/items', {
      params: { id }
    });
    return data;
  }
};

/**
 * 查询预警转移信息 -- 相关接口数据结构定义
 */
interface IQueryTransferInfo {
  transferInfos: ITransferInfos[];
  updateTime: string;
}
interface ITransferInfos {
  rain: number;
  immediately: {
    id: number;
    latitude: number;
    longitude: number;
    village: string;
  }[];
  safe: {
    id: number;
    latitude: number;
    longitude: number;
    village: string;
  }[];
  index: number;
  prepare: {
    id: number;
    latitude: number;
    longitude: number;
    village: string;
  }[];
}

export { AlarmServer, IQueryTransferInfo, ITransferInfos };
