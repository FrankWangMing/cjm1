/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { SolutionServer, ResultRainAlarmIndex } from '@/service';
import { useSafeState } from 'ahooks';
import { Table, Modal } from 'antd';
import { Fragment, useEffect } from 'react';
import styled from 'styled-components';
const AlarmIndex = () => {
  const [data, setData] = useSafeState<Array<TableDataProp>>([]);
  const [isLoading, setIsLoading] = useSafeState<boolean>(true);
  const [modalContent, setModalContent] = useSafeState<string | undefined>(
    undefined
  );
  const [total, setTotal] = useSafeState(0);
  const [current, setCurrent] = useSafeState(1);
  const [pageSize, setPageSize] = useSafeState(8);

  const getData = async () => {
    setIsLoading(true);
    const res = await SolutionServer.rainAlarmIndex({
      pageNum: current,
      pageSize: pageSize
    });
    setTotal(res.indexCount);
    let asd = format_data(res.villageIndexes);
    setData(asd);
    setIsLoading(false);
  };

  const format_data = (data: ResultRainAlarmIndex[]): TableDataProp[] => {
    let tempResultList: TableDataProp[] = [];
    data.map(item => {
      tempResultList.push({
        natureVillage: item.natureVillage,
        adminVillage: item.adminVillage,
        region: item.region,
        dangerImage: item.dangerImage,
        soilWater: item.alarmIndexes[0]?.soilWater || '--',
        oneHour: {
          iTransfer: formatShowText(item.alarmIndexes[0]?.iTransfer),
          rTransfer: formatShowText(item.alarmIndexes[0]?.rTransfer)
        },
        threeHour: {
          iTransfer: formatShowText(item.alarmIndexes[1]?.iTransfer),
          rTransfer: formatShowText(item.alarmIndexes[1]?.rTransfer)
        },
        sixHour: {
          iTransfer: formatShowText(item.alarmIndexes[2]?.iTransfer),
          rTransfer: formatShowText(item.alarmIndexes[2]?.rTransfer)
        }
      });
    });
    return tempResultList;
  };

  const formatShowText = (data: number | undefined): string => {
    return data ? data + 'mm' : '--';
  };

  const columns = [
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region'
    },
    {
      title: '行政村',
      dataIndex: 'adminVillage',
      key: 'adminVillage'
    },
    {
      title: '自然村',
      dataIndex: 'natureVillage',
      key: 'natureVillage'
    },
    {
      title: '土壤含水量/前期降雨',
      dataIndex: 'soilWater',
      key: 'soilWater'
    },
    {
      title: (
        <Fragment>
          <p>1小时</p>
          <p>准备转移/立即转移</p>
        </Fragment>
      ),
      key: 'oneHour',
      render: (text, record: TableDataProp, index) => {
        return (
          <div className="flex-between" style={{ padding: '0 80rem' }}>
            <span>{record.oneHour.rTransfer}</span>
            <span>{record.oneHour.iTransfer}</span>
          </div>
        );
      }
    },
    {
      title: (
        <Fragment>
          <p>3小时</p>
          <p>准备转移/立即转移</p>
        </Fragment>
      ),
      key: 'threeHour',
      render: (text, record: TableDataProp, index) => {
        return (
          <div className="flex-between" style={{ padding: '0 80rem' }}>
            <span>{record.threeHour.rTransfer}</span>
            <span>{record.threeHour.iTransfer}</span>
          </div>
        );
      }
    },
    {
      title: (
        <Fragment>
          <p>6小时</p>
          <p>准备转移/立即转移</p>
        </Fragment>
      ),
      key: 'sixHour',
      render: (text, record: TableDataProp, index) => {
        return (
          <div className="flex-between" style={{ padding: '0 80rem' }}>
            <span>{record.sixHour.rTransfer}</span>
            <span>{record.sixHour.iTransfer}</span>
          </div>
        );
      }
    },
    {
      title: '危险区划分图',
      render: (text, record, index) => {
        return (
          <p
            className="link-text"
            onClick={() => {
              setModalContent(record.dangerImage);
            }}>
            查看详情
          </p>
        );
      }
    }
  ];

  useEffect(() => {
    getData();
  }, [current]);

  return (
    <AlarmIndexWrapper className="bg-content-area-alpha animate__animated animate__fadeIn">
      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        pagination={{
          total: total,
          current: current,
          pageSize: pageSize,
          showQuickJumper: true,
          showSizeChanger: false,
          showTotal: () => {
            return (
              <span
                style={{
                  color: '#fff',
                  fontSize: '20rem',
                  marginRight: '20rem',
                  position: 'absolute',
                  right: '400rem'
                }}>
                总条数：{total}
              </span>
            );
          },
          onChange: e => {
            setCurrent(e);
          }
        }}
      />
      <Modal
        width="1000rem"
        style={{ minHeight: '400rem', top: '20vh' }}
        visible={modalContent != undefined}
        onCancel={() => {
          setModalContent(undefined);
        }}
        mask={false}
        footer={null}>
        <img
          style={{ width: '100%', height: '100%', marginTop: '20rem' }}
          src={modalContent}
          alt=""
        />
      </Modal>
    </AlarmIndexWrapper>
  );
};

