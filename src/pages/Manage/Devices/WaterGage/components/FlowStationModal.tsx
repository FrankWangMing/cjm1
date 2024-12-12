/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { useSafeState } from 'ahooks';
import { ShowServer } from '@/service/show';
import moment from 'moment';
import { MomentFormatStr } from '@/utils/const';
import { Form, Radio, DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import { Fragment, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import GlobalStore from '@/store';
import Loading from '@/components/Loading';
import styled from 'styled-components';

const CusModalWrapper = styled.div`
  padding: 0;
  .time-operation-outer {
    width: 60%;
    display: flex;
    align-items: center;
    .ant-radio-group {
      display: flex;
      height: 30rem;
    }
    .ant-radio-wrapper {
      position: relative;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: DIN-BlackItalic, AlibabaPuHuiTiR;
      span.ant-radio + * {
        margin-top: 8rem;
      }
    }
    .ant-form label {
      color: #fff;
      display: flex;
      flex-direction: column !important;
      justify-content: center;
      align-items: center;
      height: 40rem;
      margin-right: 20rem;
    }
    .lianjie-line {
      width: 64rem;
      height: 2rem;
      background: rgba(255, 255, 255, 0.24);
      border-radius: 2rem;
      position: absolute;
      top: 0rem;
    }
    .line1 {
      right: -37rem;
    }
    .line2 {
      right: -37rem;
    }
    .line3 {
      width: 52rem;
      right: -23rem;
    }
  }
  .ant-picker-panel-container .ant-picker-panel {
    font-family: AlibabaPuHuiTiR;
    font-size: 16rem;
  }
  .ant-picker-range {
    width: 360rem;
    height: 40rem;
    border: 1rem solid rgba(0, 0, 0, 1);
    border-radius: 2rem;
    .ant-picker-input > input,
    span {
      font-family: AlibabaPuHuiTiR;
      font-size: 16rem;
    }
  }
  .search-form-outer {
    border-bottom: 1px solid #ffffff40;
    width: 100%;
    margin-top: 10rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rem;
    height: 15%;
    .back2select {
      /* color: rgba(188, 224, 255, 0.99); */
      font-size: 18rem !important;
      line-height: 40rem !important;
      margin: 0 10rem;
      cursor: pointer;
    }
    ._content {
      width: 100%;
    }
  }

  .content-list-graph {
    height: calc(73% - 10rem);
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    strong {
      font-size: 20px;
      color: #fff;
    }
    .ant-table,
    .ant-table-cell {
      background-color: rgba(1, 1, 1, 0);
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
      padding: 0;
      border: 0;
    }
    .ant-table-thead
      > tr
      > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
      display: none;
    }
    .ant-table-cell {
      padding: 0 10rem;
    }
    tr {
      height: 40rem;
      width: 100%;
      background: rgba(255, 255, 255, 0.08);
    }
    .ant-table-row:hover .ant-table-cell-row-hover {
      background-color: #2c51b3 !important;
    }
    tr:nth-child(odd) {
      background: rgba(201, 214, 255, 0.24);
    }
    .ant-table-thead {
      background: rgba(149, 174, 255, 0.28);
    }
    .ant-input {
      background-color: #000000;
      color: #333;
      border: 0;
      height: 32rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      margin: 0;
    }
    .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input,
    .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover {
      border: 3rem solid red;
      background: #000;
    }
    .ant-form-item-with-help .ant-form-item-explain {
      display: none;
    }
    table {
      border-spacing: 0 10rem !important;
    }
    .ant-table-pagination.ant-pagination {
      justify-content: center;
      margin: 0 !important;

      li {
        height: 40rem !important;
        font-family: AlibabaPuHuiTiR !important;
        line-height: 40rem !important;
      }
    }
    ._list {
      width: 100%;
      .ant-table-cell {
        font-size: 18rem;
        font-family: AlibabaPuHuiTiM;
      }
    }
  }
  .ant-radio-button-wrapper {
    background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
    border: unset !important;
    span {
      color: #333 !important;
    }
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    span {
      color: #fff !important;
    }
    background: linear-gradient(180deg, #5789da 0%, #2c51b3 100%);
  }
  .ant-radio-button-wrapper > .ant-radio-button span {
    color: black !important;
  }
  ._operation {
    width: 20%;
    display: flex;
    justify-content: flex-end;

    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before,
    .ant-radio-button-wrapper:not(:first-child)::before {
      content: none !important;
    }
    button {
      width: 70rem;
      margin: 0 5rem;
      padding: 0;
    }
    .ant-radio-group {
      width: 145rem;
      height: 32rem;
      display: flex;
    }
    .ant-radio-button-wrapper:active {
      box-shadow: unset !important;
    }

    .ant-radio-button-wrapper {
      width: 62rem;
      height: 32rem;
      text-align: center;
      line-height: 32rem;
      padding: 0;
      transition: all 200ms;
      font-family: AlibabaPuHuiTiM;
      font-size: 16rem;
    }
  }
  .operation-outer {
    width: 100%;
    padding: 12rem 20rem;
    background: linear-gradient(
      180deg,
      rgba(37, 56, 96, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    border-radius: 4rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    bottom: 0;
    .download-btn {
      width: 80rem;
      height: 40rem;
      font-size: 20rem;
      font-family: AlibabaPuHuiTiR;
      color: #333333;
      line-height: 40rem;
      background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      border-radius: 4rem;
      opacity: 0.8;
      border: 1rem solid #93b6e6;
      text-align: center;
      cursor: pointer;
      transition: all 200ms;
    }
    .download-btn:active {
      border: 2rem solid #1971c2;
    }
  }
  .ant-form-item {
    margin: 0 !important;
  }
  .time_interval span {
    color: #333 !important;
  }
`;
/**
 * 流量站 - 弹窗
 */

interface IFlowStationModalProp {
  id: number;
}
const FlowStationModal = ({ id }: IFlowStationModalProp) => {
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
  const [waterLevelList, setWaterLevelList] = useSafeState<
    { time: string; waterLevel: number; rain: number }[]
  >([]);
  const [loading, setLoading] = useSafeState(false);
  const [form] = Form.useForm();

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

      const { list } = await ShowServer.gaugingStation.infoById(
        startTime,
        endTime,
        Number(id),
        res.time_interval || 60
      );
      setWaterLevelList(list);
      console.log('datadata', data);
      setData(data);
      setLoading(false);
    });
  };
  const [isShowMoreTime, setIsShowMoreTime] = useSafeState(false);
  const handleTimeRadioChange = () => {
    let selectShijianDuan = form.getFieldValue('shijianduan');
    setIsShowMoreTime(selectShijianDuan == -1);
  };

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
      <div className="cus-modal-header" style={{ backgroundColor: '#5c7cfa' }}>
        <div>{data?.name}</div>
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
                      style={{ width: '350rem' }}
                      disabledDate={disabledDate}
                      onCalendarChange={onCalendarChange}
                    />
                  </Form.Item>
                </>
              ) : (
                <Form.Item
                  name="shijianduan"
                  style={{ marginBottom: 0, width: '100%' }}>
                  <Radio.Group name="radiogroup">
                    <Radio value={24} style={{ fontSize: '16rem' }}>
                      近24小时
                      <div className="lianjie-line line1"></div>
                    </Radio>
                    <Radio value={48} style={{ fontSize: '16rem' }}>
                      近48小时
                      <div className="lianjie-line line2"></div>
                    </Radio>
                    <Radio value={72} style={{ fontSize: '16rem' }}>
                      近72小时
                      <div className="lianjie-line line3"></div>
                    </Radio>
                    <Radio value={-1} style={{ fontSize: '16rem' }}>
                      更多
                    </Radio>
                  </Radio.Group>
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
          </Form>
        </div>
        {/* 内容区域 */}
        <div className="content-list-graph" style={{ padding: '0 20rem' }}>
          {loading ? (
            <Loading loadingFlag={loading} />
          ) : (
            <Charts data={data.list} waterLevelData={waterLevelList} />
          )}
        </div>
      </div>
    </CusModalWrapper>
  );
};

