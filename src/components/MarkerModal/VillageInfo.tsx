/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 弹窗中公用的村庄基本信息
 */
import { IVillageInfo } from '@/domain/valley';
import { useSafeState, useUnmount } from 'ahooks';
import { Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import GlobalStore from '@/store';
import { useUpdateEffect } from '@umijs/hooks';
import { VillageServer } from '@/service';
import { useEffect } from 'react';

interface props {
  data: IVillageInfo;
  villageId: number;
}

export const RISK_TYPE_OPTIONS = [
  { label: '临河隐患', value: '临河隐患' },
  { label: '阻水隐患', value: '阻水隐患' },
  { label: '冲沟隐患', value: '冲沟隐患' }
];
const VillageInfo = observer(({ data, villageId }: props) => {
  const [infoData, setInfoData] = useSafeState<IVillageInfo>({
    area: 0,
    huNum: 0,
    peopleCount: 0,
    manager: '',
    managerPhone: '',
    riskType: ''
  });

  useEffect(() => {
    setInfoData(data);
  }, [data]);

  useUnmount(() => {
    GlobalStore.isEditVillageInfo = false;
  });

  const [form] = Form.useForm();
  useUpdateEffect(() => {
    handleSubmit();
  }, [GlobalStore.isSubmitVillageInfoChange]);

  const handleSubmit = async () => {
    let formObj = form.getFieldsValue();
    let tempObj = {
      area: Number(formObj['area']) || 0,
      huNum: Number(formObj['huNum']) || 0,
      peopleCount: Number(formObj['peopleCount']) || 0,
      manager: formObj['manager'] || '',
      managerPhone: formObj['managerPhone'] || '',
      riskType: formObj['riskType']?.join(',') || '',
      name: ''
    };
    try {
      let res = await VillageServer.updateInfoBatch([
        {
          ...tempObj,
          villageId: villageId
        }
      ]);
      if (res['code'] != 0) throw new Error();
      setInfoData(tempObj);
      message.success('修改成功');
    } catch (e) {
      message.error('修改出现异常');
    }
  };

  const setFormValue = () => {
    let tempRiskType =
      infoData.riskType && infoData.riskType.length > 0
        ? infoData.riskType.split(',')
        : undefined;
    form.setFieldsValue({
      area: infoData.area || 0,
      huNum: infoData.huNum || 0,
      peopleCount: infoData.peopleCount || 0,
      manager: infoData.manager || '',
      managerPhone: infoData.managerPhone || '',
      riskType: tempRiskType
    });
  };

  useUpdateEffect(() => {
    GlobalStore.isEditVillageInfo && setFormValue();
  }, [GlobalStore.isEditVillageInfo]);

  return (
    <VillageInfoWrapper
      style={{ padding: '20rem', paddingBottom: '0' }}
      id="risk_type_id">
      <Form form={form}>
        <Row className="village-info-row">
          <Col span="6">
            <Form.Item name="area" label="辖区面积">
              {GlobalStore.isEditVillageInfo ? (
                <InputNumber controls={false} />
              ) : (
                <span>{infoData.area ? infoData.area + 'km²' : '--'}</span>
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item name="manager" label="防汛责任人">
              {GlobalStore.isEditVillageInfo ? (
                <Input />
              ) : (
                <span>{infoData.manager || '--'}</span>
              )}
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item name="managerPhone" label="联系人电话">
              {GlobalStore.isEditVillageInfo ? (
                <Input />
              ) : (
                <span>{infoData.managerPhone || '--'}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className="village-info-row">
          <Col span="6">
            <Form.Item name="huNum" label="户数">
              {GlobalStore.isEditVillageInfo ? (
                <InputNumber controls={false} />
              ) : (
                <span>{infoData.huNum ? infoData.huNum + '户' : '--'}</span>
              )}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item name="peopleCount" label="总人数：">
              {GlobalStore.isEditVillageInfo ? (
                <InputNumber controls={false} />
              ) : (
                <span>
                  {infoData.peopleCount ? infoData.peopleCount + '人' : '--'}
                </span>
              )}
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item name="riskType" label="风险类型">
              {GlobalStore.isEditVillageInfo ? (
                <Select
                  options={RISK_TYPE_OPTIONS}
                  mode="multiple"
                  getPopupContainer={() =>
                    document.getElementById('risk_type_id') as HTMLElement
                  }
                />
              ) : (
                <span>{infoData.riskType || '--'}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </VillageInfoWrapper>
  );
});

const VillageInfoWrapper = styled.div`
  position: relative;
  .edit {
    position: absolute;
    top: 10rem;
    right: 10rem;
  }
  .village-info-row {
    width: 100%;
    display: flex;
    margin-bottom: 10rem;
    .ant-select-selection-item-content,
    .ant-select-multiple .ant-select-selection-item {
      background-color: #33333380 !important;
    }
    .ant-select-selector,
    .ant-input-number,
    .ant-input {
      width: 100%;
      background-color: rgba(1, 1, 1, 0) !important;
      color: #fff;
      height: 30rem;
    }
    .ant-form-item {
      margin: 0;
    }
    .ant-form-item-label > label {
      color: #fff;
      font-size: 16rem;
    }
    span {
      color: #fff;
    }
  }
  font-family: AlibabaPuHuiTiR;
  font-size: 18rem;
  color: #ffffff;
`;

export { VillageInfo };
