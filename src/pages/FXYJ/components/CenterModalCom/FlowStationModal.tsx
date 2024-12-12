/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { useSafeState } from 'ahooks';
import { CusModalWrapper } from './style';
import { CloseOutlined } from '@ant-design/icons';
import { ShowServer } from '@/service/show';
import moment from 'moment';
import { Form, Radio, Table } from 'antd';
import DatePicker, { RangePickerProps } from 'antd/lib/date-picker';
import { Fragment, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import GlobalStore from '@/store';
import locale from 'antd/es/date-picker/locale/zh_CN';
import Loading from '@/components/Loading';
import { IMG_PATH, MomentFormatStr } from '@/utils/const';
import {
  CustomRadio,
  CustomRadioGroup
} from '@/components/AntdComponents/CustomRadio';
/**
 * 流量站 - 弹窗
 */

interface IFlowStationModalProp {
  handleClose: Function;
  id: number;
}
const FlowStationModal = ({ handleClose, id }: IFlowStationModalProp) => {
  const { RangePicker } = DatePicker;
  // 获取当前选中的时间
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

  const [data, setData] = useSafeState<IFlowStationRes>({
    startTime: '',
    endTime: '',
    list: [],
    name: ''
  });
  const [loading, setLoading] = useSafeState(false);
  const [form] = Form.useForm();
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

  const getData = async (isInit: boolean) => {
    form.validateFields().then(async res => {
      const { startTime, endTime } = isInit
        ? {
            startTime: moment().subtract(24, 'hours').format(MomentFormatStr),
            endTime: moment().format(MomentFormatStr)
          }
        : getCurrSelectTime(res);
      setLoading(true);
      const data = await ShowServer.flowStation.detailById(
        Number(id),
        startTime,
        endTime,
        res.time_interval || 60
      );
      console.log('datadata', data);
      setData(data);
      setLoading(false);
    });
  };
  const [graphOrList, setGraphOrList] = useSafeState<'graph' | 'list'>('graph');
  const [isShowMoreTime, setIsShowMoreTime] = useSafeState(false);
  const handleTimeRadioChange = () => {
    let selectShijianDuan = form.getFieldValue('shijianduan');
    setIsShowMoreTime(selectShijianDuan == -1);
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: '50%',
      align: 'center'
    },
    {
      title: '流量',
      dataIndex: 'flow',
      width: '50%',
      align: 'center',
      render: _text => {
        return _text.toFixed(2) + 'm³/s';
      }
    }
  ];

  useEffect(() => {
    true;
    if (id != -1) {
      form.setFieldValue('shijianduan', 24);
      form.setFieldValue('time_interval', 60);
      getData(true);
    }
  }, [id]);

  return (
    <CusModalWrapper>
      {/* 弹窗头部 */}
      <div className="cus-modal-header">
        <div>{data?.name}</div>
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
                      locale={locale}
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
                    getData(true);
                  }}>
                  返回
                </span>
              )}
              <div
                className="cus-modal-search-btn"
                onClick={() => {
                  getData(false);
                }}>
                查询
              </div>
            </div>
            <Form.Item
              name="time_interval"
              className="time_interval flex-center">
              <Radio.Group
                disabled={loading}
                onChange={() => {
                  getData(false);
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
          {graphOrList === 'graph' ? (
            <>
              {loading ? (
                <Loading loadingFlag={loading} />
              ) : (
                <Charts data={data.list} />
              )}
            </>
          ) : (
            <Table
              className="_list"
              loading={loading}
              // @ts-ignore
              columns={columns}
              dataSource={data.list}
              pagination={{
                position: ['bottomCenter'],
                pageSize: 5,
                showSizeChanger: false
              }}
            />
          )}
        </div>
      </div>
    </CusModalWrapper>
  );
};

interface ChartsProp {
  data: { flow: number; speed: number; time: string }[];
}
export const Charts = ({ data }: ChartsProp) => {
  // 水位 警戒水位 保证水位
  const color = ['#FEE549', '#4887C2'];
  return (
    <Fragment>
      <ReactECharts
        style={{
          width: '100%',
          height: '425rem'
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
          legend: {
            data: ['流量'],
            width: '100%',
            top: '10',
            itemHeight: 3,
            show: true,
            textStyle: {
              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize
            }
          },
          grid: {
            bottom: 60,
            top: 50,
            right: 20
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
          yAxis: {
            type: 'value',
            name: '流量(m³/s)',
            nameLocation: 'center',
            nameTextStyle: {
              color: '#fff',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize
            },
            min:
              Math.min(...data.map(item => item.flow)) - 5 > 0
                ? Math.min(...data.map(item => item.flow)) - 5
                : 0,
            max:
              Math.max(...data.map(item => item.flow)) - 1 > 0
                ? Math.max(...data.map(item => item.flow)) + 5
                : 1,
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
            splitLine: { lineStyle: { type: [5, 10], color: '#fff' } }
          },
          series: [
            {
              name: '流量',
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
                  return val == -1 ? '--' : val + 'm³';
                }
              },
              data: data.map(item => [item.time, Number(item.flow.toFixed(2))])
            }
          ]
        }}
      />
    </Fragment>
  );
};

export { FlowStationModal };
