/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { IRiskItem, IVillageInfo } from '@/domain/valley';
import { sortData } from '@/utils/const';
import http from '@/utils/http';

export interface PreviewScenesRes {
  sceneList: SceneListItem[];
}

export interface SceneListItem {
  sceneId: number;
  projectId: number;
  sceneName: string;
  customRain: {
    time: string;
    value: number;
  }[];
  reservoirInfo: ReservoirInfo;
  rainDuration: number;
  sceneDuration: number;
  rainSum: number;
}

export interface ReservoirInfo extends Record<string, number> {
  ys: number;
  xb: number;
  sz: number;
}

/**
 * 最新的预演复盘计算返回结果结构
 */
export interface PreviewStart1Res {
  project: {
    frameList: number[];
    projectId: number;
    resultPath: string;
    sceneId: number;
  };
  riskList: IRiskItem[];
  waterLevel: string;
}

interface PreviewStart1Prop {
  forecastPeriod: number; // 预见期
  sceneOptions: string[]; // 定制化除水位外其他参数配置
  sceneType: number; // 场景类型（2: 高水位分析，3：短时暴雨）
  waterLevel: string[]; // 定制化水位场景参数配置
}

export interface CustomCalculateListResponse {
  customList: CustomListItem[];
}

export interface CustomListItem {
  durationEnd: string;
  durationStart: string;
  jobId: number;
  jobStatus: string;
  rainFall: string;
  submitTime: string;
}

export interface CustomCalculateParams {
  rainProcess: {};
  rainDuration: number[];
  rainFall: number[];
  rainScene: number;
  waterLevel: {};
}

/**
 * 预演相关数据接口
 */