interface ChartsProp {
  data: { flow: number; speed: number; time: string }[];
  waterLevelData: { time: string; waterLevel: number; rain: number }[];
}
export const Charts = ({ data, waterLevelData }: ChartsProp) => {
  // 水位 警戒水位 保证水位
  const color = ['rgba(72, 135, 194)', '#45DDE6'];
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
            data: ['流量', '水位'],
            width: '100%',
            top: '10',
            itemHeight: 3,
            show: true,
            symbol: 'none',
            textStyle: {
              color: '#333',
              fontFamily: 'AlibabaPuHuiTiR',
              fontSize: 16 * GlobalStore.fontSize
            }
          },
          grid: {
            bottom: 60,
            top: 50,
            right: 70
          },
          xAxis: [
            {
              type: 'category',
              data: waterLevelData.map(item => item.time),
              axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                  color: '#333'
                },
                barGap: 0
              },
              boundaryGap: false,
              axisLabel: {
                fontFamily: 'AlibabaPuHuiTiR',
                color: '#333',
                fontSize: 16 * GlobalStore.fontSize,
                align: 'center',
                formatter: val => {
                  let tempTime = moment(val);
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
              name: '流量(m³/s)',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#333',
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
                color: '#333',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                showMinLabel: true,
                showMaxLabel: true
              },
              splitLine: { lineStyle: { type: [5, 10], color: '#333' } }
            },
            {
              type: 'value',
              name: '水位(m)',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#333',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              min:
                Math.min(...waterLevelData.map(item => item.waterLevel)) - 5 > 0
                  ? Math.min(...waterLevelData.map(item => item.waterLevel)) - 5
                  : 0,
              max:
                Math.max(...waterLevelData.map(item => item.waterLevel)) - 1 > 0
                  ? Math.max(...waterLevelData.map(item => item.waterLevel)) + 5
                  : 1,
              nameGap: 40,
              axisLabel: {
                formatter: e => {
                  return Math.round((e * 10) / 10) == e ? e : '';
                },
                color: '#333',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                showMinLabel: true,
                showMaxLabel: true
              },
              splitLine: { lineStyle: { type: [5, 10], color: '#333' } }
            }
          ],
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
            },
            {
              name: '水位',
              type: 'line',
              barGap: 0,
              lineStyle: {
                width: 4,
                color: '#45DDE6'
              },
              tooltip: {},
              data: waterLevelData.map(item => item.waterLevel),
              showSymbol: false,
              animationEasing: 'quadraticInOut'
            }
          ]
        }}
      />
    </Fragment>
  );
};

export { FlowStationModal };
