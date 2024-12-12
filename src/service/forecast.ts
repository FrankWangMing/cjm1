/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { IRiskItem } from '@/domain/valley';
import { sortData } from '@/utils/const';
import http from '@/utils/http';

/**
 * 洪涝预报 - 相关接口
 */
const ForecastServer = {
  /**
   * 开始计算
   * @param type 1日预测、2周预测
   */
  calcStart: async (
    startTime: string,
    endTime: string,
    projectId: number
  ): Promise<ICalcStartRes> => {
    let { data: tempData } = await http.post('/calculate/start', {
      startTime,
      endTime,
      projectId
    });
    return {
      nFrameList: tempData.nFrameList || [],
      path: tempData.path,
      projectId: tempData.projectId,
      riskList: sortData(tempData.riskList) || []
    };
  },
  /**
   * 全域淹没面积
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @param projectId 工程id
   * @param simulationType 仿真类型（1-预报 2-高水位 3-短时暴雨）
   */
  floodArea: async (
    startTime: string,
    endTime: string,
    projectId: number,
    simulationType: number
  ) => {
    const { data: data } = await http.post('/flood/area', {
      startTime,
      endTime,
      projectId,
      simulationType
    });
    return {
      allArea: data.allArea,
      maxFloodArea: data.maxFloodArea,
      minFloodArea: data.minFloodArea < 0 ? 0 : data.minFloodArea
    };
  },
  // cloud/query
  // 获取最大水深或淹没历时云图json文件
  cloudQuery: async ({
    startTime,
    endTime,
    projectId,
    calType
  }: {
    startTime: string;
    endTime: string;
    projectId: number;
    calType: number;
  }): Promise<{ path: string }> => {
    const { data: data } = await http.post('/cloud/query', {
      startTime,
      endTime,
      projectId,
      calType
    });
    console.log('云图', data);
    return data;
  }
};

/**
 * 洪涝预报开始计算接口返回值类型定义
 */
interface ICalcStartRes {
  /**
   * 挑选出的帧数列表
   */
  nFrameList: number[];
  /**
   * 结果文件路径
   */
  path: string;
  /**
   * 工况id
   */
  projectId: number;
  /**
   * 风险列表
   */
  riskList: IRiskItem[];
}

export { ICalcStartRes, ForecastServer };
