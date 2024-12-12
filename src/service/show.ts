/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 * 水利一张图界面的展示数据接口
 */

import http from '@/utils/http';
import { rainArray } from './mock';
const ShowServer = {
  /**
   * 后端获取平台相关链接
   * 1 自定义进度ws连接
   * 2 海康智慧水安平台链接
   * 3 边界服务链接
   * @param type
   */
  getStaticLink: async (type: number): Promise<{ link: string }> => {
    const { data: data } = await http.get('/show/getStaticLink', {
      params: {
        type
      }
    });
    return data;
  },
  /**
   * 堤防相关接口
   */
  embankmentStation: {
    /**
     * 获取所有堤防
     */
    list: async (): Promise<IEmbankmentStationItem[]> => {
      let { data: data } = await http.get('/show/dikeStations');
      return data.dikeStations;
    },
    /**
     * 根据堤防id查询堤防详情
     * @param dikeId 堤防id
     */
    getById: async (dikeId: number): Promise<IEmbankmentStationDetail> => {
      let { data: data } = await http.get('/show/dikeStationDetail', {
        params: { dikeId }
      });
      return data;
    }
  },
  /**
   * 山塘相关接口
   */
  pondStation: {
    /**
     * 查询所有山塘
     * @returns IPondsStation
     */
    list: async (): Promise<IPondsStationItem[]> => {
      let { data: data } = await http.get('/show/poolStationStations');
      return data.poolStations;
    },
    /**
     * 根据山塘id查询山塘详情
     * @param poolId 山塘id
     * @returns
     */
    getById: async (poolId: number): Promise<IPondsStationDetail> => {
      let { data: data } = await http.get('show/poolStationDetail', {
        params: { poolId }
      });
      return data;
    }
  },
  /**
   * 雨量站相关接口
   */
  rainfallStation: {
    /**
     * 获取所有雨量站数据
     * @param params
     * @param params.startTime 统计起始时间 YYYY-MM-DD HH:mm:ss
     * @param params.endTime 统计结束时间 YYYY-MM-DD HH:mm:ss
     * @returns
     */
    list: async (params: {
      startTime?: string;
      endTime?: string;
    }): Promise<IRainfallStationItem[]> => {
      let { data: data } = await http.get('/show/rainStations', {
        params: params
      });
      return data.rainStations;
    },
    /**
     * 根据雨量站ID查询详情
     * @param stationId
     * @param startTime
     * @param endTime
     * @returns
     */
    getById: async (
      stationId: number,
      startTime: string,
      endTime: string,
      timeGap: number
    ): Promise<IRainfallStationDetail> => {
      let { data: data } = await http.get('/show/rainStationDetail1', {
        params: { stationId, startTime, endTime, timeGap }
      });
      //todo 920是假数据
      return { ...data, rainArray: rainArray };
    }
  },
  /**
   * 水库站相关接口
   */
  reservoirStation: {
    /**
     * 查询所有水库站点数据
     * @returns
     */
    list: async (): Promise<IReservoirStationItem[]> => {
      let { data: data } = await http.get('/show/reservoirStations');
      return data.reservoirStations;
    },
    /**
     * 根据id查询水库详情
     * @param reservoirId
     * @returns
     */
    getById: async (reservoirId: number): Promise<IReservoirStationDetail> => {
      let { data: data } = await http.get('/show/reservoirStationDetail', {
        params: { reservoirId }
      });
      return data;
    },
    /**
     *
     * @param reservoirType 所有水库基本信息（区分类型） 5: 小型，4：中大型
     * @returns
     */
    listByType: async (reservoirType: number) => {
      let { data: data } = await http.get('/show/reservoirTypeStations', {
        params: { reservoirType }
      });
      return data;
    }
  },
  /**
   * 水位站相关接口
   */
  gaugingStation: {
    list: async (): Promise<IGaugingStationItem[]> => {
      let { data: data } = await http.get('/show/waterStations');
      return data.waterStations;
    },
    infoById: async (
      startTime: string,
      endTime: string,
      stationId: number,
      timeGap: number
    ): Promise<IGaugingStationRes> => {
      let { data: data } = await http.get('/show/waterStationDetail1', {
        params: { startTime, endTime, stationId, timeGap }
      });
      return data;
    }
  },
  /**
   * 实时警情
   */
  realAlarm: {
    /**
     * 实时警情
     * @param params
     * @returns
     */
    info: async (params: {
      startTime?: string;
      endTime?: string;
    }): Promise<IResultRealAlarm> => {
      let { data: data } = await http.get('/show/realAlarm', {
        params
      });
      // todo920
      return {
        rainAlarms: [
          {
            latitude: 29.5333,
            longitude: 118.517,
            name: '陈家村',
            stationId: 14
          },
          {
            latitude: 29.4833,
            longitude: 118.417,
            name: '樟村',
            stationId: 15
          }
        ],
        reservoirAlarms: [
          {
            latitude: 29.3733,
            longitude: 118.464,
            name: '镜坑源水库',
            reservoirType: 5,
            stationId: 36
          },
          {
            latitude: 29.5097,
            longitude: 118.537,
            name: '龙姚水库',
            reservoirType: 5,
            stationId: 51
          }
        ],
        riverAlarms: [
          {
            latitude: 29.6,
            longitude: 119.033,
            name: '千岛湖水位',
            stationId: 40
          },
          {
            latitude: 29.419444,
            longitude: 118.510833,
            name: '汾口畹墅',
            stationId: 102
          }
        ]
      };
      // return data;
    }
  },
  statistic: {
    /**
     * 雨情统计
     * @param params
     * @returns
     */
    rain: async (params: { startTime?: string; endTime?: string }) => {
      let { data: data } = await http.get('/show/rainStatistic', {
        params
      });
      return data;
    },
    /**
     * 水位查询
     */
    waterLine: async (entityId: string) => {
      let { data: data } = await http.get('/show/waterStatistic', {
        params: { entityId }
      });
      return data;
    },
    /**
     * 水雨情统计
     */
    waterRain: async (
      startTime: string,
      endTime: string,
      stationId: number,
      timeGap: number
    ): Promise<{
      list: { time: string; waterLevel: number; rain: number }[];
    }> => {
      let { data: data } = await http.get('/show/waterRainStatistic', {
        params: {
          startTime,
          endTime,
          stationId,
          timeGap
        }
      });
      return data;
    }
  },
  riverStation: {
    listOfAll: async (): Promise<{
      riverStations: IResultRiverStationItem[];
    }> => {
      let { data: data } = await http.get('/show/riverStations');
      return data;
    }
  },
  /**
   * 监控视频点位接口
   */
  monitorStation: {
    list: async () => {
      let { data: data } = await http.get('show/monitorStations');
      return data;
    }
  },

  /**
   * 雨情统计下载接口
   */
  // show/rainStatistic/download
  download: {
    /**
     * 雨情统计 - 按时间批量下载
     * @param startTime
     * @param endTime
     */
    rainStatistic: async (params: {
      startTime: string;
      endTime: string;
    }): Promise<{ filePath: string }> => {
      let { data: data } = await http.get('show/rainStatistic/download', {
        params
      });
      return data;
    },
    /**
     * 水情统计 - 按时间批量下载
     * @param type 下载类型（0：所有水库站+河道站，1：所有水库站，2：所有河道站）
     * @param startTime 起始时间
     * @param endTime 结束时间
     * @returns
     */
    waterStatistic: async (params: {
      type: number;
      startTime: string;
      endTime: string;
    }): Promise<{ filePath: string }> => {
      let { data: data } = await http.get('show/waterStatistic/download', {
        params
      });
      return data;
    },
    /**
     * 单个雨量站检测水位历史数据
     * @param stationId 雨量站ID
     * @param startTime 统计起始时间
     * @param endTime 统计结束时间
     * @returns
     */
    rainStation: async (params: {
      stationId: number;
      startTime: string;
      endTime: string;
      timeGap: number;
    }): Promise<{ filePath: string }> => {
      let { data } = await http.get('show/rainStation/download', { params });
      return data;
    },
    /**
     * 水位站 水雨情历史数据下载
     * @param stationId 水位站 ID
     * @param startTime 统计起始时间
     * @param endTime 统计结束时间
     * @returns
     */
    waterStation: async (params: {
      stationId: number;
      startTime: string;
      endTime: string;
      timeGap: number;
    }): Promise<{ filePath: string }> => {
      let { data } = await http.get('/show/waterRainStatistic/download', {
        params
      });
      return data;
    }
  },
  /**
   * 流量站相关接口
   */
  flowStation: {
    /**
     * 所有流量站接口
     * @returns
     */
    listOfAll: async (): Promise<{ flowStations: IFlowStationItem[] }> => {
      const { data: data } = await http.get('/show/flowStations');
      return data;
    },
    /**
     * 获取流量站详情
     * @param stationId 流量站ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param timeGap 时间间隔
     * @returns
     */
    detailById: async (
      stationId: number,
      startTime?: string,
      endTime?: string,
      timeGap?: number
    ): Promise<IFlowStationRes> => {
      const { data: data } = await http.get('/show/flowStationDetail', {
        params: {
          stationId,
          startTime,
          endTime,
          timeGap
        }
      });
      return data;
    }
  },
  /**
   * 预报风险（未来3小时）
   */
  forecastRisk: async (): Promise<{
    household: number;
    people: number;
    riskList: {
      riskLevel: number;
      riskNum: number;
    }[];
    riskSum: number;
  }> => {
    const { data } = await http.get('/show/forecastRisk');
    return data;
  }
};
export interface IGaugingStationRes {
  alarmWaterLevel: number;
  endTime: string;
  floodLimitedWaterLevel: number;
  guaranteeWaterLevel: number;
  name: string;
  realWaterLevel: number;
  list: {
    time: string;
    waterLevel: number;
    rain: number;
  }[];
  startTime: string;
  type: string;
}

export { ShowServer };