const PreviewServer = {
  /**
   * 列表种类 1任务列表（计算中/失败） 2成果列表（计算成功）
   */
  customCalculateList: async (type: 1 | 2) => {
    const result = await http.post<CustomCalculateListResponse>(
      '/hwlcalculate/customCalculateList',
      { listType: type }
    );
    return result.data.customList;
  },

  // 成果列表删除
  customCalculateDelete: async (id: number) => {
    const { data } = await http.post('/hwlcalculate/customCalculateDelete', {
      projectIds: [id]
    });
    return data;
  },

  /**
   * 根据工况id查询工况对应的数据;
   * @param projectIds 工况ids
   * @returns
   */
  queryProjectResultsByIds: async (
    projectIds: number[]
  ): Promise<{ previewCalResults: PreviewStart1Res[] }> => {
    const { data: data } = await http.post(
      '/hwlcalculate/queryProjectResults',
      {
        projectIds
      }
    );
    return data;
  },
  /**
   * 实时计算接口
   */
  customCalculate: async (params: CustomCalculateParams) => {
    const _params = {
      ...params,
      rainProcess: JSON.stringify(params.rainProcess),
      waterLevel: JSON.stringify(params.waterLevel)
    };
    const { data } = await http.post('/hwlcalculate/customCalculate', _params);
    return data;
  },

  /**
   * 根据指定id关闭实时计算。
   * @param projectIds 当前实时计算的id列表
   * @returns
   */
  customCalculateStop: async (
    projectIds: number[]
  ): Promise<{
    result: {
      projectId: number;
      status: string;
    }[];
  }> => {
    const { data: data } = await http.post(
      '/hwlcalculate/customCalculateStop',
      {
        projectIds
      }
    );
    return data;
  },

  /**
   * 获取设计暴雨天气的降雨量
   * @param calType
   * @param rainfallIntensity
   * @param rainfallDuration
   * @returns
   */
  queryDesignWeatherRain: async ({
    calType,
    rainfallIntensity,
    rainfallDuration
  }: {
    calType: number;
    rainfallIntensity: number;
    rainfallDuration: number;
  }): Promise<{ rain: number }> => {
    const { data: data } = await http.get(
      '/hwlcalculate/queryDesignWeatherRain',
      {
        params: {
          calType,
          rainfallIntensity,
          rainfallDuration
        }
      }
    );
    return data;
  },

  /**
   * 预演场景-获取可选场景参数列表（新）
   * @param sceneType 高水位分析2 短时暴雨3
   * @returns
   */
  previewScenes: async (sceneType: number): Promise<PreviewScenesRes> => {
    const { data: data } = await http.get('/hwlcalculate/previewScenes', {
      params: { sceneType }
    });
    return data;
  },

  /**
   * 最新的预演复盘场景
   * @returns
   */
  start1: async (
    body: PreviewStart1Prop
  ): Promise<{ previewCalResults: PreviewStart1Res[] }> => {
    const { data: data } = await http.post('/hwlcalculate/start1', body);
    return data;
  },

  /**
   * 高水位分析 - 获取可选降雨参数列表
   * @param sceneType 1 高水位分析 2 短时暴雨
   * @returns 返回降雨参数列表
   */
  paramsOfRain: async (sceneType: number): Promise<IAllSceneResItem[]> => {
    let { data } = await http.get('/hwlcalculate/scenes', {
      params: { sceneType }
    });
    return data.scenes;
  },

  /**
   * 高水位分析 -- 开始预演，获取结果列表、风险列表
   * @param forecastPeriod 预见期
   * @param sceneId 场景id
   */
  calcStart: async (
    forecastPeriod: number,
    sceneId: number
  ): Promise<IYYFPCalcStartProp> => {
    let { data: data } = await http.post('/hwlcalculate/start', {
      forecastPeriod: forecastPeriod,
      sceneId: sceneId
    });
    return {
      project: {
        frameList: data.project.frameList || [],
        projectId: data.project.projectId || 0,
        sceneId: data.project.sceneId,
        resultPath: data.project.resultPath || ''
      },
      riskList: sortData(data.riskList) || []
    };
  },

  /**
   * 高水位分析 -- 查看村庄的水文仿真结果信息
   * @param forecastPeriod 预见期
   * @param sceneIds 场景ids
   * @param villageId 村庄id
   */
  villageInfo: async (
    forecastPeriod: number,
    projectIds: number[],
    villageId: number
  ): Promise<IVillageInfoYYFP> => {
    let { data } = await http.post('/hwlcalculate/villageresults', {
      forecastPeriod: forecastPeriod,
      projectIds: projectIds,
      villageId: villageId
    });
    return data;
  },
  queryWaitTasks: async (): Promise<{
    jobWaitList: {
      jobStartTime: string;
      jobStatus: string;
      projectId: string;
    }[];
  }> => {
    let { data } = await http.get('/job/queryWaitTasks');
    return data;
  },
  queryTasks: async (
    body: IQueryTasksProp
  ): Promise<{ jobWaitList: IQueryTasksRes[] }> => {
    let { data } = await http.post('/job/queryTasks', body);
    return data;
  }
};

interface IQueryTasksProp {
  sceneType: number;
  status: number;
  rainType: number;
}

export interface IQueryTasksRes {
  customRains: {
    rain: number;
    time: string;
  }[];
  jobStartTime: string;
  jobStatus: string;
  projectId: string;
  waterLevel: number;
  durationStart: string;
  durationEnd: string;
}

export interface IYYFPCalcStartProp {
  project: {
    frameList: number[];
    projectId: number;
    sceneId: string | number;
    resultPath: string;
  };
  riskList: IRiskItem[];
}

interface IVillageInfoYYFP {
  villageDetails: {
    sceneId: number;
    projectId: number;
    maxRiskLevel: number;
    hydrologyData: {
      time: string;
      type: number; // 水深流速 0 水深 1 流速
      method: number; // 最大、最小、平均、当前
      value: string;
    }[];
    riskDetail: { time: string; riskLevel: number }[];
  }[];
  villageInfo: IVillageInfo;
}

/**
 * 所有场景的数据
 * @param type 降雨场景
 * @param intensity 降雨强度
 * @param duration 降雨时长
 * @param rain 降雨量
 * @param sceneId 场景ID
 * @param waterLevel 水位线
 */
interface IAllSceneResItem {
  duration: string;
  intensity: string;
  rain: string;
  sceneId: number;
  type: string;
  waterLevel: string;
}

export { PreviewServer, IAllSceneResItem, IVillageInfoYYFP };
