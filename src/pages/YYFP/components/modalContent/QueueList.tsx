import { IQueryTasksRes, PreviewServer } from '@/service';
import { IMG_PATH } from '@/utils/const';
import { useSafeState } from 'ahooks';
import { Button, Carousel, Table } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
interface IProps {
  projectIds: any[];
  sceneType: number;
  rainfallScene: number;
  handleExportIn: Function;
}

export default ({
  projectIds,
  sceneType,
  rainfallScene,
  handleExportIn
}: IProps) => {
  // 查询状态任务（0：排队中，1：已完成，2：计算失败，3：已取消）
  const [status, setStatus] = useSafeState<number>(0);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_t, _r, index) => index + 1
    },
    {
      title: '任务开始时间',
      dataIndex: 'jobStartTime'
    },
    {
      title: '任务状态',
      dataIndex: 'jobStatus',
      render: (_text, _record) => {
        return (
          <span>
            {_text}
            {projectIds.includes(Number(_record.projectId)) && ' （当前计算）'}
          </span>
        );
      }
    }
  ];

  const columns2 = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_t, _r, index) => index + 1
    },
    {
      title: '任务开始时间',
      dataIndex: 'jobStartTime'
    },
    {
      title: '任务状态',
      dataIndex: 'jobStatus',
      render: (_text, _record) => {
        return (
          <span>
            {_text}
            {projectIds.includes(Number(_record.projectId)) && ' （当前计算）'}
          </span>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'projectId',
      render: (_text, _record) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              !projectIds.includes(Number(_record.projectId)) &&
                handleExportIn(_record, sceneType, rainfallScene);
            }}>
            查看
          </Button>
        );
      }
    }
  ];
  const [data, setData] = useSafeState<IQueryTasksRes[]>([]);

  const fetchByParam = async () => {
    let { jobWaitList } = await PreviewServer.queryTasks({
      sceneType,
      status,
      rainType: Number(rainfallScene)
    });
    setData(jobWaitList);
  };

  useEffect(() => {
    ref.current?.goTo(status);
    fetchByParam();
  }, [status, rainfallScene]);

  const ref = useRef<CarouselRef | null>(null);
  const handleBeforeChange = (from: number, to: number) => {
    setStatus(to);
  };
  return (
    <Wrapper>
      <Carousel
        style={{ width: '100%' }}
        dots={false}
        ref={ref}
        beforeChange={handleBeforeChange}
        infinite={false}>
        <Table
          className="_list"
          // @ts-ignore
          columns={columns}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            pageSize: 5,
            showSizeChanger: false
          }}
        />
        <Table
          className="_list"
          // @ts-ignore
          columns={status == 1 ? columns2 : columns}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            pageSize: 5,
            showSizeChanger: false
          }}
        />
      </Carousel>

      <div className="switch-operation-outer">
        <div className="flex">
          <div
            onClick={() => {
              setStatus(0);
            }}
            className={[
              'switch-operation-item',
              status == 0 ? 'switch-operation-item_active' : ''
            ].join(' ')}>
            任务列表
          </div>
          <div
            onClick={() => {
              setStatus(1);
            }}
            className={[
              'switch-operation-item',
              status == 1 ? 'switch-operation-item_active' : ''
            ].join(' ')}>
            成果列表
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 400rem;
  padding: 0 20rem;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  strong {
    font-size: 20px;
    color: #fff;
  }
  .ant-table,
  .ant-table-cell {
    background-color: rgba(1, 1, 1, 0);
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
    padding: 0;
    border: 0;
  }
  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none;
  }
  .ant-table-cell {
    padding: 0 10rem;
  }
  tr {
    height: 40rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.08);
  }
  .ant-table-row:hover .ant-table-cell-row-hover {
    background-color: #2c51b3 !important;
  }
  tr:nth-child(odd) {
    background: rgba(201, 214, 255, 0.24);
  }
  .ant-table-thead {
    background: rgba(149, 174, 255, 0.28);
  }
  .ant-input {
    background-color: #000000;
    color: #fff;
    border: 0;
    height: 32rem;
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
    margin: 0;
  }
  .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input,
  .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover {
    border: 3rem solid red;
    background: #000;
  }
  .ant-form-item-with-help .ant-form-item-explain {
    display: none;
  }
  table {
    border-spacing: 0 10rem !important;
  }
  .ant-table-pagination.ant-pagination {
    justify-content: center;
    margin: 0;
  }
  ._list {
    width: 100%;
  }

  .switch-operation-outer {
    position: absolute;
    color: #fff;
    bottom: 0;
    left: 20rem;
    width: calc(100% - 40rem);
    height: 32rem;
    display: flex;
    justify-content: space-between;
    .switch-operation-item {
      min-width: 130rem;
      padding: 0 10rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-image: url(${IMG_PATH.layout.center.bottomTab});
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .switch-operation-item_active {
      background-image: url(${IMG_PATH.layout.center.bottomTabSelected});
    }
    .download-btn {
      button {
        height: 30rem;
        padding-top: 0;
        padding-bottom: 0;
        margin-top: -10rem;
        background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      }
    }
  }
  .ant-carousel {
    width: 100%;
  }
  .ant-carousel .slick-dots-bottom {
    bottom: -40rem;
  }
`;
