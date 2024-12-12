/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import http from '@/utils/http';
import moment from 'moment';
import { weatherData } from './mock';
export interface IWeatherRes {
  condition: {
    condition: string;
    rainProbability: string;
    rainValue: string;
    time: string;
  };
  forecast: {
    condition: string;
    rainProbability: string;
    rainValue: string;
    time: string;
    week: string;
  }[];
  temp: {
    current: string;
    max: string;
    min: string;
  };
}

const WeatherServer = {
  /**
   * 获取天气数据
   * @param duration 未来预测时长 (1/23/24/.../48)
   * @returns
   */
  list: async (
    startTime: string,
    endTime: string,
    projectId: number
  ): Promise<IWeatherRes> => {
    let { data: data } = await http.post('/weather/query', {
      startTime,
      endTime,
      projectId
    });
    // return data;
    //todo920
    return weatherData;
  },
  /**
   * 获取今日的历史天气
   * @returns
   */
  historyToday: async () => {
    const { data } = await http.get('/weather/history/today');
    return data;
  },
  /**
   * 获取历史天气
   * @param startTime 起始时间
   * @param endTime 结束时间
   * @param type 统计类型 day 按天 hour 按小时
   * @returns
   */
  historyByTime: async (startTime: string, endTime: string, type?: string) => {
    const { data } = await http.get('/weather/history', {
      params: {
        startTime,
        endTime,
        type
      }
    });
    return data;
  },
  /**
   * 根据日期获取历史预测降雨量
   * @param date 日期
   * @returns
   */
  historyForecastByTime: async (date: string) => {
    const { data } = await http.get('/weather/history/forecast', {
      params: { date }
    });
    return data;
  }
};

/**
 * 天气数据格式转换
 * @param tempData
 */
const formatData_list = tempData => {
  let tempFeature: { time: string; value: number }[] = [];
  tempData?.forecast.map(item => {
    tempFeature.push({
      time: moment(item.date)
        .add('h', item.duration)
        .format('YYYY/MM/DD HH:mm:ss'),
      value: Number(item.rainValue) || 0
    });
  });
  let tempResultData = {
    range: {
      min: tempData.temp.min || 0,
      max: tempData.temp.max || 0,
      current: tempData.temp.current || 0
    },
    rain: {
      type: tempData.condition.condition || '',
      probability: tempData.condition.rainProbability || '',
      count: tempData.condition.rainValue || ''
    },
    feature: tempFeature || []
  };
  return tempResultData;
};

export { WeatherServer };
