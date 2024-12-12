/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import moment from 'moment';

/**
 * 天气组件数据定义
 */
export interface IWeather {
  range: {
    min: number;
    max: number;
    current: number;
  };
  rain: {
    type: string;
    probability: string;
    count: string;
  };
  feature: { time: string; value: number }[];
}

/**
 * 天气数据图标映射表
 */
export const ICON_MAP = {
  中到大雨: '/images/weather/W9.png',
  中雨: '/images/weather/W8.png',
  中雪: '/images/weather/W15.png',
  冰粒: '/images/weather/W5.png',
  冰针: '/images/weather/W5.png',
  冰雹: '/images/weather/W5.png',
  冻雨: '/images/weather/W19.png',
  冻雾: '/images/weather/W18.png',
  多云: '/images/weather/W1.png',
  大到暴雨: '/images/weather/W10.png',
  大暴雨: '/images/weather/W10.png',
  大部晴朗: '/images/weather/W0.png',
  大雨: '/images/weather/W9.png',
  大雪: '/images/weather/W16.png',
  小到中雨: '/images/weather/W7.png',
  小到中雪: '/images/weather/W15.png',
  小阵雨: '/images/weather/W3.png',
  小阵雪: '/images/weather/W13.png',
  小雨: '/images/weather/W7.png',
  小雪: '/images/weather/W14.png',
  少云: '/images/weather/W1.png',
  尘卷风: '/images/weather/W29.png',
  局部阵雨: '/images/weather/W3.png',
  强沙尘暴: '/images/weather/W20.png',
  强阵雨: '/images/weather/W3.png',
  扬沙: '/images/weather/W29.png',
  晴: '/images/weather/W0.png',
  暴雨: '/images/weather/W10.png',
  暴雪: '/images/weather/W17.png',
  沙尘暴: '/images/weather/W20.png',
  浮尘: '/images/weather/W29.png',
  特大暴雨: '/images/weather/W10.png',
  阴: '/images/weather/W2.png',
  阵雨: '/images/weather/W3.png',
  阵雪: '/images/weather/W13.png',
  雨: '/images/weather/W8.png',
  雨夹雪: '/images/weather/W6.png',
  雪: '/images/weather/W15.png',
  雷暴: '/images/weather/W4.png',
  雷电: '/images/weather/W4.png',
  雷阵雨: '/images/weather/W4.png',
  雷阵雨伴有冰雹: '/images/weather/W5.png',
  雾: '/images/weather/W18.png',
  霾: '/images/weather/W45.png'
};

export const formatData_list_WEEK = tempData => {
  let resultList: {
    time: string;
    rainValue: number;
    condition: string;
    rainProbability: string;
    icon: string;
  }[] = [];
  console.log('tempDatatempData', tempData);
  tempData.map(item => {
    let tempCondition = '';
    let conditionArr = item.condition.split(',');
    if (conditionArr.length > 1) {
      tempCondition = conditionArr[conditionArr[0].indexOf('雨') == -1 ? 0 : 1];
    } else {
      tempCondition = conditionArr[0];
    }
    resultList.push({
      time: item.time,
      rainValue: item.rainValue,
      condition: tempCondition,
      rainProbability:
        item.condition.indexOf('雨') != -1 ? item.rainProbability : 0,
      icon:
        item.condition.indexOf('雨') != -1
          ? ICON_MAP['小到中雨']
          : ICON_MAP[tempCondition]
    });
  });
  return resultList;
};
