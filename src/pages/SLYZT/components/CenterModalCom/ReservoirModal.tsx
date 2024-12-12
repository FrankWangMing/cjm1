/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { Form, Radio, Table } from 'antd';
import GlobalStore from '@/store';
import ReactECharts from 'echarts-for-react';
import { useSafeState } from 'ahooks';
import { Fragment, useEffect, useRef } from 'react';
import Carousel, { CarouselRef } from 'antd/lib/carousel';
import moment from 'moment';
import DatePicker, { RangePickerProps } from 'antd/lib/date-picker';
import { MomentFormatStr } from '@/utils/const';
import { ShowServer } from '@/service/show';
import { downloadFile } from '@/utils';
import Loading from '@/components/Loading';
import { DamDescCom } from '../DamDesc';
import { CloseOutlined } from '@ant-design/icons';
import { CusModalWrapper, ReservoirModalWrapper } from '../../style';
import locale from 'antd/es/date-picker/locale/zh_CN';

interface ILeft {
  title: string;
  value: string | number;
  unit: string;
}
/**
 * 大坝的弹窗内容
 */
interface IReservoirModal {
  id: number;
  handleClose: Function;
}

const ReservoirModal: React.FC<IReservoirModal> = ({ id, handleClose }) => {
  const [topData, setTopData] = useSafeState<ILeft[]>([]);
  const [leftData, setLeftData] = useSafeState<ILeft>();
  const [rightData, setRightData] = useSafeState<ILeft[]>([]);
  const [tableData, setTableData] = useSafeState<ILeft[]>([]);
  const [floodLimitWater, setFloodLimitWater] = useSafeState<number>();
  const [name, setName] = useSafeState<string>('');

  // 获取 水库详情
  const reservoirDetailById = async () => {
    setLoading(true);
    const data = await ShowServer.reservoirStation.getById(id);
    let {
      left_tempData,
      right_tempData,
      table_tampData,
      top_tempData,
      floodLimitWaterLevel,
      name
    } = format_modal_dam(data);
    setLeftData(left_tempData);
    setRightData(right_tempData);
    setTableData(table_tampData);
    setTopData(top_tempData);
    setFloodLimitWater(floodLimitWaterLevel);
    setName(name);
    setLoading(false);
  };

  const [currIndex, setCurrIndex] = useSafeState(0);
  const [loading, setLoading] = useSafeState(true);
  const ref = useRef<CarouselRef | null>(null);

  const handleBeforeChange = (from: number, to: number) => {
    setCurrIndex(to);
  };

  useEffect(() => {
    if (id != -1) {
      form.setFieldValue('shijianduan', 24);
      form.setFieldValue('time_interval', 60);
      getDataByTime(true);
      reservoirDetailById();
    }
  }, [id]);

  const [rainFallData, setRainFallData] = useSafeState<
    {
      time: string;
      value: number;
    }[]
  >([]);
  const [waterLineData, setWaterLineData] = useSafeState<
    {
      time: string;
      value: number;
    }[]
  >([]);
  const [isShowMoreTime, setIsShowMoreTime] = useSafeState(false);
  const [form] = Form.useForm();
  const handleTimeRadioChange = () => {
    let selectShijianDuan = form.getFieldValue('shijianduan');
    setIsShowMoreTime(selectShijianDuan == -1);
  };
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

  const getDataByTime = async (isInit?) => {
    form
      .validateFields()
      .then(async res => {
        const { startTime, endTime } = isInit
          ? {
              startTime: moment().subtract(24, 'hours').format(MomentFormatStr),
              endTime: moment().format(MomentFormatStr)
            }
          : getCurrSelectTime(res);
        setFetchDataIng(true);
        const { list } = await ShowServer.statistic.waterRain(
          startTime,
          endTime,
          Number(id),
          res.time_interval || 60
        );
        let rain: { time: string; value: number }[] = [],
          waterLevel: { time: string; value: number }[] = [];
        list.map(item => {
          rain.push({ time: item.time, value: item.rain });
          waterLevel.push({ time: item.time, value: item.waterLevel });
        });
        setRainFallData(rain);
        setWaterLineData(waterLevel);
        setFetchDataIng(false);
      })
      .catch(res => {});
  };

  const [graphOrList, setGraphOrList] = useSafeState<'graph' | 'list'>('graph');

  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: '50%',
      align: 'center'
    },
    {
      title: '水位',
      dataIndex: 'value',
      width: '50%',
      align: 'center'
    }
  ];

  const handleDownload = async () => {
    form.validateFields().then(async res => {
      const { startTime, endTime } = getCurrSelectTime(res);
      const { filePath } = await ShowServer.download.waterStation({
        startTime,
        endTime,
        stationId: Number(id),
        timeGap: res.time_interval || 60
      });
      downloadFile(
        filePath,
        `${startTime}至${endTime}的水库水雨情数据下载.xlsx`
      );
    });
  };
  const [fetchDataIng, setFetchDataIng] = useSafeState(false);

  return (
    <Fragment>
      {/* 弹窗头部 */}
      <div className="cus-modal-header">
        <div>{name}</div>
        <CloseOutlined onClick={() => handleClose()} alt="关闭" />
      </div>
      <ReservoirModalWrapper style={{ height: '540rem' }}>
        <Loading loadingFlag={loading} />
        {!loading && (
          <Carousel
            dots={false}
            ref={ref}
            beforeChange={handleBeforeChange}
            infinite={false}>
            <div className="shuiku-table-outer">
              <div className="table-tr table-th">
                {tableData?.map((item, index) => {
                  return (
                    <div key={index} className="table-td">
                      {item.title}
                    </div>
                  );
                })}
              </div>
              <div className="table-tr">
                {tableData?.map((item, index) => {
                  return (
                    <div className="table-td" key={index}>
                      <span>{item.value}</span>
                      {item.unit}
                    </div>
                  );
                })}
              </div>
              <DamDescCom
                size="large"
                leftData={leftData}
                rightData={rightData}
                topData={topData}
              />
            </div>
            <CusModalWrapper>
              {/* 查询区域 */}
              <div
                className="search-form-outer"
                style={{ height: '80rem', padding: 0 }}>
                <Form
                  className="_content flex-between"
                  id="asdqwdqegqrq"
                  form={form}
                  onChange={handleTimeRadioChange}>
                  <div
                    className="time-operation-outer"
                    style={{ padding: '0 10rem' }}>
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
                      <Form.Item name="shijianduan">
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
              <div
                className="content-list-graph"
                style={{
                  display: 'block',
                  margin: graphOrList === 'graph' ? '20rem 0' : '0'
                }}>
                {rainFallData?.length > 0 &&
                  waterLineData.length > 0 &&
                  graphOrList === 'graph' && (
                    <div className="chart-title flex-between">
                      <p>水雨情过程线：</p>
                      <div className="flex-center">
                        <div className="bar bar-colorRain"></div>雨量
                        <div className="bar bar-color_waterLine"></div>水位
                        <div className="bar bar-color_limit"></div>汛限水位
                      </div>
                    </div>
                  )}
                <div
                  className="content-list-graph"
                  style={{
                    display: 'block',
                    height: '350rem'
                  }}>
                  {rainFallData?.length > 0 && waterLineData.length > 0 ? (
                    graphOrList === 'graph' ? (
                      <>
                        <ReservoirCharts
                          rainFallData={rainFallData}
                          waterLineData={waterLineData}
                          floodLimitWater={floodLimitWater || 0}
                        />
                      </>
                    ) : (
                      <Table
                        className="_list"
                        // @ts-ignore
                        columns={columns}
                        dataSource={waterLineData}
                        pagination={{
                          position: ['bottomCenter'],
                          pageSize: 6,
                          showSizeChanger: false
                        }}
                      />
                    )
                  ) : (
                    <strong>暂无数据</strong>
                  )}
                </div>
              </div>
            </CusModalWrapper>
          </Carousel>
        )}
        {!loading && (
          <div className="switch-operation-outer">
            <div className="flex">
              <div
                onClick={() => {
                  ref.current?.goTo(0);
                }}
                className={[
                  'switch-operation-item',
                  currIndex == 0 ? 'switch-operation-item_active' : ''
                ].join(' ')}>
                基础信息
              </div>
              <div
                onClick={() => {
                  ref.current?.goTo(1);
                }}
                className={[
                  'switch-operation-item',
                  currIndex == 1 ? 'switch-operation-item_active' : ''
                ].join(' ')}>
                监测信息
              </div>
            </div>
            {currIndex == 1 && (
              <div className="download-btn" onClick={handleDownload}>
                下载
              </div>
            )}
          </div>
        )}
      </ReservoirModalWrapper>
    </Fragment>
  );
};

