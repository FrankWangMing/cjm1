/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 水位站弹窗
 * 水位站-水库站 & 水位站-河道站
 */
import { useEffect } from 'react';
import { DatePicker, Form, Radio } from 'antd';
import moment from 'moment';
import { useSafeState } from 'ahooks';
import { MomentFormatStr } from '@/utils/const';
import { RangePickerProps } from 'antd/lib/date-picker';
import { IGaugingStationRes, ShowServer } from '@/service/show';
import ReactECharts from 'echarts-for-react';
import { Fragment } from 'react';
import GlobalStore from '@/store';
import styled from 'styled-components';

export { GaugingStationModal };

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
interface IGaugingStationModal {
  id: number | string | undefined;
  type: string;
}

/**
 * 水位站
 */
const GaugingStationModal = ({ id, type }: IGaugingStationModal) => {
  useEffect(() => {
    form.setFieldValue('shijianduan', 24);
    form.setFieldValue('time_interval', 60);
    fetchData(true);
  }, [id]);

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

  const [fetchDataIng, setFetchDataIng] = useSafeState<boolean>(true);

  return (
    <CusModalWrapper>
      {/* 弹窗头部 */}
      <div className="cus-modal-header">
        <div>{`${data.name}（${
          type === 'GAUGING_STATION_RIVER' ? '河道站' : '水库站'
        }）`}</div>
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
                  <Radio.Group name="radiogroup">
                    <Radio value={24} style={{ fontSize: '14rem' }}>
                      近24小时
                      <div className="lianjie-line line1"></div>
                    </Radio>
                    <Radio value={48} style={{ fontSize: '14rem' }}>
                      近48小时
                      <div className="lianjie-line line2"></div>
                    </Radio>
                    <Radio value={72} style={{ fontSize: '14rem' }}>
                      近72小时
                      <div className="lianjie-line line3"></div>
                    </Radio>
                    <Radio value={-1} style={{ fontSize: '14rem' }}>
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
          </Form>
        </div>
        {/* 内容区域 */}
        <div className="content-list-graph" style={{ padding: '0 20rem' }}>
          {data.list?.length > 0 ? (
            <GaugingRiverCharts
              alarmWaterLine={data.alarmWaterLevel}
              promiseWaterLine={data.guaranteeWaterLevel}
              realWater={data.list}
              floodWaterLine={data.floodLimitedWaterLevel}
              type={type}
            />
          ) : (
            <strong>暂无数据</strong>
          )}
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
          height: '600rem'
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
                    color: '#333',
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
                    color: '#333',
                    fontSize: 16 * GlobalStore.fontSize,
                    fontFamily: 'AlibabaPuHuiTiR'
                  }
                },
          grid: {
            containLabel: true,
            left: '5%',
            right: '20'
          },
          xAxis: [
            {
              type: 'time',
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
                color: '#333',
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize
              },
              min: Math.min(...realWater.map(item => item.waterLevel)) - 5,
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
              splitLine: { lineStyle: { type: [5, 10], color: '#333' } },
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
