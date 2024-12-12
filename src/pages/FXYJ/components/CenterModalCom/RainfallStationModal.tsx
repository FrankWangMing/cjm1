/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { useMount, useSafeState } from 'ahooks';
import { DatePicker, Form, Radio, Table } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
import { ShowServer } from '@/service/show';
import { downloadFile } from '@/utils';
import GlobalStore from '@/store';
import { Fragment, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { CloseOutlined } from '@ant-design/icons';
import { CusModalWrapper } from './style';
import {
  CustomRadio,
  CustomRadioGroup
} from '@/components/AntdComponents/CustomRadio';
import { IMG_PATH, MomentFormatStr } from '@/utils/const';
import { values } from 'mobx';
/**
 * 雨量站
 */
interface RainfallProps {
  id: string | number | undefined;
  handleCloseModal: Function;
}
const RainfallStationModal: React.FC<RainfallProps> = ({
  id,
  handleCloseModal
}) => {
  const [form] = Form.useForm();
  const handleTimeRadioChange = () => {
    let selectShijianDuan = form.getFieldValue('shijianduan');
    setIsShowMoreTime(selectShijianDuan == -1);
  };
  useMount(() => {
    form.setFieldValue('shijianduan', 24);
  });

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

  const [data, setData] = useSafeState<IRainfallStationDetail>({
    name: '',
    rain: -1,
    rainArray: [],
    startTime: '',
    stationId: -1,
    endTime: ''
  });

  const handleDownLoad = async () => {
    // 获取当前的时间;
    const formData = form.getFieldsValue();
    const params = getCurrSelectTime(formData);
    const res = await ShowServer.download.rainStation(params);
    downloadFile(
      res.filePath,
      `雨量站_${data.name}_（${params.startTime}至${params.endTime}）.xlsx`
    );
  };

  const option = {
    legend: {
      data: ['前景柱', '背景柱']
    },
    xAxis: {
      type: 'time',
      position: 'top',
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          color: '#ffffff'
        }
      },
      axisPointer: {
        show: true,
        snap: true,
        type: 'line',
        label: { show: false }
      },
      axisLabel: {
        fontFamily: 'AlibabaPuHuiTiR',
        fontSize: 16 * GlobalStore.fontSize,
        color: '#FFFFFF',
        align: 'center',
        formatter: val => {
          let tempTime = moment(parseInt(val));
          return tempTime.format('MM/DD') + '\n' + tempTime.format('HH:mm');
        },
        showMinLabel: true,
        showMaxLabel: true
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff40',
          width: 1
        }
      }
    },
    grid: {
      containLabel: true,
      top: '5%',
      left: '5%',
      right: '5%',
      bottom: '5%'
    },
    yAxis: {
      name: '降雨量(mm)',
      nameLocation: 'center',
      nameTextStyle: {
        color: '#fff',
        fontFamily: 'AlibabaPuHuiTiR',
        fontSize: 16 * GlobalStore.fontSize
      },
      nameGap: 45 * GlobalStore.fontSize,
      type: 'value',
      inverse: true,
      show: true,
      axisLabel: {
        fontFamily: 'AlibabaPuHuiTiR',
        fontSize: 16 * GlobalStore.fontSize,
        color: '#FFFFFF',
        align: 'center',
        margin: 16 * GlobalStore.fontSize,
        showMinLabel: true,
        showMaxLabel: true
      },
      // splitLine: { show: false },
      splitLine: {
        show: true, // 显示分割线
        lineStyle: {
          color: 'rgba(69,88,101,1)', // 分割线颜色
          width: 1, // 分割线宽度
          type: 'dashed' // 分割线样式，虚线
        }
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff40',
          width: 0
        }
      }
    },
    tooltip: {
      show: true,
      formatter: function (params) {
        console.log(params);
        let isZero = Array.isArray(params);
        let currObj = isZero ? params[0] : params;
        return `${moment(currObj.value[0]).format(
          'YYYY/MM/DD HH:mm:ss'
        )} <br/><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-image:linear-gradient(180deg,#8EFFFB,#0051CE);"></span>
        降雨量 : ${currObj.value[1]}mm`;
      },
      textStyle: {
        fontFamily: 'AlibabaPuHuiTiM',
        fontSize: 16 * GlobalStore.fontSize
      }
    },
    series: [
      {
        data:
          data.rainArray
            ?.map(item => [item.time, item.value])
            .sort((a, b) => {
              return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
            }) ||
          [] ||
          [],
        type: 'bar',
        label: {
          show: false
        },
        barWidth: '12rem',
        itemStyle: {
          backgroundColor: 'rgba(122,140,153,0.20)',
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: ' rgba(29,115,107,0.60)' // 0% 处的颜色
              },
              {
                offset: 0.6,
                color: 'rgba(54,217,203,0.97)'
              },
              {
                offset: 1,
                color: '#85F2E9' // 100% 处的颜色
              }
            ],
            image: 'linear-gradient(180deg, # 0%, # 100%)'
          }
        }
      }
      // {
      //   name: '背景',
      //   type: 'bar',
      //   data:
      //     JIArainArraybcg?.map(item => [item.time, item.value]).sort((a, b) => {
      //       return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
      //     }) ||
      //     [] ||
      //     [],
      //   itemStyle: {
      //     color: 'rgba(122,140,153,0.20)',
      //     borderWidth: 50 // 背景宽度
      //   },
      //   barWidth: '32rem', // 背景柱的宽度
      //   z: 1 // 背景柱在下层
      // }
    ]
  };

  const getCurrSelectTime = res => {
    let startTime = '',
      endTime = moment().format(MomentFormatStr),
      stationId: number = Number(id);
    if (res.shijian) {
      startTime = res.shijian[0].format('YYYY-MM-DD 00:00:00');
      endTime = res.shijian[1].format('YYYY-MM-DD 23:59:59');
    } else {
      startTime = moment()
        .subtract(Number(res.shijianduan), 'hours')
        .format(MomentFormatStr);
    }
    return {
      startTime,
      endTime,
      stationId,
      timeGap: res.time_interval
    };
  };

  const getDataByTime = (isInit: boolean) => {
    form.validateFields().then(async res => {
      const { startTime, endTime } = isInit
        ? {
            startTime: moment().subtract(24, 'hours').format(MomentFormatStr),
            endTime: moment().format(MomentFormatStr)
          }
        : getCurrSelectTime(res);
      setFetchDataIng(true);
      const data = await ShowServer.rainfallStation.getById(
        Number(id),
        startTime,
        endTime,
        res['time_interval'] || 60
      );
      setData(data);
      setFetchDataIng(false);
    });
  };

  const [graphOrList, setGraphOrList] = useSafeState<'graph' | 'list'>('graph');

  useEffect(() => {
    getDataByTime(true);
    form.setFieldValue('time_interval', 60);
  }, [id]);

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: '50%',
      align: 'center'
    },
    {
      title: '雨量',
      dataIndex: 'value',
      width: '50%',
      align: 'center',
      render: _text => {
        return _text + 'mm';
      }
    }
  ];

  const [fetchDataIng, setFetchDataIng] = useSafeState(false);
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
        <div className="flex">
          {`${data.name}（雨量站）`}
          <div className="SLYZT-modal-title-desc">
            {'累计雨量： ' + (data.rain == -1 ? '暂无数据' : `${data.rain} mm`)}
          </div>
        </div>
        <CloseOutlined
          onClick={() => {
            handleCloseModal();
          }}
          alt="关闭"
        />
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
                  className=""
                  style={{ marginBottom: 0 }}>
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
                    getDataByTime(true);
                  }}>
                  返回
                </span>
              )}

              <div
                className="cus-modal-search-btn"
                onClick={() => {
                  getDataByTime(false);
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
                  getDataByTime(false);
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
        <div className="content-list-graph">
          {data.rainArray?.length > 0 ? (
            graphOrList === 'graph' ? (
              <ReactECharts
                style={{ height: '85%', width: '100%' }}
                option={option}
              />
            ) : (
              <Table
                className="_list"
                style={{ padding: '0 20rem' }}
                // @ts-ignore
                columns={columns}
                dataSource={data.rainArray}
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
        {/* 雨量站 */}
        <div className="operation-outer">
          <div className="download-btn" onClick={handleDownLoad}>
            下载
          </div>
        </div>
      </div>
    </CusModalWrapper>
  );
};
export { RainfallStationModal };