const AlarmIndexWrapper = styled.div`
  .ant-pagination-item-link {
    height: unset !important;
  }
  .ant-pagination .ant-pagination-options-quick-jumper input {
    height: unset !important;
  }
  .ant-table-pagination {
    justify-content: center !important;
  }
  th,
  td {
    text-align: center !important;
  }
  width: 100%;
  height: calc(100vh - 276rem);
  margin-top: -20rem;
  padding: 20rem;
  .p-list-outer {
    p {
      margin-bottom: 23rem !important;
    }
    p:nth-last-child(1) {
      margin: 0 !important;
    }
  }
  .link-text {
    cursor: pointer;
    color: #148cee;
  }

  .forecast-condition {
    position: relative;
    .operation-outer {
      position: absolute;
      top: 50rem;
      left: 30rem;
      width: 95rem;
      /* height: 115rem; */
      z-index: 999;
      padding: 10rem;
      background: #ffffff;
      box-shadow: 0rem 4rem 12rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 4rem;
    }
    img {
      cursor: pointer;
    }
    div,
    img {
      transition: all 300ms;
    }
    .ant-checkbox-wrapper {
      margin-bottom: 5rem;
    }
    .ant-checkbox-wrapper:nth-last-child(1) {
      margin: 0rem;
    }
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: unset;
    }
    .ant-checkbox {
      font-size: 10rem;
    }
    .ant-checkbox + span {
      padding: 0;
      padding-left: 4rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #333333;
    }
  }

  .ant-table {
    background-color: rgba(1, 1, 1, 0);
    position: relative;
    .ant-table-thead {
      height: 70rem;
      tr > th {
        background: rgba(149, 174, 255, 0.28);
        font-family: AlibabaPuHuiTiR;
        font-size: 24rem;
        color: #ffffff;
        border: 0;
      }
      tr
        > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
        display: none;
      }
    }
    .ant-table-tbody {
      tr > td {
        border: 0;
        font-family: AlibabaPuHuiTiR;
        font-size: 20rem;
        color: #ffffff;
        /* height: 140rem; */
      }
      tr {
        background: rgba(201, 214, 255, 0.24);
      }
      tr:nth-child(odd) {
        background: rgba(255, 255, 255, 0.08);
      }
      .ant-table-cell-row-hover {
        background-color: #2c51b3 !important;
        .link-text {
          color: #fff;
        }
      }
    }
  }
`;

interface TransferProp {
  iTransfer: string;
  rTransfer: string;
}
interface TableDataProp {
  natureVillage: string;
  adminVillage: string;
  region: string;
  dangerImage: string;
  soilWater: string;
  oneHour: TransferProp;
  threeHour: TransferProp;
  sixHour: TransferProp;
}

export { AlarmIndex };
