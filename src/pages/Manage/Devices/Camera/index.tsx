/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import styled from 'styled-components';
import { Table, Modal, Badge } from 'antd';
import { observer } from 'mobx-react-lite';
import { Provider, useStore } from './store';
import { useMount } from 'ahooks';
import { useState } from 'react';
import { MonitorBigger } from './components/MonitorBigger';

const Wrapper = styled.div`
  .ant-badge-status-text {
    font-size: 20rem;
  }
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
  .ant-table {
    margin: 30rem;
  }
  .play-modal-container {
    .ant-modal-content {
      width: 670rem;
    }
  }
`;

const Component = observer(() => {
  const store = useStore();
  const [isOpenModal, setOpenModal] = useState(false);
  useMount(() => {
    store.getAllCameras();
  });
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'districtName',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: () => <Badge status="success" text="在线" />
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'cameraId',
      render: _ => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
          <div
            onClick={() => {
              store.updateSelectedId(_);
              setOpenModal(true);
            }}>
            <a>查看详情</a>
          </div>
        </div>
      )
    }
  ];
  return (
    <Wrapper id="deviceWrapper">
      <div className="info-title">
        <strong>监控摄像头信息</strong>
      </div>
      <div className="info-container">
        <Table
          dataSource={store.camerasTableData}
          pagination={{
            position: ['bottomCenter'],
            current: store.pagination.currentPage,
            pageSize: store.pagination.pageSize,
            showSizeChanger: false,
            onChange: e => {
              store.pagination.currentPage = e;
            }
          }}
          // @ts-ignore
          columns={columns}
          loading={store.loading}
        />
        <Modal
          wrapClassName="play-modal-container"
          // @ts-ignore
          getContainer={document.getElementById('deviceWrapper')}
          modalRender={(modal: any) => modal}
          title="详情"
          open={isOpenModal}
          onCancel={() => setOpenModal(false)}
          footer={null}
          centered>
          <MonitorBigger />
        </Modal>
      </div>
    </Wrapper>
  );
});

export default function Devices() {
  return (
    <Provider>
      <Component />
    </Provider>
  );
}