export { ReservoirModal };

const format_modal_dam = (obj: IReservoirStationDetail) => {
  return {
    left_tempData: {
      title: '最大坝高',
      value: obj.maxDamHeight?.toFixed(1),
      unit: 'm'
    },
    table_tampData: [
      { title: '总库容', value: obj.reservoirVolume?.toFixed(1), unit: '万㎡' },
      {
        title: '正常库容',
        value: obj.commonReservoirVolume?.toFixed(1),
        unit: '万㎡'
      },
      { title: '正常水位', value: obj.commonWaterLevel?.toFixed(2), unit: 'm' },
      { title: '集雨面积', value: obj.rainArea?.toFixed(1), unit: 'k㎡' }
    ],
    right_tempData: [
      {
        title: '校核洪水位',
        value: obj.checkWaterLevel?.toFixed(2),
        unit: 'm'
      },
      {
        title: '设计洪水位',
        value: obj.designWaterLevel?.toFixed(2),
        unit: 'm'
      },
      { title: '防洪高水位', value: obj.highWaterLevel?.toFixed(2), unit: 'm' },
      {
        title: '汛限水位',
        value: obj.floodLimitWaterLevel?.toFixed(2),
        unit: 'm'
      },
      { title: '当前水位', value: obj.realWaterLevel?.toFixed(2), unit: 'm' },
      { title: '死水位', value: obj.deadWaterLevel?.toFixed(2), unit: 'm' }
    ],
    top_tempData: [
      { title: '坝顶高程', value: obj.damTopHeight?.toFixed(2), unit: 'm' },
      { title: '坝顶宽', value: obj.damTopWide?.toFixed(1), unit: 'm' },
      { title: '坝顶长度', value: obj.damTopLength?.toFixed(1), unit: 'm' }
    ],
    floodLimitWaterLevel: obj.floodLimitWaterLevel,
    name: obj.name
  };
};

