/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import http from '@/utils/http';

interface QueryFloodPreventPdfProp {
  endTime: string; // 预测结束时间 可选
  pdfNumber: number; // pdf文件序号（0：最近的一次日计算风险结果，非0：用户编辑pdf接口返回的ID）
  projectId: number; // 工况Id（非0：预报-预演模式工况，0：其他预报模式）可选
  startTime: string; // 预测起始时间 可选
}

interface QueryFloodPreventPdfRes {
  id: number;
  foresight: number;
  subject: string;
  organization: string;
  date: string;
  summary: string;
  riskForecast: string;
  crossSectionRiskList:
    | {
        crossSectionName: string;
        area: string;
        riskLevel: string;
      }[]
    | [];
  villageRiskList:
    | {
        villageId: number;
        villageName: string;
        administrativeVillage: string;
        area: string;
        riskLevel: number;
      }[]
    | [];
  floodDepthPictureLink: string;
  floodDurationPictureLink: string;
  waterRainStatistic: {
    title: string;
    rainAlarm: string;
    reservoirAlarm: string;
    riverAlarm: string;
  };
  floodSuggestionTitle: string;
  immeSuggest: string;
  prepSuggest: string;
  riskListDesc: string;
  rainPicture: string;
}

interface EditBriefReportProp {
  date: string; // 2022年12月13日
  floodDepthPictureTitle: string; // 全域洪水淹没水深图描述
  floodDurationPictureTitle: string; // 全域洪水淹没历时图描述
  floodSuggest: string; // 防汛建议内容
  floodSuggestTitle: string; // 防汛建议标题
  organization: string; // 淳安县千岛湖生态综合保护局
  rainAlarm: string; // 雨情预警
  rainStatistics: string; // 水雨情概况内容
  reservoirAlarm: string; // 水库超限内容
  riskForecast: string; // 天气预报数据
  riskForecastTitle: string; // 洪涝风险预报标题
  riskList: {
    administrativeVillage: string;
    area: string;
    riskLevel: number;
    villageId?: number;
    villageName: string;
  }[];
  riverAlarm: string; // 河道超警
  subject: string; // 淳安县小流域防汛专报
  summary: string; // 洪涝态势综述
}

/**
 * 洪涝预报 - 相关接口
 */
const PdfServer = {
  /**
   * 获取防洪专报数据
   * @param body
   * @returns
   */
  queryFloodPreventPdf: async (
    body: QueryFloodPreventPdfProp
  ): Promise<QueryFloodPreventPdfRes> => {
    let { data: data } = await http.post(
      '/solution/query/floodPreventPdf',
      body
    );
    return data;
  },
  editBriefReport: async (
    body: EditBriefReportProp
  ): Promise<{ pdfNumber: number }> => {
    const { data } = await http.post('/solution/edit/briefReport', body);
    return data;
  },
  UploadBriefImage: async (body: FormData): Promise<{ imagePath: string }> => {
    const { data } = await http.post(
      '/solution/briefreport/uploadImage',
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return data;
  }
};

export {
  PdfServer,
  QueryFloodPreventPdfProp,
  QueryFloodPreventPdfRes,
  EditBriefReportProp
};
