/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

/**
 * 一日洪涝预报时间选择内容
 */
const RADIO_FORECAST_TIME_DAY: { label: string; value: number }[] = [
  { label: '1小时', value: 1 },
  { label: '3小时', value: 3 },
  { label: '6小时', value: 6 },
  { label: '12小时', value: 12 },
  { label: '24小时', value: 24 }
];
/**
 * 一周洪涝预报时间选择内容
 */
const RADIO_FORECAST_TIME_WEEK: { label: string; value: number }[] = [
  { label: '2天', value: 48 },
  { label: '3天', value: 72 },
  { label: '4天', value: 96 },
  { label: '5天', value: 120 },
  { label: '6天', value: 144 },
  { label: '7天', value: 168 }
];

const OPERATION_LIST: { key: 'day' | 'week'; title: string }[] = [
  {
    key: 'day',
    title: '一日洪涝预报'
  },
  {
    key: 'week',
    title: '一周洪涝预报'
  }
];

const LAYER_LIST = [
  {
    key: 'village',
    title: '重要防灾村落'
  },
  {
    key: 'section',
    title: '防洪控制断面'
  },
  {
    key: 'risk',
    title: '洪水风险图'
  }
];

export {
  RADIO_FORECAST_TIME_DAY,
  RADIO_FORECAST_TIME_WEEK,
  LAYER_LIST,
  OPERATION_LIST
};
