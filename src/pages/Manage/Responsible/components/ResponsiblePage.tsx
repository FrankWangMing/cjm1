import { useState } from 'react';
import { Form, Input, Button, Modal, Table, Popconfirm } from 'antd';
import styled from 'styled-components';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { RedoOutlined, ZoomInOutlined } from '@ant-design/icons';
import { AlarmServer } from '@/service/alarm';

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
  .add-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rem;
    font-size: 18rem;
    button {
      font-size: 18rem;
    }
  }
  .search-form {
    padding: 20rem 0;
  }
  .info-container {
    width: 100%;
    height: calc(100vh - 150rem);
    background-color: #fff;
    border-radius: 4rem;

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

export const ResponsiblePage = observer(() => {
  const store = useStore();
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const columns = [
    {
      title: '责任人',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '职务',
      dataIndex: 'duty',
      align: 'center'
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'id',
      render: _ => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
          <div
            onClick={() => {
              setEditModalOpen(true);
              store.editData = store.alarmOwnersData.filter(item => {
                return item['id'] == _;
              })[0];
            }}
            style={{ marginRight: '20rem' }}>
            <a>编辑</a>
          </div>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => store.delAlarmOwner(_)}>
            <a>删除</a>
          </Popconfirm>
        </div>
      )
    }
  ];

  const submit = async () => {
    form
      .validateFields()
      .then(async data => {
        store.updateResponsibleData(data);
      })
      .catch(errInfo => {
        console.log(errInfo);
      });
  };

  // 重置筛选条件
  const reset = () => {
    form.resetFields();
    store.getAlarmOwnersData();
  };
  // 新增数据提交
  const handleAddOk = async () => {
    addForm
      .validateFields()
      .then(async data => {
        store.addAlarmOwner(data);
      })
      .catch(errInfo => {
        console.log(errInfo);
      })
      .finally(() => {
        setAddModalOpen(false);
      });
  };
  // 更新数据提交
  const handleEditOk = async () => {
    editForm
      .validateFields()
      .then(async data => {
        for (let item in data) {
          if (!data[item]) {
            delete data[item];
          }
        }
        let temp = Object.assign(store.editData, data);
        store.editAlarmOwner(temp);
      })
      .catch(errInfo => {
        console.log(errInfo);
      })
      .finally(() => {
        setEditModalOpen(false);
      });
  };
  /**
   * 从数据仓同步责任人
   */
  const handleResetOwners = async () => {
    const data = await AlarmServer.syncOwners();
    if (data.status == '成功') {
      // 同步之后刷新表单;
      store.getAlarmOwnersData();
    }
  };
  return (
    <Wrapper>
      <Form layout="inline" form={form} className="search-form">
        <Form.Item label="姓名">
          <Form.Item name="name" noStyle>
            <Input placeholder="请输入" className="form-input" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="职务">
          <Form.Item name="duty" noStyle>
            <Input placeholder="请输入" className="form-input" />
          </Form.Item>
        </Form.Item>
        <Form.Item label="联系方式">
          <Form.Item name="mobile" noStyle>
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
        <Button style={{ marginLeft: '20rem' }} type="primary">
          <Popconfirm
            title="确定同步数据仓信息进行所有村落的【预警责任人】信息更新吗？该操作将会清空通过本平台新增或修改的信息。"
            onConfirm={() => handleResetOwners()}>
            <a style={{ color: '#fff' }}>同步数据仓信息</a>
          </Popconfirm>
        </Button>
      </Form>
      <div className="add-container">
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          新增
        </Button>
        <span className="total-count">
          总条数：{store.alarmOwnersData.length}
        </span>
      </div>
      <Table
        dataSource={store.alarmOwnersData}
        pagination={{
          position: ['bottomCenter']
        }}
        // @ts-ignore
        columns={columns}
        loading={store.loading}
      />
      <Modal
        title="新增预警责任人"
        open={isAddModalOpen}
        onOk={handleAddOk}
        centered
        destroyOnClose={true}
        onCancel={() => setAddModalOpen(false)}>
        <Form form={addForm} preserve={false}>
          <Form.Item label="姓名">
            <Form.Item name="name" noStyle>
              <Input placeholder="请输入" className="form-input" />
            </Form.Item>
          </Form.Item>
          <Form.Item label="职务">
            <Form.Item name="duty" noStyle>
              <Input placeholder="请输入" className="form-input" />
            </Form.Item>
          </Form.Item>
          <Form.Item label="联系方式">
            <Form.Item name="mobile" noStyle>
              <Input placeholder="请输入" className="form-input" />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑预警责任人"
        open={isEditModalOpen}
        onOk={handleEditOk}
        centered
        onCancel={() => setEditModalOpen(false)}
        destroyOnClose={true}>
        <Form form={editForm} preserve={false}>
          <Form.Item label="姓名">
            <Form.Item name="name" noStyle>
              <Input
                placeholder="请输入"
                className="form-input"
                defaultValue={store.editData['name']}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="职务">
            <Form.Item name="duty" noStyle>
              <Input
                placeholder="请输入"
                className="form-input"
                defaultValue={store.editData['duty']}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="联系方式">
            <Form.Item name="mobile" noStyle>
              <Input
                placeholder="请输入"
                className="form-input"
                defaultValue={store.editData['mobile']}
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  );
});
