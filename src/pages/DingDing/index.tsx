import { LegendComRight } from '@/components/LegendCom';
import { useSafeState } from 'ahooks';
import { message } from 'antd';
import axios from 'axios';
import dd from 'gdt-jsapi';
import { Fragment, useEffect } from 'react';
import {
  ModalContent,
  UpdateDefenseContent,
  UpdateManagerContent
} from '../FXYJ/components';

const DingDingPage1 = () => {
  const [userName, setUseName] = useSafeState('');
  const [errCode, setErrCode] = useSafeState('');
  // 钉钉免登
  useEffect(() => {
    const httpDD = axios.create();
    dd.getAuthCode({ corpId: '50590001' })
      .then(res => {
        setErrCode(JSON.stringify(res));
      })
      .catch(err => {
        setErrCode(JSON.stringify(err));
      });
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        backgroundImage:
          'linear-gradient(180deg, rgba(37,56,96,0.80) 1%, rgba(0,0,0,0.60) 99%)',
        width: '870rem',
        height: '500rem'
      }}>
      <UpdateManagerContent villageId={23} />
    </div>
  );
};
import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`
            }
          ]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  });
}
const DingDingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: Item) => record.key === editingKey;
  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    const row = (await form.validateFields()) as Item;
    setEditingKey('');
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '5%',
      editable: false
    },
    {
      title: '责任人',
      dataIndex: 'name',
      width: '15%',
      editable: true
    },
    {
      title: '职务',
      dataIndex: 'duty',
      width: '15%',
      editable: true
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      width: '40%',
      editable: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <Fragment>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </Fragment>
        ) : (
          <Fragment>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            {/* 删除 */}
          </Fragment>
        );
      }
    }
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <Fragment>
      {/* <Form
        form={form}
        component={false}
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(37,56,96,0.80) 1%, rgba(0,0,0,0.60) 99%)'
        }}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel
          }}
        />
      </Form> */}
      <div
        style={{
          width: '874rem',
          height: '586rem',
          position: 'relative',
          border: '1px solid red',
          backgroundImage:
            'linear-gradient(180deg, rgba(37,56,96,0.80) 1%, rgba(0,0,0,0.60) 99%)'
        }}>
        <h1>防御对象清单</h1>
        <UpdateDefenseContent villageId={23} />
      </div>
      <div
        style={{
          width: '874rem',
          height: '586rem',
          position: 'relative',
          border: '1px solid red',
          backgroundImage:
            'linear-gradient(180deg, rgba(37,56,96,0.80) 1%, rgba(0,0,0,0.60) 99%)'
        }}>
        <h1>管理人员</h1>
        <UpdateManagerContent villageId={23} />
      </div>
    </Fragment>
  );
};

export default DingDingPage;
