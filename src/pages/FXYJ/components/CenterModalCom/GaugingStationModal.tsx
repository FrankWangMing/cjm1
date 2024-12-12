/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 水位站弹窗
 * 水位站-水库站 & 水位站-河道站
 */
import { useEffect } from 'react';
import { DatePicker, Form, Radio, Table } from 'antd';
import moment from 'moment';
import { useSafeState } from 'ahooks';
import { RangePickerProps } from 'antd/lib/date-picker';
import { IGaugingStationRes, ShowServer } from '@/service/show';
import { CloseOutlined } from '@ant-design/icons';
import { downloadFile } from '@/utils';
import ReactECharts from 'echarts-for-react';
import { Fragment } from 'react';
import GlobalStore from '@/store';
import { CusModalWrapper } from './style';
import { IMG_PATH, MomentFormatStr } from '@/utils/const';
import {
  CustomRadio,
  CustomRadioGroup
} from '@/components/AntdComponents/CustomRadio';
export { GaugingStationModal };
interface IGaugingStationModal {
  id: number | string | undefined;
  type: string;
  handleClose: Function;
}

/**
 * 水位站
 */
const GaugingStationModal = ({
  id,
  type,
  handleClose
}: IGaugingStationModal) => {
  useEffect(() => {
    form.setFieldValue('shijianduan', 24);
    form.setFieldValue('time_interval', 60);
    fetchData(true);
  }, [id]);
  console.log('typetype', type);
  const [data, setData] = useSafeState<IGaugingStationRes>({
    alarmWaterLevel: 0,
    endTime: '',
    floodLimitedWaterLevel: 0,
    guaranteeWaterLevel: 0,
    name: '',
    realWaterLevel: 0,
    list: [],
    startTime: '',
    type: ''
  });

  const [form] = Form.useForm();

  const getCurrSelectTime = res => {
    let startTime = '',
      endTime = moment().format(MomentFormatStr);
    if (!res.shijianduan) {
      startTime = res.shijian[0].format('YYYY-MM-DD 00:00:00');
      endTime = res.shijian[1].format('YYYY-MM-DD 23:59:59');
    } else {
      startTime = moment()
        .subtract(res.shijianduan, 'hours')
        .format(MomentFormatStr);
    }
    return {
      startTime,
      endTime
    };
  };

  const fetchData = (isInit: boolean) => {
    form.validateFields().then(async res => {
      const { startTime, endTime } = isInit
        ? {
            startTime: moment().subtract(24, 'hours').format(MomentFormatStr),
            endTime: moment().format(MomentFormatStr)
          }
        : getCurrSelectTime(res);
      setFetchDataIng(true);
      const data = await ShowServer.gaugingStation.infoById(
        startTime,
        endTime,
        Number(id),
        res.time_interval || 60
      );
      setData(data);
      setFetchDataIng(false);
    });
  };

  const handleDownLoad = async () => {
    // 获取当前的时间;
    const formData = form.getFieldsValue();
    const { startTime, endTime } = getCurrSelectTime(formData);
    const res = await ShowServer.download.waterStation({
      stationId: Number(id),
      startTime,
      endTime,
      timeGap: formData.time_interval || 60
    });
    downloadFile(
      res.filePath,
      `水位站_${data.name}_（${startTime}至${endTime}）.xlsx`
    );
  };

  const handleTimeRadioChange = () => {
    let selectShijianDuan = form.getFieldValue('shijianduan');
    setIsShowMoreTime(selectShijianDuan == -1);
  };
  const [isShowMoreTime, setIsShowMoreTime] = useSafeState(false);
  const { RangePicker } = DatePicker;

  /**
   * Target: 实现日期选择框最多选择3个月的时间;
   * disabledDate & onCalendarChange & from表单 配合使用
   * @param current
   * @returns
   */
  const disabledDate: RangePickerProps['disabledDate'] = current => {
    let curr_shijian_temp = form.getFieldValue('shijian_temp');
    if (curr_shijian_temp) {
      let startTime = curr_shijian_temp[0];
      let endTime = curr_shijian_temp[1];
      return (
        current < moment(endTime).subtract(3, 'M') ||
        (current && current > moment().endOf('day')) ||
        (current && current > moment(startTime).add(3, 'M'))
      );
    } else {
      return current && current > moment().endOf('day');
    }
  };
  const onCalendarChange = list => {
    form.setFieldValue('shijian_temp', list);
  };

  const [graphOrList, setGraphOrList] = useSafeState<'graph' | 'list'>('graph');

  const ColumnsMap = {
    GAUGING_STATION_RESERVOIR: [
      {
        title: '时间',
        dataIndex: 'time',
        width: '50%',
        align: 'center'
      },
      {
        title: '雨量(mm)',
        dataIndex: 'rain',
        width: '25%',
        align: 'center'
      },
      {
        title: '水位(m)',
        dataIndex: 'waterLevel',
        width: '25%',
        align: 'center',
        render: _text => {
          return _text.toFixed(2);
        }
      }
    ],
    GAUGING_STATION_RIVER: [
      {
        title: '时间',
        dataIndex: 'time',
        width: '50%',
        align: 'center'
      },
      {
        title: '水位(m)',
        dataIndex: 'waterLevel',
        width: '25%',
        align: 'center',
        render: _text => {
          return _text.toFixed(2);
        }
      }
    ]
  };

  const [fetchDataIng, setFetchDataIng] = useSafeState<boolean>(true);
  const timeLabelData = [
    {
      name: '近24小时',
      value: 24
    },
    {
      name: '近48小时',
      value: 48
    },
    {
      name: '近72小时',
      value: 72
    },
    {
      name: '更多',
      value: '-1'
    }
  ];
  return (
    <CusModalWrapper>
      {/* 弹窗头部 */}
      <div className="cus-modal-header">
        <div>{`${data.name}（${
          type === 'GAUGING_STATION_RIVER' ? '河道站' : '水库站'
        }）`}</div>
        <CloseOutlined onClick={() => handleClose()} alt="关闭" />
      </div>
      {/* 内容区域 */}
      <div className="SLYZT-modal-charts-outer">
        {/* 查询区域 */}
        <div className="search-form-outer">
          <Form
            className="_content flex-between"
            form={form}
            onChange={handleTimeRadioChange}>
            <div className="time-operation-outer">
              {isShowMoreTime ? (
                <>
                  <Form.Item
                    name="shijian"
                    rules={[
                      {
                        required: true,
                        message: '请选择时间范围'
                      }
                    ]}>
                    <RangePicker
                      disabledDate={disabledDate}
                      onCalendarChange={onCalendarChange}
                    />
                  </Form.Item>
                </>
              ) : (
                <Form.Item
                  name="shijianduan"
                  style={{ marginBottom: 0, width: '100%' }}>
                  <CustomRadioGroup name="radiogroup" className="radio-list">
                    {timeLabelData.map((item, index) => {
                      return (
                        <div className="radio-item-outer" key={index}>
                          <CustomRadio
                            width={42}
                            innerIcon={IMG_PATH.icon.radioIcon}
                            checkedInnerIcon={IMG_PATH.icon.radioInner}
                            value={item.value}>
                            <p style={{ fontSize: '14rem' }}> {item.name}</p>
                          </CustomRadio>
                          {index < timeLabelData.length - 1 && (
                            <div className="splice-line "></div>
                          )}
                        </div>
                      );
                    })}
                  </CustomRadioGroup>
                </Form.Item>
              )}
              {isShowMoreTime && (
                <span
                  className="back2select"
                  style={{ fontSize: '14rem' }}
                  onClick={() => {
                    setIsShowMoreTime(false);
                    form.setFieldValue('shijianduan', 24);
                    fetchData(true);
                  }}>
                  返回
                </span>
              )}
              <div
                className="cus-modal-search-btn"
                onClick={() => {
                  fetchData(false);
                }}>
                查询
              </div>
            </div>
            <Form.Item
              name="time_interval"
              className="time_interval flex-center">
              <Radio.Group
                disabled={fetchDataIng}
                onChange={() => {
                  fetchData(false);
                }}>
                <Radio value={5}>5分钟</Radio>
                <Radio value={60}>1小时</Radio>
              </Radio.Group>
            </Form.Item>
            <div className="_operation ">
              <Radio.Group
                optionType="button"
                value={graphOrList}
                onChange={e => {
                  setGraphOrList(e.target.value);
                }}>
                <Radio value="graph">图表</Radio>
                <Radio value="list">列表</Radio>
              </Radio.Group>
            </div>
          </Form>
        </div>
        {/* 内容区域 */}
        <div className="content-list-graph" style={{ padding: '0 20rem' }}>
          {data.list?.length > 0 ? (
            graphOrList === 'graph' ? (
              <GaugingRiverCharts
                alarmWaterLine={data.alarmWaterLevel}
                promiseWaterLine={data.guaranteeWaterLevel}
                realWater={data.list}
                floodWaterLine={data.floodLimitedWaterLevel}
                type={type}
              />
            ) : (
              <Table
                className="_list"
                // @ts-ignore
                columns={ColumnsMap[type]}
                dataSource={data.list}
                pagination={{
                  position: ['bottomCenter'],
                  pageSize: 5,
                  showSizeChanger: false
                }}
              />
            )
          ) : (
            <strong>暂无数据</strong>
          )}
        </div>
        {/* 水位站  */}
        <div className="operation-outer">
          <div className="download-btn" onClick={handleDownLoad}>
            下载
          </div>
        </div>
      </div>
    </CusModalWrapper>
  );
};

