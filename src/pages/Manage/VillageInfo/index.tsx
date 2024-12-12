/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import styled from 'styled-components';
import { Editable } from './components/Editable';
import { Form, Button, Input, Select } from 'antd';
import { RedoOutlined, ZoomInOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { Provider, useStore } from './store';

const Wrapper = styled.div`
  .info-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rem;
    strong {
      font-size: 25rem;
      font-family: AlibabaPuHuiTiB;
      line-height: 22rem;
    }
  }
  .info-container {
    width: 100%;
    height: calc(100vh - 150rem);
    background-color: #fff;
    border-radius: 4rem;
    .ant-form {
      padding: 20rem;
    }
    .ant-form-item {
      margin-right: 60rem;
    }
    /* 消除form表单标题后冒号 */
    .ant-form-item-label > label::after {
      content: unset;
    }
    /* form表单label标签样式 */
    .ant-form-item-label > label {
      font-family: AlibabaPuHuiTiM;
      line-height: 18rem;
      margin-right: 10rem;
    }
  }

  .ant-table-pagination.ant-pagination {
    margin: 16rem 0 !important;
  }
  .ant-pagination .ant-pagination-item {
    background: transparent !important;
  }
  .ant-pagination-item,
  .ant-pagination-disabled,
  .ant-pagination.ant-pagination-disabled .ant-pagination-item {
    background: #fff !important;
    border-radius: 2px !important;
    color: #fff;
  }
  .ant-pagination-item a {
    font-family: AlibabaPuHuiTiR;
    font-size: 14rem;
    color: #333 !important;
    text-align: center;
  }
  .ant-pagination-options-quick-jumper input,
  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    background: #fff !important;
    color: #333 !important;
    border-radius: 2rem;
    border: 0;
    height: 40rem;
  }
  .ant-pagination-item-active a {
    background: #d0ebfc !important;
    color: #2c51b3 !important;
  }
  .ant-pagination span {
    font-family: AlibabaPuHuiTiR;
    font-size: 14rem;
    color: #333 !important;
    text-align: center;
    border: 0;
  }
`;

const Component = observer(() => {
  const [form] = Form.useForm();
  const store = useStore();

  const submit = async () => {
    form
      .validateFields()
      .then(async data => {
        for (let item in data) {
          if (!data[item]) {
            delete data[item];
          }
        }
        let temp = Object.assign(store.reqObj, data);
        store.reqObj = temp;
        store.getVillageInfoData();
      })
      .catch(errInfo => {
        console.log(errInfo);
      });
  };

  const reset = () => {
    form.resetFields();
    const data = form.getFieldsValue();
    for (let item in data) {
      if (!data[item]) {
        data[item] = '';
      }
    }
    let temp = Object.assign(store.reqObj, data);
    store.reqObj = temp;
    store.getVillageInfoData();
  };

  return (
    <Wrapper>
      <div className="info-title">
        <strong>村落信息</strong>
      </div>
      <div className="info-container">
        <Form layout="inline" form={form}>
          <Form.Item label="乡镇">
            <Form.Item name="town" noStyle>
              <Select
                placeholder="请输入"
                options={[
                  { value: '中洲镇', label: '中洲镇' },
                  { value: '汾口镇', label: '汾口镇' }
                ]}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="行政村">
            <Form.Item name="admin_village" noStyle>
              <Input placeholder="请输入" className="form-input" />
            </Form.Item>
          </Form.Item>
          <Form.Item label="自然村">
            <Form.Item name="nature_village" noStyle>
              <Input placeholder="请输入" className="form-input" />
            </Form.Item>
          </Form.Item>
          <Button
            style={{ marginRight: '20rem' }}
            onClick={submit}
            icon={<ZoomInOutlined />}
            type="primary">
            查询
          </Button>
          <Button onClick={reset} icon={<RedoOutlined />} type="primary">
            重置
          </Button>
        </Form>
        <Editable />
      </div>
    </Wrapper>
  );
});
export default function VillageInfo() {
  return (
    <Provider>
      <Component />
    </Provider>
  );
}
