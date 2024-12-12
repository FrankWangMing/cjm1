/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import http from '@/utils/http';

/**
 * 视频监控相关接口
 */
const MonitorServer = {
  /**
   * 获取所有摄像头的id
   * @returns
   */
  getAllCameras: async (): Promise<{ cameras: MonitorAllInfo[] }> => {
    const { data: data } = await http.get('/device/video/getAllCameras');
    return data;
  },
  getPreviewUrl: async (cameraId: number) => {
    const { data: data } = await http.get('/device/video/getPreviewUrl', {
      params: {
        cameraId: cameraId
      }
    });
    return data;
  },
  /**
   * 获取所有摄像头视频预览图片
   * @returns
   */
  getPictures: async (): Promise<{ pictures: monitorBaseInfo[] }> => {
    const { data: data } = await http.get('/device/video/getPictures');
    return {
      pictures: [
        {
          id: 1,
          title: '乘风源村乘风源村',
          path: 'http://10.0.64.4:8051/api/resource/dynamicDir/pdf/videopictures/中洲镇乘风源村乘风源村.jpg'
        },
        {
          id: 2,
          title: '木瓜村伊家坦村',
          path: 'http://10.0.64.4:8051/api/resource/dynamicDir/pdf/videopictures/中洲镇木瓜村伊家坦村.jpg'
        },
        {
          id: 3,
          title: '南庄村南庄村',
          path: 'http://10.0.64.4:8051/api/resource/dynamicDir/pdf/videopictures/中洲镇南庄村南庄村.jpg'
        },
        {
          id: 4,
          title: '南庄村双许村',
          path: 'http://10.0.64.4:8051/api/resource/dynamicDir/pdf/videopictures/中洲镇南庄村双许村.jpg'
        }
      ]
    };
    return data;
  },
  /**
   * 单个摄像头云台操作PTZ
   */
  controlMonitorPTZById: async (
    action: number,
    cameraId: number,
    ptzCmd: string
  ): Promise<string> => {
    let { data } = await http.post('/device/video/ptz', {
      action,
      cameraId,
      ptzCmd
    });
    return data.status;
  },
  /**
   * 摄像头巡航控制
   */
  controlCruise: async (
    cameraId: number,
    command: string,
    cruiseIndex: number
  ) => {
    await http.post('/device/video/cruiseControl', {
      cameraId,
      command,
      cruiseIndex
    });
  }
};

export { MonitorServer };
