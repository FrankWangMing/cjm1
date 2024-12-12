/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import Loading from '@/components/Loading';
import { LoginService, SolutionServer } from '@/service';
import { getParamObj, sleep } from '@/utils';
import { MomentFormatStr } from '@/utils/const';
import { useMount } from '@umijs/hooks';
import { useSafeState } from 'ahooks';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space
} from 'antd';
import dd from 'gdt-jsapi';
import { observer, useLocalStore } from 'mobx-react-lite';
import moment from 'moment';
import { Fragment } from 'react';
import { cityManageOptions } from './const';
import './index.less';

// 传递的值有：当前部门，当前防汛专报id，
const DealBrief: React.FC = observer(() => {
  const store = useLocalStore(() => ({
    currStep: 'czz', // 当前步骤 'czz'|'ybh'|'done'
    inDisposal: '', // 处置中状态
    tempInDisposal: '', // 处置中状态
    closedLoopStatus: '', //已闭环选中状态
    tempClosedLoopStatus: '',
    deptName: '应急管理局', // 当前部门名称
    isModalOpen: false,
    accountId: 0,
    noticeId: 0,
    loading: false,
    initLoading: false,
    formData: {
      ownerOnDuty: 0,
      safeHouse: 0,
      sosNum: 0,
      transferTotal: 0
    }
  }));
  /**
   * 查询指定防汛专报处置状态
   */
  const queryNoticeResponse = async () => {
    const res = await SolutionServer.queryNoticeResponse(store.noticeId);
    const currStepData = res.noticeDeptResponses.filter(item => {
      return store.deptName == item.department;
    });
    store.inDisposal = currStepData[0].actionDetail;
    store.tempInDisposal = currStepData[0].actionDetail;
    store.closedLoopStatus = currStepData[0].closeDetail;
    store.tempClosedLoopStatus = currStepData[0].closeDetail;
    store.currStep = store.inDisposal == '' ? 'czz' : 'ybh';
    initFormData(res.ownerOnDuty, res.safeHouse, res.sosNum, res.transferTotal); // 根据当前NoticeId填充处置决策的表单数据。
  };
  const [errMsg, setErrMsg] = useSafeState('');
  useMount(() => {
    try {
      let paramObj = getParamObj(window.location.href);
      let params = paramObj['params'].split(',');
      store.noticeId = Number(params[0]);
      store.initLoading = true;
      dd.getAuthCode({})
        .then(async res => {
          if (res.code != undefined || res.auth_code != undefined) {
            let code = res.code || res.auth_code;
            const data = await LoginService.dingtalklogin(code!);
            store.accountId = data.accountId;
            store.deptName = data.orgName;
            await queryNoticeResponse();
            store.initLoading = false;
          }
        })
        .catch(err => {
          setErrMsg(err);
          message.error(err);
        });
      queryNoticeResponse();
    } catch (e) {
      message.error('链接有问题');
      setErrMsg('链接有问题');
    }
  });

  /**
   * 处理提交事件
   */
  const handleSubmit = () => {
    let tempVal =
      store.currStep == 'czz'
        ? store.tempInDisposal
        : store.tempClosedLoopStatus;
    if (tempVal == '') {
      message.info(
        `请选择${store.currStep == 'czz' ? '处置决策' : '闭环内容'}`
      );
      return;
    }
    let tempData = form.getFieldsValue();
    store.formData = {
      safeHouse: tempData.safeHouse || 0,
      sosNum: tempData.sosNum || 0,
      transferTotal: tempData.transferTotal || 0,
      ownerOnDuty: tempData.ownerOnDuty || 0
    };
    store.isModalOpen = true;
  };
  /**
   * 模态窗确认
   */
  const handleModalOk = async () => {
    handleModalCancel();
    store.loading = true;
    let body = {
      accountId: store.accountId,
      actionType: store.currStep == 'czz' ? 2 : 3,
      deptName: store.deptName,
      noticeId: store.noticeId,
      statusDetail:
        store.currStep == 'czz'
          ? store.tempInDisposal
          : store.tempClosedLoopStatus,
      time: moment().format(MomentFormatStr),
      ownerOnDuty: store.formData.ownerOnDuty,
      transferTotal: store.formData.transferTotal,
      sosNum: store.formData.sosNum,
      safeHouse: store.formData.safeHouse
    };
    const res = await SolutionServer.actionCallBack(body);
    message.info(res);
    store.loading = false;
    queryNoticeResponse();
  };
  /**
   * 模态窗关闭
   */
  const handleModalCancel = () => {
    store.isModalOpen = false;
  };

  const [form] = Form.useForm();

  /**
   * 根据已经存在的数据进行数据初始化
   */
  const initFormData = (
    ownerOnDuty: number,
    safeHouse: number,
    sosNum: number,
    transferTotal: number
  ) => {
    form.setFieldsValue({
      ownerOnDuty,
      safeHouse,
      sosNum,
      transferTotal
    });
  };

  return (
    <div className="deal-brief-outer">
      {store.initLoading ? (
        <Loading loadingFlag={store.initLoading} />
      ) : errMsg != '' ? (
        <h1>{errMsg}</h1>
      ) : (
        <Fragment>
          <h1>请针对《防汛专报》选择处置决策：</h1>
          <Radio.Group
            style={{ marginTop: '20px' }}
            value={store.currStep}
            onChange={e => {
              store.currStep = e.target.value;
            }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value={'czz'} disabled={store.inDisposal != ''}>
                处置中
              </Radio>
              <Select
                style={{ width: '100%' }}
                value={store.tempInDisposal}
                disabled={store.inDisposal != ''}
                onChange={e => {
                  store.tempInDisposal = e;
                }}
                options={cityManageOptions.czz}
              />
              <Radio value={'ybh'} disabled={store.inDisposal == ''}>
                已闭环
              </Radio>
              <Select
                disabled={store.inDisposal == ''}
                value={store.tempClosedLoopStatus}
                style={{ width: '100%' }}
                onChange={e => {
                  store.tempClosedLoopStatus = e;
                }}
                options={cityManageOptions.ybh}
              />
            </Space>
          </Radio.Group>
          <Form form={form}>
            <Form.Item label="责任人到岗率（%）" name="ownerOnDuty">
              <InputNumber
                min={0}
                max={100}
                style={{ width: '100%' }}
                placeholder="请输入0-100之间的整数"
              />
            </Form.Item>
            <Form.Item label="出勤救援队伍（支）" name="sosNum">
              <InputNumber
                min={0}
                max={30}
                style={{ width: '100%' }}
                placeholder="请输入0-30之间的整数"
              />
            </Form.Item>
            <Form.Item label="已启用安置点（个）" name="safeHouse">
              <InputNumber
                min={0}
                max={53}
                style={{ width: '100%' }}
                placeholder="请输入0-53之间的整数"
              />
            </Form.Item>
            <Form.Item label="总转移（人）" name="transferTotal">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                max={9123}
                placeholder="请输入0-9123之间的整数"
              />
            </Form.Item>
          </Form>
          <div className="operation-outer flex-center">
            <Button type="primary" onClick={handleSubmit}>
              提交
            </Button>
          </div>
          <Modal
            title={store.currStep == 'czz' ? '处置确认' : '闭环确认'}
            open={store.isModalOpen}
            onOk={handleModalOk}
            onCancel={handleModalCancel}>
            <Fragment>
              {store.currStep == 'czz'
                ? store.tempInDisposal
                : store.tempClosedLoopStatus}
              <p> {'责任人到岗率：' + store.formData.ownerOnDuty}</p>
              <p> {'安置点个数：' + store.formData.safeHouse}</p>
              <p> {'救援队数量：' + store.formData.sosNum}</p>
              <p> {'转移总数：' + store.formData.transferTotal}</p>
            </Fragment>
          </Modal>
          <Loading loadingFlag={store.loading} />
        </Fragment>
      )}
    </div>
  );
});
export default DealBrief;
