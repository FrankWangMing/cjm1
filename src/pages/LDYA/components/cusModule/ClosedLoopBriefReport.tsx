/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { ResultQueryNoticeDetail, SolutionServer } from '@/service';
import { IMG_PATH, MomentFormatStr } from '@/utils/const';
import { useUpdateEffect } from '@umijs/hooks';
import { useMount, useSafeState } from 'ahooks';
import { Button, DatePicker, Form, InputNumber, message, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
const DATA_DESC = [
  {
    imgUrl: IMG_PATH.icon.manager_arrive_rate,
    title: '责任人到岗率',
    unit: '',
    keyWords: 'ownerOnDuty',
    min: 0,
    max: 100
  },
  {
    imgUrl: IMG_PATH.icon.attendance_rescue_team,
    title: '出勤救援队伍',
    unit: '支',
    keyWords: 'sosNum',
    min: 0,
    max: 30
  },
  {
    imgUrl: IMG_PATH.icon.settlement_point_enabled,
    title: '已启用安置点',
    unit: '个',
    keyWords: 'safeHouse',
    min: 0,
    max: 53
  },
  {
    imgUrl: IMG_PATH.icon.totalTrans,
    title: '总转移',
    unit: '人',
    keyWords: 'transferTotal',
    min: 0,
    max: 9123
  }
];
const ClosedLoopBriefReport = observer(() => {
  const [form] = Form.useForm();
  const formLayout = {};

  const queryNoticeDetails = async () => {
    let formData = form.getFieldsValue();
    let startTime = '',
      endTime = '';
    if (formData.sendTime) {
      startTime = formData.sendTime[0].format(MomentFormatStr);
      endTime = formData.sendTime[1].format(MomentFormatStr);
    }
    const data = await SolutionServer.queryNoticeDetails({
      type: 3,
      status: formData.msgStatus || 0,
      startTime,
      endTime
    });
    setNoticeDetail(data.noticeDetail);
    setCount(data.total);
  };
  const [count, setCount] = useSafeState(0);
  const [noticeDetail, setNoticeDetail] = useSafeState<
    ResultQueryNoticeDetail[]
  >([]);
  useMount(() => {
    queryNoticeDetails();
  });
  const [editNoticeId, setEditNoticeId] = useSafeState(-1);

  const [isSaveFlag, setIsSaveFlag] = useSafeState('xxx,false');
  /**
   * 处理保存
   */
  const handleSaveChange = async () => {
    setIsSaveFlag(Math.random() + ',' + true);
  };

  const STATUS_OPTIONS = [
    // {
    //   label: '已查看',
    //   value: 1
    // },
    {
      label: '处置中',
      value: 2
    },
    {
      label: '已闭环',
      value: 3
    }
  ];

  const reset = () => {
    form.setFieldsValue({
      sendTime: undefined,
      msgStatus: undefined
    });
    queryNoticeDetails();
  };

  return (
    <ClosedLoopBriefReportWrapper className="animate__animated animate__fadeIn">
      <div className="close-loop-header-outer flex-between">
        <Form form={form} {...formLayout} layout="inline">
          <Form.Item
            name="sendTime"
            label="信息发布时段"
            id="sendTime_Search_id">
            <DatePicker.RangePicker showTime={{ format: 'HH' }} />
          </Form.Item>
          <Form.Item name="msgStatus" label="信息状态">
            <Select options={STATUS_OPTIONS} style={{ width: '240rem' }} />
          </Form.Item>
          <Form.Item name="" label="">
            <Button className="opt-btn" onClick={queryNoticeDetails}>
              查询
            </Button>
            <Button className="opt-btn" onClick={reset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <p>
          共发布<span> {count} </span>条防汛专报
        </p>
      </div>
      <div className="close-loop-content-outer">
        {noticeDetail.map((item, index) => {
          return (
            <Fragment key={index}>
              <div className="close-loop-card-outer">
                <div className="close-loop-card-header flex-between">
                  <div className="flex">
                    <p>发布时间：{item.sendTime}</p>
                    <p>
                      抄送部门：
                      {item?.noticeDeptResponses?.map((subItem, index) => {
                        return (
                          subItem.department +
                          (item.noticeDeptResponses.length == index + 1
                            ? ''
                            : '、')
                        );
                      })}
                    </p>
                  </div>
                  {editNoticeId == item.noticeId ? (
                    <div>
                      <Button
                        style={{ marginRight: '10rem' }}
                        onClick={handleSaveChange}>
                        保存
                      </Button>
                      <Button
                        onClick={() => {
                          setEditNoticeId(-1);
                        }}>
                        取消
                      </Button>
                    </div>
                  ) : (
                    <img
                      src={IMG_PATH.icon.edit}
                      onClick={() => {
                        setEditNoticeId(item.noticeId);
                      }}
                      alt="编辑"
                    />
                  )}
                </div>
                <div className="close-loop-card-content flex-center">
                  <div className="msg-mark-rate">
                    <h1>信息读取率</h1>
                    <div className="charts-outer">
                      <span>
                        {Math.round((item.readNum / item.sendNum) * 1000) / 10}%
                      </span>
                      {/* <ProcessCharts percentVal={70} /> */}
                    </div>
                    <div className="data-desc">
                      <h1>已读{item.readNum}人</h1>
                      <h1>已发送{item.sendNum}人</h1>
                    </div>
                  </div>
                  <StepOuter
                    noticeDeptResponses={item.noticeDeptResponses}
                    sendTime={item.sendTime}
                    editNoticeId={editNoticeId}
                    noticeId={item.noticeId}
                    cancelEdit={() => {
                      setIsSaveFlag(Math.random() + ',' + false);
                      setEditNoticeId(-1);
                    }}
                    itemData={item}
                    isSaveFlag={isSaveFlag}
                    handleSearch={queryNoticeDetails}
                  />
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </ClosedLoopBriefReportWrapper>
  );
});
interface StepOuterProp {
  noticeDeptResponses: {
    actionDetail: string;
    actionTime: string;
    closeDetail: string;
    closeTime: string;
    department: string;
    responseDecision: string;
    status: number;
  }[];
  sendTime: string;
  editNoticeId: number;
  noticeId: number;
  cancelEdit: Function;
  itemData: any;
  isSaveFlag: string;
  handleSearch: Function;
}

const StepOuter: React.FC<StepOuterProp> = ({
  noticeDeptResponses: data,
  sendTime,
  editNoticeId,
  noticeId,
  cancelEdit,
  itemData,
  isSaveFlag,
  handleSearch
}) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [currDepartmentIndex, setCurrDepartmentIndex] = useSafeState(0);
  const [isEdit, setIsEdit] = useSafeState(false);
  useUpdateEffect(() => {
    setIsEdit(editNoticeId == noticeId);
  }, [editNoticeId]);
  const select_options = [
    {
      label: '经组织会商，应急管理部暂不启动防汛应急响应',
      value: '经组织会商，应急管理部暂不启动防汛应急响应'
    },
    {
      label: '经组织会商，应急管理部拟启动IV级防汛应急响应',
      value: '经组织会商，应急管理部拟启动IV级防汛应急响应'
    },
    {
      label: '经组织会商，应急管理部拟启动Ⅲ级防汛应急响应',
      value: '经组织会商，应急管理部拟启动Ⅲ级防汛应急响应'
    },
    {
      label: '经组织会商，应急管理部拟启动Ⅱ级防汛应急响应',
      value: '经组织会商，应急管理部拟启动Ⅱ级防汛应急响应'
    },
    {
      label: '经组织会商，应急管理部拟启动Ⅰ级防汛应急响应',
      value: '经组织会商，应急管理部拟启动Ⅰ级防汛应急响应'
    }
  ];

  const save = async () => {
    let form1Data = form1.getFieldsValue();
    let formData = form.getFieldsValue();
    let status = data[currDepartmentIndex].status;
    if (formData.czzDetail && formData.czzTime) {
      status = 2;
      if (formData.ybhDetail && formData.ybhTime) {
        status = 3;
      }
    }
    let body = {
      noticeDeptResponses: [
        {
          actionDetail: formData.czzDetail || '',
          actionTime: formData.czzTime || '',
          closeDetail: formData.ybhDetail || '',
          closeTime: formData.ybhTime || '',
          department: data[currDepartmentIndex].department,
          noticeId: noticeId,
          responseDecision: '',
          status: status
        }
      ],
      noticeId: noticeId,
      ownerOnDuty: form1Data.ownerOnDuty || 0,
      safeHouse: form1Data.safeHouse || 0,
      sosNum: form1Data.sosNum || 0,
      transferTotal: form1Data.transferTotal || 0
    };
    await SolutionServer.updateNoticeResponse(body);
    message.success('修改成功');
    handleSearch();
    cancelEdit();
  };
  const _len = (str: string) => {
    return str.length;
  };

  const formInit = () => {
    form.setFieldsValue({
      czzDetail:
        _len(data[currDepartmentIndex]?.actionDetail) > 0
          ? data[currDepartmentIndex]?.actionDetail
          : undefined,
      czzTime:
        _len(data[currDepartmentIndex]?.actionTime) > 0
          ? moment(data[currDepartmentIndex]?.actionTime)
          : undefined,
      ybhDetail:
        _len(data[currDepartmentIndex]?.closeDetail) > 0
          ? data[currDepartmentIndex]?.closeDetail
          : undefined,
      ybhTime:
        _len(data[currDepartmentIndex]?.closeTime) > 0
          ? moment(data[currDepartmentIndex]?.closeTime)
          : undefined
    });
    form1.setFieldsValue({
      ownerOnDuty: itemData.ownerOnDuty,
      sosNum: itemData.sosNum,
      safeHouse: itemData.safeHouse,
      transferTotal: itemData.transferTotal
    });
  };

  useUpdateEffect(() => {
    if (isEdit) {
      formInit();
    }
  }, [isEdit]);

  useEffect(() => {
    if (!data || data.length == 0) return;
  }, [data]);
  useUpdateEffect(() => {
    if (noticeId == editNoticeId && isSaveFlag.split(',')[1] == 'true') {
      save();
    }
  }, [isSaveFlag]);
  return (
    <Fragment>
      {/* 中间步骤条 */}
      <div className="step-outer">
        <div className="step-outer-header-outer flex">
          {data?.map((subItem, index) => {
            return (
              <div
                className={[
                  'step-outer-header-item',
                  currDepartmentIndex == index &&
                    'step-outer-header-item_active'
                ].join(' ')}
                onClick={() => {
                  setCurrDepartmentIndex(index);
                  cancelEdit();
                }}>
                {subItem.department}
              </div>
            );
          })}
        </div>
        {data?.length > 0 ? (
          <Form form={form} className="step-content-outer">
            <div className="step-content-item">
              <img src={IMG_PATH.icon.confirm} alt="" />
              <div className="step-time">
                <p>{moment(sendTime).format('MM/DD')}</p>
                <p>{moment(sendTime).format('HH:mm')}</p>
              </div>
              <p className="step-status">已发布：</p>
              <p className="step-desc">
                向 {data[currDepartmentIndex]?.department} 发布防汛专报
              </p>
            </div>
            {/* 处置中 */}
            <div className="step-content-item">
              {data[currDepartmentIndex]?.actionTime != '' || isEdit ? (
                <img src={IMG_PATH.icon.confirm} alt="" />
              ) : (
                <img src={IMG_PATH.icon.confirm_waiting} alt="" />
              )}
              {!isEdit &&
                (data[currDepartmentIndex]?.actionTime != '' ? (
                  <div className="step-time">
                    <p>
                      {moment(data[currDepartmentIndex]?.actionTime).format(
                        'MM/DD'
                      )}
                    </p>
                    <p>
                      {moment(data[currDepartmentIndex]?.actionTime).format(
                        'HH:mm'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="step-time"></div>
                ))}
              {isEdit && (
                <div className="step-time_edit">
                  <Form.Item name="czzTime">
                    <DatePicker clearIcon={null} showTime suffixIcon={null} />
                  </Form.Item>
                </div>
              )}
              <p className="step-status">处置中：</p>
              {data[currDepartmentIndex]?.actionTime != '' && !isEdit && (
                <p className="step-desc">
                  {data[currDepartmentIndex].actionDetail}
                </p>
              )}
              {isEdit && (
                <Form.Item name="czzDetail">
                  <Select
                    style={{ width: '380rem' }}
                    options={select_options}
                  />
                </Form.Item>
              )}
              {<div className="step-line"></div>}
            </div>
            {/* 已闭环 */}
            <div className="step-content-item">
              {data[currDepartmentIndex]?.closeTime != '' || isEdit ? (
                <img src={IMG_PATH.icon.confirm} alt="" />
              ) : (
                <img src={IMG_PATH.icon.confirm_waiting} alt="" />
              )}
              {!isEdit &&
                (data[currDepartmentIndex]?.closeTime != '' ? (
                  <div className="step-time">
                    <p>
                      {moment(data[currDepartmentIndex]?.closeTime).format(
                        'MM/DD'
                      )}
                    </p>
                    <p>
                      {moment(data[currDepartmentIndex]?.closeTime).format(
                        'HH:mm'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="step-time"></div>
                ))}
              {isEdit && (
                <div className="step-time_edit">
                  <Form.Item name="ybhTime">
                    <DatePicker clearIcon={null} showTime suffixIcon={null} />
                  </Form.Item>
                </div>
              )}
              <p className="step-status">已闭环：</p>
              {data[currDepartmentIndex].closeTime != '' && !isEdit && (
                <p className="step-desc">
                  {data[currDepartmentIndex]?.closeDetail}
                </p>
              )}
              {isEdit && (
                <Form.Item name="ybhDetail">
                  <Select
                    style={{ width: '380rem' }}
                    options={select_options}
                  />
                </Form.Item>
              )}
              {!isEdit && data[currDepartmentIndex].closeTime == '' && (
                <div className="step-line step-line_grey"></div>
              )}
              {(isEdit || data[currDepartmentIndex].closeTime != '') && (
                <div className="step-line"></div>
              )}
            </div>
          </Form>
        ) : (
          <h1 style={{ background: 'red', color: '#fff', fontSize: '30rem' }}>
            数据异常
          </h1>
        )}
      </div>
      {/* 右边数据统计条 */}
      <div className="data-show-outer">
        <Form form={form1} className="flex">
          {DATA_DESC.map((item, index) => {
            return (
              <div className="data-show-item" key={index}>
                <img src={item.imgUrl} alt={item.title} />
                <h1>{item.title}</h1>
                {editNoticeId != noticeId ? (
                  <h2>
                    <span>
                      {itemData[item.keyWords] + ' '}
                      {item.unit == '' && '%'}
                    </span>
                    {item.unit}
                  </h2>
                ) : (
                  <Form.Item name={item.keyWords}>
                    <InputNumber
                      controls={false}
                      min={item.min}
                      max={item.max}
                      placeholder={item.min + '-' + item.max}
                    />
                  </Form.Item>
                )}
              </div>
            );
          })}
        </Form>
      </div>
    </Fragment>
  );
};

const ClosedLoopBriefReportWrapper = styled.div`
  .close-loop-header-outer {
    padding: 0 20rem;
    width: 100%;
    height: 62rem;
    background-image: linear-gradient(
      180deg,
      rgba(0, 5, 17, 0.5) 0%,
      #282c35 100%
    );
    -radius: 4rem;
    p {
      font-family: AlibabaPuHuiTiR;
      font-size: 24rem;
      color: #ffffff;
      span {
        font-family: DIN-BlackItalic;
        font-size: 32rem;
      }
    }
    .ant-form-item,
    .ant-form-item-label {
      display: flex;
      align-items: center;
      margin-right: 10rem;
    }
    .ant-form-item {
      margin-right: 20rem;
    }
    .ant-picker-range {
      width: 360rem;
      height: 40rem;
      background: #000000;
      border: 1rem solid rgba(0, 0, 0, 1);
      -radius: 2rem;
      span {
        color: #fff;
      }
    }
    .ant-picker-input > input {
      background-color: rgba(1, 1, 1, 0);
      color: #ffffff;
    }
    .ant-form-item-label > label {
      font-family: AlibabaPuHuiTiR;
      font-size: 24rem;
      color: #ffffff;
    }
    .ant-select-selector {
      width: 240rem;
      height: 40rem;
      display: flex;
      align-items: center;
      background-color: #000;
      span {
        color: #fff;
        font-family: AlibabaPuHuiTiR;
        font-size: 20rem;
      }
    }
    .ant-select-arrow {
      color: #fff;
    }
    .opt-btn {
      width: 80rem;
      height: 40rem;
      background-image: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      border: 1rem solid rgba(147, 182, 230, 1);
      -radius: 4rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #333333;
      text-align: center;
    }
    .opt-btn:hover,
    .opt-btn:active {
      background-color: #2c51b3 !important;
    }
    .opt-btn:nth-child(1) {
      margin: 0 10rem 0 30rem;
    }
  }
  .close-loop-content-outer {
    ::-webkit-scrollbar {
      /*整体样式*/
      width: 10rem;
    }
    ::-webkit-scrollbar-thumb {
      /*滚动条小方块*/
      border-radius: 10rem;
      background-color: #2e75d3;
      /* background-color: #dee7f6; */
    }
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
    height: calc(100vh - 310rem);
    padding-bottom: 10rem;
    .close-loop-card-outer {
      width: 100%;
      height: 380rem;
      margin-top: 10rem;
      .close-loop-card-header {
        height: 60rem;
        width: 100%;
        padding: 0 20rem;
        background-image: linear-gradient(
          180deg,
          rgba(0, 5, 17, 0.5) 0%,
          #282c35 100%
        );
        -radius: 4rem 4rem 0rem 0rem;
        p {
          font-family: AlibabaPuHuiTiB;
          font-size: 24rem;
          color: #ffffff;
        }
        p:nth-child(1) {
          margin-right: 80rem !important;
        }
        img {
          cursor: pointer;
        }
      }
      .close-loop-card-content {
        width: 100%;
        height: 320rem;
        background-image: linear-gradient(
          180deg,
          rgba(37, 56, 96, 0.8) 1%,
          rgba(0, 0, 0, 0.6) 99%
        );
        padding: 10rem 20rem;
      }
      .msg-mark-rate {
        width: 11%;
        height: 300rem;
        padding: 10rem 20rem;
        background: rgba(0, 2, 7, 0.2);
        box-shadow: inset 0rem -1rem 0rem 0rem rgba(61, 70, 92, 1);
        h1 {
          font-family: AlibabaPuHuiTiB;
          font-size: 20rem;
          color: #ffffff;
          width: 100%;
          text-align: center;
        }
        .data-desc {
          width: 100%;
          margin-top: 20rem;
          h1 {
            text-align: center !important;
          }
        }
        h1:nth-child(1) {
          text-align: left;
        }
        margin-right: 20rem;
        .charts-outer {
          width: 100%;
          height: 140rem;
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            font-family: DIN-BlackItalic;
            font-size: 40rem;
            color: #ffffff;
            text-align: center;
          }
        }
      }
      .step-outer {
        width: 39%;
        height: 300rem;
        .step-outer-header-outer {
          width: 100%;
          height: 40rem;
          background: rgba(149, 174, 255, 0.28);
          .step-outer-header-item {
            width: 25%;
            height: 100%;
            cursor: pointer;
            text-align: center;
            line-height: 40rem;
            background-image: linear-gradient(
              0deg,
              #2a4378 0%,
              rgba(117, 154, 197, 0) 99%
            );
            border: 1rem solid rgba(11, 40, 73, 0.5);
            font-family: AlibabaPuHuiTiR;
            font-size: 20rem;
            color: #ffffff;
          }
          .step-outer-header-item_active {
            background: #2c51b3;
            border: 1rem solid rgba(61, 70, 92, 1);
          }
        }
        .step-content-outer {
          width: 100%;
          height: calc(100% - 40rem);
          padding: 0rem 20rem;
          .step-content-item {
            position: relative;
            display: flex;
            align-items: center;
            height: 33%;
            p {
              font-family: AlibabaPuHuiTiR;
              font-size: 20rem;
              color: #ffffff;
            }
            img {
              width: 32rem;
              height: 32rem;
            }
            .step-time {
              margin-left: 10rem;
              width: 70rem;
              margin-right: 40rem;
            }
            .step-time_edit {
              margin-left: 10rem;
              width: 200rem;
              margin-right: 10rem;
            }
            .step-status {
              width: 80rem;
              margin-right: 20rem !important;
              display: flex;
              align-items: center;
            }
            .step-desc {
              font-size: 18rem;
            }
            .step-line {
              width: 2rem;
              height: 50rem;
              position: absolute;
              left: 15rem;
              top: -25rem;
              background-color: #52c41a;
              border-radius: 2rem;
            }
            .step-line_grey {
              background-color: #808080;
            }
          }
        }
      }
      .data-show-outer {
        width: 50%;
        height: 300rem;
        margin-left: 20rem;
        .data-show-item {
          width: 25%;
          height: 100%;
          background: rgba(0, 2, 7, 0.2);
          box-shadow: inset 0rem -1rem 0rem 0rem rgba(61, 70, 92, 1);
          padding: 20rem;
          img {
            width: 90%;
          }
          h1 {
            width: 100%;
            font-family: AlibabaPuHuiTiB;
            font-size: 20rem;
            color: #ffffff;
            text-align: center;
            margin: 0;
          }
          h2 {
            width: 100%;
            font-family: AlibabaPuHuiTiB;
            font-size: 20rem;
            color: #ffffff;
            text-align: center;
            margin: 0;
            span {
              font-family: DIN-BlackItalic;
              font-size: 30rem;
              color: #ffffff;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .ant-input-number {
    width: 100%;
  }
  input {
    background-color: #000;
    color: #fff;
    font-size: 40rem;
    width: 100%;
    height: 50rem;
    font-family: DIN-BlackItalic;
    line-height: 50rem;
    text-align: center;
  }
  .ant-select,
  .ant-picker,
  .ant-picker-input input,
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: #000;
    color: #fff;
    span {
      color: #fff;
    }
  }
  .ant-form-item {
    margin: 0;
  }
`;
export { ClosedLoopBriefReport };
