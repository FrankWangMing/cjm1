import { useEffect } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import { useStore } from '../store';
import { useMount } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { DefenseListPage } from './DefenseListPage';

const Wrapper = styled.div`
  padding: 0 20rem;
  width: 100%;
  height: 100%;
  .totalNum {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: 10rem;
  }
  .ant-btn {
    cursor: pointer;
  }
`;

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export const Editable = observer(() => {
  const store = useStore();

  useMount(() => {
    store.getVillageInfoData();
  });

  useEffect(() => {
    store.getDefenseListData();
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
      title: '防御对象',
      dataIndex: 'influencePeopleNum',
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
              // 展示详情页面，传入村落id
              store.updateSelectedId(_);
            }}>
            <a>查看详情</a>
          </div>
        </div>
      )
    }
  ];

  return (
    <Wrapper id="manageWrapper">
      {store.selectedId == -1 ? (
        <>
          <div className="totalNum">
            <span className="total-count">
              总条数：{store.villageTableData.total}
            </span>
          </div>
          <Table
            className="field-table-wrapper"
            rowClassName={() => 'editable-row'}
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
        </>
      ) : (
        <DefenseListPage />
      )}
    </Wrapper>
  );
});
