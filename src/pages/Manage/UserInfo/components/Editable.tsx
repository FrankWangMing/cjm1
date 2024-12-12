import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Select,
  message
} from 'antd';
import styled from 'styled-components';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { LoginService, RoleService } from '@/service';
import { encryptAES_CBC } from '@/pages/Login/util';

const Wrapper = styled.div`
  padding: 0 20rem;
  width: 100%;
  height: 100%;
  .add-container {
    display: flex;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 20rem;
    button {
      font-size: 18rem;
    }
  }
  .ant-btn {
    cursor: pointer;
  }
`;

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export const Editable = observer(() => {
  const store = useStore();
  const [form] = Form.useForm();
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  const columns = [
    {
      title: '用户编号',
      dataIndex: 'user_id',
      align: 'center'
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      align: 'center'
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      align: 'center'
    },
    {
      title: '角色',
      dataIndex: 'role',
      align: 'center'
    },
    // {
    //   title: '邮箱',
    //   dataIndex: 'email',
    //   align: 'center'
    // },
    {
      title: '联系方式',
      dataIndex: 'phone',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      align: 'center'
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'id',
      render: (_, record) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
          <div
            onClick={() => {
              form.setFieldsValue({
                user_name: record.user_name,
                real_name: record.real_name,
                role: record.role,
                phone: record.phone,
                user_id: record.user_id
              });
              setEditModalOpen(true);
            }}
            style={{ marginRight: '20rem' }}>
            <a>编辑</a>
          </div>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => {
              handleDeleteUser(record.user_id);
            }}>
            <a>删除</a>
          </Popconfirm>
        </div>
      )
    }
  ];

  const handleDeleteUser = async (id: number) => {
    try {
      await RoleService.deleteById(id);
      message.success('删除成功');
      store.getUserData();
    } catch (e) {}
  };

  /**
   * 新增用户响应事件
   */
  const handleAddOk = () => {
    form.validateFields().then(async formData => {
      try {
        // 添加用户
        await LoginService.signIn({
          passwd: encryptAES_CBC(formData.passwd),
          real_name: formData.real_name,
          role: formData.role,
          phone: formData.phone,
          user_name: formData.user_name
        });
        // 关闭弹窗
        setAddModalOpen(false);
        // 刷新界面
        store.getUserData();
      } catch (e) {}
    });
  };
  /**
   * 修改用户响应事件
   */
  const handleEditOk = () => {
    form.validateFields().then(async res => {
      console.log('编辑', res);
      try {
        await RoleService.updateUser({
          phone: res.phone,
          real_name: res.real_name,
          role: res.role,
          user_id: res.user_id,
          user_name: res.user_name
        });
        message.success('信息修改成功');
        setEditModalOpen(false);
        store.getUserData();
      } catch (e) {}
    });
  };

  return (
    <Wrapper>
      <div className="add-container">
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          新增
        </Button>
        <span className="total-count">
          总条数：{store.userTableData.length}
        </span>
      </div>
      <Table
        dataSource={store.userTableData}
        pagination={{
          position: ['bottomCenter'],
          current: store.pagination.currentPage,
          pageSize: store.pagination.pageSize,
          showSizeChanger: false,
          onChange: e => {
            store.pagination.currentPage = e;
          }
        }}
        columns={columns as ColumnTypes}
        loading={store.loading}
      />
      <Modal
        title="新增用户"
        open={isAddModalOpen}
        onOk={handleAddOk}
        destroyOnClose={true}
        centered
        onCancel={() => setAddModalOpen(false)}>
        <Form form={form} labelCol={{ span: 4 }} preserve={false}>
          <Form.Item name="user_name" label="用户名">
            <Input placeholder="请输入用户名" className="form-input" />
          </Form.Item>
          <Form.Item name="real_name" label="真实姓名">
            <Input placeholder="请输入真实姓名" className="form-input" />
          </Form.Item>
          <Form.Item name="role" label="角色">
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">用户</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="联系方式">
            <Input placeholder="请输入联系方式" className="form-input" />
          </Form.Item>
          <Form.Item name="passwd" label="密码">
            <Input.Password
              placeholder="请输入密码"
              type="password"
              className="form-input"
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑用户"
        open={isEditModalOpen}
        onOk={handleEditOk}
        destroyOnClose={true}
        centered
        onCancel={() => setEditModalOpen(false)}>
        <Form form={form} labelCol={{ span: 4 }} preserve={false}>
          <Form.Item
            name="user_id"
            style={{ display: 'none' }}
            label="用户名"></Form.Item>
          <Form.Item name="user_name" label="用户名">
            <Input placeholder="请输入用户名" className="form-input" />
          </Form.Item>
          <Form.Item name="real_name" label="真实姓名">
            <Input placeholder="请输入真实姓名" className="form-input" />
          </Form.Item>
          <Form.Item name="role" label="角色">
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">用户</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="联系方式">
            <Input placeholder="请输入联系方式" className="form-input" />
          </Form.Item>
          {/* <Form.Item name="passwd" label="密码">
            <Input.Password
              placeholder="请输入密码"
              type="password"
              className="form-input"
            />
          </Form.Item> */}
        </Form>
      </Modal>
    </Wrapper>
  );
});