interface IReservoirCharts {
  rainFallData: {
    time: string;
    value: number;
  }[];
  waterLineData: {
    time: string;
    value: number;
  }[];
  floodLimitWater: number;
}

export const ReservoirCharts = ({
  rainFallData,
  waterLineData,
  floodLimitWater
}: IReservoirCharts) => {
  return (
    <Fragment>
      {/* 雨量 */}
      <ReactECharts
        style={{
          width: '100%',
          height: '50%'
        }}
        option={{
          xAxis: {
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
            show: false,
            axisPointer: {
              label: {
                show: false
              }
            }
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            textStyle: {
              fontFamily: 'AlibabaPuHuiTiM',
              fontSize: 16 * GlobalStore.fontSize
            }
          },
          yAxis: {
            type: 'value',
            name: '雨量(mm)',
            nameLocation: 'center',
            nameTextStyle: {
              color: '#fff',
              fontSize: 16 * GlobalStore.fontSize,
              fontFamily: 'AlibabaPuHuiTiR'
            },
            nameGap: 40,
            inverse: true,
            axisLabel: {
              formatter: '{value}',
              color: '#fff',
              fontSize: 16 * GlobalStore.fontSize,
              fontFamily: 'AlibabaPuHuiTiR',
              showMinLabel: true,
              showMaxLabel: true
            },
            alignTicks: false,
            splitLine: { lineStyle: { type: [5, 10], color: '#fff' } },
            axisPointer: {
              show: false
            }
          },
          grid: {
            // containLabel: true,
            // top: '5%',
            // left: '7%',
            // right: '5%',
            // bottom: '0%'
            top: 10,
            bottom: 20,
            right: 20
          },
          series: [
            {
              name: '雨量',
              data:
                rainFallData
                  .map(item => [item.time, item.value])
                  .sort((a, b) => {
                    return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
                  }) || [],
              step: 'start',
              type: 'line',
              smooth: true,
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val == -1 ? '--' : val + 'mm';
                }
              }
            }
          ]
        }}
      />
      {/* 水位 */}
      <ReactECharts
        style={{
          width: '100%',
          height: '50%'
        }}
        option={{
          color: ['#AD445E', '#4887C2'],
          tooltip: {
            trigger: 'axis',
            order: 'seriesAsc',
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
            textStyle: {
              fontFamily: 'AlibabaPuHuiTiM',
              fontSize: 16 * GlobalStore.fontSize
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
            data: ['水位', '汛限水位'],
            top: 10,
            right: 10,
            show: false
          },
          grid: {
            // containLabel: true,
            // top: '5%',
            // left: '4%',
            // right: '5%',
            // bottom: '0%'
            bottom: 40,
            top: 10,
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
                fontSize: 16 * GlobalStore.fontSize,
                color: '#FFFFFF',
                align: 'center',
                formatter: val => {
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
              min:
                Math.min(
                  ...waterLineData.map(item => item.value),
                  floodLimitWater
                ) - 10,
              nameLocation: 'center',
              nameGap: 40,
              nameTextStyle: {
                color: '#fff',
                fontSize: 16 * GlobalStore.fontSize,
                fontFamily: 'AlibabaPuHuiTiR'
              },
              axisLabel: {
                fontFamily: 'AlibabaPuHuiTiR',
                fontSize: 16 * GlobalStore.fontSize,
                color: '#FFFFFF',
                align: 'center',
                margin: 20,
                formatter: val => {
                  return Math.round((val * 10) / 10) == val ? val : '';
                },
                showMinLabel: true,
                showMaxLabel: true
              },
              axisPointer: {
                show: false
              },
              splitLine: { lineStyle: { type: [5, 10], color: '#fff' } }
            }
          ],
          series: [
            {
              name: '汛限水位',
              type: 'line',
              barGap: 0,
              lineStyle: {
                color: '#AD445E',
                width: 4
              },
              showSymbol: false,
              tooltip: {
                valueFormatter: val => {
                  return val == -1 ? '--' : val + 'm';
                }
              },
              data: waterLineData.map(item => [item.time, floodLimitWater])
            },
            {
              name: '水位',
              type: 'line',
              areaStyle: {
                color: 'rgba(72,135,194,0.40)'
              },
              lineStyle: {
                color: '#4887C2',
                width: 4
              },
              showSymbol: false,
              barGap: 0,
              smooth: true,
              tooltip: {
                valueFormatter: val => {
                  return val == -1 ? '--' : val + 'm';
                }
              },
              data:
                waterLineData
                  .map(item => [item.time, item.value])
                  .sort((a, b) => {
                    return new Date(a[0]).valueOf() - new Date(b[0]).valueOf();
                  }) || []
            }
          ]
        }}
      />
    </Fragment>
  );
};
