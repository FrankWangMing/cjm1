import { useState, useEffect } from 'react';
import { Table, Select, Modal, Form, Input } from 'antd';
import styled from 'styled-components';
import { useStore } from '../store';
import { useMount } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { RISK_TYPE_OPTIONS } from '@/components/MarkerModal/VillageInfo';

const Wrapper = styled.div`
  padding: 0 20rem;
  width: 100%;
  height: 100%;
  .totalNum {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: 20rem;
  }
  .ant-btn {
    cursor: pointer;
  }
`;

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export const Editable = observer(() => {
  const store = useStore();
  const [editForm] = Form.useForm();
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  useMount(() => {
    store.getVillageInfoData();
  });

  useEffect(() => {
    store.getDetailInfoData();
  }, [store.selectedId]);

  const columns: (ColumnTypes[number] & {
    dataIndex: string;
  })[] = [
    {
      title: '乡镇',
      dataIndex: 'town',
      align: 'center'
    },
    {
      title: '行政村',
      dataIndex: 'administrationVillage',
      align: 'center'
    },
    {
      title: '自然村',
      dataIndex: 'natureVillage',
      align: 'center'
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      align: 'center'
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      align: 'center'
    },
    {
      title: '辖区面积',
      dataIndex: 'area',
      align: 'center'
    },
    {
      title: '户数',
      dataIndex: 'huNum',
      align: 'center'
    },
    {
      title: '防汛责任人',
      dataIndex: 'manager',
      align: 'center'
    },
    {
      title: '联系人电话',
      dataIndex: 'managerPhone',
      align: 'center'
    },
    {
      title: '总人数',
      dataIndex: 'peopleCount',
      align: 'center'
    },
    {
      title: '风险类型',
      dataIndex: 'riskType',
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
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
          <div
            onClick={() => {
              store.updateSelectedId(_);
              setEditModalOpen(true);
              store.villageDetailData = store.villageTableData.list.filter(
                item => {
                  return item['id'] == _;
                }
              )[0];
            }}>
            <a>编辑</a>
          </div>
        </div>
      )
    }
  ];

  const handleEditOk = async () => {
    editForm
      .validateFields()
      .then(async data => {
        for (let item in data) {
          if (data[item]) {
            if (item == 'area' || item == 'huNum' || item == 'peopleCount') {
              let temp = Number(data[item]);
              data[item] = temp;
            }
          } else {
            delete data[item];
          }
        }
        store.updateDetailData(data);
      })
      .catch(errInfo => {
        console.log(errInfo);
      })
      .finally(() => {
        setEditModalOpen(false);
      });
  };

  return (
    <Wrapper id="manageWrapper">
      <div className="totalNum">
        <span className="total-count">
          总条数：{store.villageTableData.total}
        </span>
      </div>
      <Table
        dataSource={store.villageTableData.list}
        pagination={{
          position: ['bottomCenter'],
          total: store.villageTableData.total,
          current: store.pagination.currentPage,
          pageSize: store.pagination.pageSize,
          showSizeChanger: false,
          onChange: e => {
            store.pagination.currentPage = e;
            store.getVillageInfoData();
          }
        }}
        columns={columns as ColumnTypes}
        loading={store.loading}
      />
      <Modal
        title={store.villageDetailData.name}
        open={isEditModalOpen}
        onOk={handleEditOk}
        centered
        onCancel={() => setEditModalOpen(false)}>
        <Form form={editForm}>
          <Form.Item label="辖区面积">
            <Form.Item name="area" noStyle>
              <Input
                defaultValue={store.villageDetailData.area}
                placeholder="请输入"
                className="form-input"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="户数">
            <Form.Item name="huNum" noStyle>
              <Input
                defaultValue={store.villageDetailData.huNum}
                placeholder="请输入"
                className="form-input"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="防汛责任人">
            <Form.Item name="manager" noStyle>
              <Input
                defaultValue={store.villageDetailData.manager}
                placeholder="请输入"
                className="form-input"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="联系人电话">
            <Form.Item name="managerPhone" noStyle>
              <Input
                defaultValue={store.villageDetailData.managerPhone}
                placeholder="请输入"
                className="form-input"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="总人数">
            <Form.Item name="peopleCount" noStyle>
              <Input
                defaultValue={store.villageDetailData.peopleCount}
                placeholder="请输入"
                className="form-input"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="风险类型">
            <Form.Item name="riskType" noStyle>
              <Select
                defaultValue={store.villageDetailData.riskType?.split(',')}
                options={RISK_TYPE_OPTIONS}
                mode="multiple"
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  );
});
