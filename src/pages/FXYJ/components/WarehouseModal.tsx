import { IWarehouseRes } from '@/domain/marker';
import { AlarmServer } from '@/service';
import { useSafeState } from 'ahooks';
import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useStore } from '../store';
import { downloadFile } from '@/utils';
import { IMG_PATH } from '@/utils/const';
/**
 * 库点物资信息
 */
interface Props {
  id: number;
}
const WarehouseModal = observer(({ id }: Props) => {
  const store = useStore();
  const [data, setData] = useSafeState<IWarehouseRes>();
  const [loading, setLoading] = useSafeState(false);
  const getData = async () => {
    setLoading(true);
    const data = await AlarmServer.warehouse.detail(id);
    setData(data);
    store.modalData.title = data.name;
    store.modalData.style = {
      width: '1100rem',
      left: 'calc(50vw - 550rem)',
      top: '200rem'
    };
    setLoading(false);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      width: '30rem',
      textWrap: 'word-break',
      render: (_text, _record, _index) => {
        return _index + 1;
      }
    },
    {
      title: '通用名',
      dataIndex: 'common_name',
      width: '50rem',
      align: 'center',
      render: _text => {
        return <div className="name-css">{_text}</div>;
      }
    },
    {
      title: '物资品名',
      dataIndex: 'name',
      width: '50rem',
      align: 'center',
      render: _text => {
        return <div className="name-css">{_text}</div>;
      }
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: '50rem',
      align: 'center',
      render: _text => {
        return <div className="name-css">{_text}</div>;
      }
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: '30rem',
      align: 'center'
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: '30rem',
      align: 'center'
    },
    {
      title: '管理方式',
      dataIndex: 'management_method',
      width: '40rem',
      align: 'center'
    },
    {
      title: '生产年月',
      dataIndex: 'production_date',
      width: '50rem',
      align: 'center'
    },
    {
      title: '保质期（月）',
      dataIndex: 'shelf_life',
      width: '50rem',
      align: 'center'
    }
  ];

  /**
   * 下载响应事件
   */
  const handleDownLoad = async (id: number, name: string) => {
    const { filePath } = await AlarmServer.downloadWareHouse(id);
    await downloadFile(filePath, `库点物资-${name}.xlsx`);
  };

  /**
   * 新增点击事件
   */
  const handleAdd = () => {};

  useEffect(() => {
    if (id != -1 && store.modalData.type === 'warehouse') {
      getData();
    }
  }, [id]);

  return (
    <Wrapper>
      {/* <div className="operation-top-outer">
        <div className="btn">新增</div>
      </div> */}
      <div className="table-outer">
        <Table
          tableLayout="fixed"
          className="_list"
          loading={loading}
          // @ts-ignore
          columns={columns}
          dataSource={data?.items || []}
          pagination={{
            position: ['bottomCenter'],
            pageSize: 8,
            showSizeChanger: false
          }}
        />
      </div>
      <div className="operation-bottom-outer">
        <div
          className="btn"
          onClick={() => {
            handleDownLoad(data?.id || -1, data?.name || '');
          }}>
          下载
        </div>
      </div>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  background: #081b23;
  border-radius: 4rem;

  .operation-bottom-outer {
    width: 100%;
    height: 64rem;
    padding: 0 20rem;
    border-top: 2px solid rgba(147, 221, 255, 0.2);
    border-radius: 0rem 0rem 4rem 4rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btn {
      width: 78rem;
      height: 36rem;
      background-image: url(${IMG_PATH.buttonBg3});
      background-size: 100%;
      background-repeat: no-repeat;
      font-family: WeiRuanYaHeii;
      font-weight: bold;
      font-size: 16rem;
      color: #e9f6ff;
      line-height: 36rem;
      text-align: center;
      font-style: normal;
      cursor: pointer;
    }
  }
  .table-outer {
    padding: 20rem;
  }

  .ant-table-tbody > tr > td {
    word-wrap: break-word;
    word-break: break-all;
  }
  .ant-table {
    margin-bottom: 10rem;
  }
  .ant-table,
  .ant-table-cell {
    background-color: rgba(1, 1, 1, 0);
    font-family: WeiRuanYaHei;
    letter-spacing: 1px;
    color: #ffffff;
    padding: 0;
    border: 0;
    text-align: center;
  }
  .name-css {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ant-table-thead {
    background: linear-gradient(270deg, #0098d6 0%, #0b4863 100%);
    height: 42rem;
    font-size: 20rem;
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none;
  }
  .ant-table-cell {
    padding: 0 5rem;
  }
  tr {
    height: 40rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.24);
  }
  tr:nth-child(odd) {
    background: rgba(255, 255, 255, 0.08);
  }
  .ant-table-row:hover .ant-table-cell-row-hover {
    background-color: rgba(255, 255, 255, 0.08) !important;
  }
`;
export { WarehouseModal };
