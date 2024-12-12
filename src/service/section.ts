/**
 * 断面相关接口
 */

import { ISection, ISectionBase } from '@/domain/section';
import http from '@/utils/http';

export interface SectionServerGetAllInfoParams {
  projectId: number;
  simulationType: number;
  startTime: string;
  endTime: string;
}

interface SectionData {
  id: number;
  riskLevel: boolean;
  name: string;
}

export interface SectionServerGetAllInfoRes {
  sections: SectionData[];
}

/**
 * 断面相关接口数据
 */
const SectionServer = {
  /**
   * 获取断面基础数据
   */
  listOfLngLat: async (): Promise<ISectionBase[]> => {
    let { data: data } = await http.get('/section/baseInfo');
    return data.sections;
  },
  /**
   * 获取所有断面数据
   */
  getAllInfo: async (params: SectionServerGetAllInfoParams) => {
    let { data } = await http.post<SectionServerGetAllInfoRes>(
      '/section/allInfo',
      params
    );
    return data.sections;
  },
  /**
   * 根据断面Id查询断面数据
   * @param projectIds
   * @param sectionId
   * @param startTime
   * @param endTime
   * @param simulationType 仿真类型 （1-预报 2-高水位 3-短时暴雨）
   */
  infoById: async (
    projectIds: number[],
    sectionId: number,
    startTime: string,
    endTime: string,
    simulationType: number
  ): Promise<{ crossSections: ISection[] }> => {
    let { data: data } = await http.post('/section/Info', {
      projectIds,
      sectionId,
      startTime,
      endTime,
      simulationType
    });
    return data;
  }
};

export { SectionServer };
