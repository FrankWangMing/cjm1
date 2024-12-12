/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { SolutionServer } from '@/service';
import { useMount } from 'ahooks';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  message
} from 'antd';
import { observer, useLocalStore } from 'mobx-react-lite';
import { RedoOutlined, ZoomInOutlined } from '@ant-design/icons';
import styled from 'styled-components';
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
/**
 * 简报接受人数据控制
 */
export default observer(() => {
  const store = useLocalStore(
    (): {
      loading: boolean;
      /**
       * 表格中的所有数据
       */
      allMember: {
        departmentName: string;
        departmentCode: string;
        memberId: number;
        memberName: string;
        memberPhone: string;
      }[];
      allDepartMent: {
        name: string;
        code: string;
      }[];
      isShowAddModal: boolean;
      isShowEditModal: boolean;
    } => ({
      loading: true,
      allMember: [],
      allDepartMent: [],
      isShowAddModal: false,
      isShowEditModal: false
    })
  );
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const getAllDepartment = async () => {
    let tempAllMember: {
      departmentName: string;
      departmentCode: string;
      memberId: number;
      memberName: string;
      memberPhone: string;
    }[] = [];
    let tempAllDepartMent: {
      name: string;
      code: string;
    }[] = [];
    store.loading = true;
    const { list } = await SolutionServer.departmentMember.list();
    // 筛选出所有的部门数据
    list.map(item => {
      tempAllDepartMent.push({ name: item.Name, code: item.code });
      item.members.map(memberItem => {
        tempAllMember.push({
          departmentName: item.Name,
          departmentCode: item.code,
          memberId: memberItem.id,
          memberName: memberItem.name,
          memberPhone: memberItem.phone
        });
      });
    });
    let { DepartmentCode, memberName } = form.getFieldsValue();
    if (DepartmentCode) {
      tempAllMember = tempAllMember.filter(
        item => item.departmentCode == DepartmentCode
      );
    }
    if (memberName) {
      tempAllMember = tempAllMember.filter(
        item => item.memberName == memberName
      );
    }
    store.allMember = tempAllMember;
    store.allDepartMent = tempAllDepartMent;
    store.loading = false;
  };
  useMount(() => {
    getAllDepartment();
  });
  const reset = () => {
    form.resetFields();
    getAllDepartment();
  };
  /**
   * 查询按钮
   */
  const handleSearch = () => {
    getAllDepartment();
  };

  /**
   * 添加数据响应事件
   */
  const handleAddOk = () => {
    addForm.validateFields().then(async res => {
      try {
        await SolutionServer.departmentMember.add(res);
        getAllDepartment();
        message.success('添加成功');
        store.isShowAddModal = false;
      } catch (e) {}
    });
  };

  /**
   * 编辑数据
   */
  const handleEditOk = () => {
    editForm.validateFields().then(async res => {
      try {
        console.log('编辑数据', res);
        await SolutionServer.departmentMember.edit({
          id: res.id,
          name: res.name,
          phone: res.phone
        });
        message.success('编辑成功');
        getAllDepartment();
        store.isShowEditModal = false;
      } catch (e) {}
    });
  };

  /**
   * 删除数据
   * @param item
   */
  const handleDelete = async item => {
    try {
      await SolutionServer.departmentMember.delete({
        deptCode: item.departmentCode,
        memberId: item.memberId
      });
      getAllDepartment();
    } catch (e) {}
  };

  return (
    <Wrapper>
      <div className="info-title">
        <strong>部门成员管理</strong>
      </div>
      <div className="info-container">
        <Form layout="inline" form={form}>
          <Form.Item label="部门：" name="DepartmentCode">
            <Select style={{ minWidth: '200rem' }}>
              {(store.allDepartMent || []).map(item => {
                return (
                  <Select.Option value={item.code}>{item.name}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="姓名" name="memberName">
            <Input placeholder="请输入" className="form-input" />
          </Form.Item>
          <Button
            style={{ marginRight: '20rem' }}
            onClick={handleSearch}
            icon={<ZoomInOutlined />}
            type="primary">
            查询
          </Button>
          <Button onClick={reset} icon={<RedoOutlined />} type="primary">
            重置
          </Button>
        </Form>
        <div style={{ margin: '0 20rem 20rem 20rem' }}>
          <Button
            type="primary"
            onClick={() => {
              store.isShowAddModal = true;
            }}>
            创建
          </Button>
        </div>
        <Table
          dataSource={store.allMember}
          pagination={false}
          columns={[
            {
              title: '部门',
              dataIndex: 'departmentName',
              align: 'center'
            },
            {
              title: '姓名',
              dataIndex: 'memberName',
              align: 'center'
            },
            {
              title: '联系方式',
              dataIndex: 'memberPhone',
              align: 'center'
            },
            {
              title: '操作',
              dataIndex: 'code',
              align: 'center',
              render: (_, record) => (
                <>
                  <span
                    style={{ color: '#228be6', cursor: 'pointer' }}
                    onClick={() => {
                      store.isShowEditModal = true;
                      editForm.setFieldsValue({
                        // deptCode: record.departmentCode,
                        name: record.memberName,
                        phone: record.memberPhone,
                        id: record.memberId
                      });
                    }}>
                    编辑
                  </span>
                  <span style={{ margin: '0 10rem' }}>|</span>
                  <Popconfirm
                    title="确定要删除本条数据吗？"
                    onConfirm={() => {
                      handleDelete(record);
                    }}
                    okText="确定"
                    cancelText="取消">
                    <span style={{ color: '#228be6', cursor: 'pointer' }}>
                      删除
                    </span>
                  </Popconfirm>
                </>
              )
            }
          ]}
          loading={store.loading}
        />
      </div>
      <Modal
        title="新增成员"
        open={store.isShowAddModal}
        onOk={handleAddOk}
        centered
        destroyOnClose={true}
        onCancel={() => (store.isShowAddModal = false)}>
        <Form form={addForm} preserve={false} labelCol={{ span: 4 }}>
          <Form.Item
            label="所属部门"
            name="deptCode"
            rules={[{ required: true, message: '所属部门' }]}>
            <Select>
              {store.allDepartMent.map(item => {
                return (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '姓名' }]}>
            <Input placeholder="请输入" className="form-input" />
          </Form.Item>
          <Form.Item
            label="联系方式"
            name="phone"
            rules={[{ required: true, message: '联系方式' }]}>
            <Input placeholder="请输入联系方式" className="form-input" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改成员"
        open={store.isShowEditModal}
        onOk={handleEditOk}
        centered
        destroyOnClose={true}
        onCancel={() => (store.isShowEditModal = false)}>
        <Form form={editForm} preserve={false} labelCol={{ span: 4 }}>
          {/* <Form.Item
            label="所属部门"
            name="deptCode"
            rules={[{ required: true, message: '所属部门' }]}>
            <Select>
              {store.allDepartMent.map(item => {
                return (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item> */}
          <Form.Item
            label="id"
            name="id"
            style={{ display: 'none' }}></Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '姓名' }]}>
            <Input placeholder="请输入" className="form-input" />
          </Form.Item>
          <Form.Item
            label="联系方式"
            name="phone"
            rules={[{ required: true, message: '联系方式' }]}>
            <Input placeholder="请输入联系方式" className="form-input" />
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  );
});