/**
 * 水位站 -- 河道站
 */

interface IGaugingRiverCharts {
  alarmWaterLine?: number;
  promiseWaterLine?: number;
  floodWaterLine?: number;
  realWater: { time: string; waterLevel: number; rain: number }[];
  type: string;
}
export const GaugingRiverCharts = ({
  alarmWaterLine = 0,
  promiseWaterLine = 0,
  floodWaterLine = 0,
  realWater,
  type
}: IGaugingRiverCharts) => {
  // 水位 警戒水位 保证水位
  const color =
    type === 'GAUGING_STATION_RIVER'
      ? ['#AD445E', '#FEE549', '#4887C2']
      : ['#FEE549', '#4887C2'];
  return (
    <Fragment>
      <ReactECharts
        style={{
          width: '100%',
          height: '100%'
        }}
        option={{
          color,
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            textStyle: {
              fontSize: 16 * GlobalStore.fontSize,
              fontFamily: 'AlibabaPuHuiTiM'
            }
          },
          toolbox: {
            feature: {
              dataView: { show: false, readOnly: false },
              magicType: { show: false, type: ['line', 'bar'] },
              restore: { show: false },
              saveAsImage: { show: false }
            }
          },
          legend:
            type === 'GAUGING_STATION_RIVER'
              ? {
                  data: ['水位', '警戒水位', '保证水位'],
                  width: '100%',
                  top: 10,
                  icon: 'rect',
                  order: 'seriesAsc',
                  show: true,
                  itemHeight: 4,
                  textStyle: {
                    color: '#fff',
                    fontSize: 16 * GlobalStore.fontSize,
                    fontFamily: 'AlibabaPuHuiTiR'
                  }
                }
              : {
                  data: ['水位', '汛限水位'],
                  width: '100%',
                  top: 10,
                  icon: 'rect',
                  right: '35%',
                  show: true,
                  order: 'seriesAsc',
                  itemHeight: 3,
                  textStyle: {
                    color: '#fff',
                    fontSize: 16 * GlobalStore.fontSize,
                    fontFamily: 'AlibabaPuHuiTiR'
                  }
                },
          grid: {
            containLabel: true,
            top: '20%',
            left: '5%',
            right: '20',
            bottom: '2%'
          },
          xAxis: [
            {
              type: 'time',
              axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                  color: '#ffffff'
                },
                barGap: 0
              },
              boundaryGap: false,
              axisLabel: {
                fontFamily: 'AlibabaPuHuiTiR',
                color: '#FFFFFF',
                fontSize: 16 * GlobalStore.fontSize,
                align: 'center',
                formatter: val => {
                  console.log(val);
                  let tempTime = moment(parseInt(val));
                  return (
                    tempTime.format('HH:mm') + '\n' + tempTime.format('MM/DD')
                  );
                },
                showMinLabel: true,
                showMaxLabel: true
              },
              axisPointer: {
                label: {
                  show: false
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '水位(m)',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              min: Math.min(...realWater.map(item => item.waterLevel)) - 5,
              nameGap: 40,
              axisLabel: {
                formatter: e => {
                  return Math.round((e * 10) / 10) == e ? e : '';
                },
                color: '#fff',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                showMinLabel: true,
                showMaxLabel: true
              },
              splitLine: { lineStyle: { type: [5, 10], color: '#fff' } },
              axisPointer: {
                show: false
              }
            }
          ],
          series: [
            type === 'GAUGING_STATION_RIVER' && {
              name: '保证水位',
              type: 'line',
              barGap: 0,
              lineStyle: {
                width: 4
              },
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val == -1 ? '--' : val + 'm';
                }
              },
              data: realWater.map(item => [item.time, promiseWaterLine])
            },
            type === 'GAUGING_STATION_RIVER' && {
              name: '警戒水位',
              type: 'line',
              barGap: 0,
              lineStyle: {
                width: 4
              },
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val == -1 ? '--' : val + 'm';
                }
              },
              data: realWater.map(item => [item.time, alarmWaterLine])
            },
            type === 'GAUGING_STATION_RESERVOIR' && {
              name: '汛限水位',
              type: 'line',
              barGap: 0,
              lineStyle: {
                color: '#FEE549',
                width: 4
              },
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val == -1 ? '--' : val + 'm';
                }
              },
              data: realWater.map(item => [item.time, floodWaterLine])
            },
            {
              name: '水位',
              type: 'line',
              areaStyle: {
                color: 'rgba(72,135,194,0.40)'
              },
              lineStyle: {
                width: 4,
                color: 'rgba(72, 135, 194)'
              },
              showSymbol: false,
              barGap: 0,
              smooth: true,
              tooltip: {
                valueFormatter: val => {
                  return val == -1 ? '--' : val + 'm';
                }
              },
              data: realWater.map(item => [
                item.time,
                Number(item.waterLevel.toFixed(2))
              ])
            }
          ]
        }}
      />
    </Fragment>
  );
};
