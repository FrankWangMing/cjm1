import { useEffect, useState } from 'react';
import {
  BottomBtn,
  ReportListCheckbox,
  ReportListWrapper
} from '@/pages/LDYA/components/cusModule/ReportList/style';
import { Pagination, Popconfirm, message } from 'antd';
import { SolutionServer } from '@/service';
import { downloadFile } from '@/utils';
import { LoadingOutlined } from '@ant-design/icons';

interface ReportListProps {
  onPreview: (pdfNumber: number) => void;
  changeType: (type: string) => void;
  forecastTime: number;
  listData:
    | {
        count: number;
        list:
          | {
              createdAt: string;
              foresight: number;
              id: number;
              pdfName: string;
            }[];
      }
    | undefined;
  getList: (pageIndex: number, pageSize: number) => void;
}

function ReportList(props: ReportListProps) {
  const { onPreview, listData, getList, changeType } = props;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState<boolean>(false);
  const [exportBtnLoading, setExportBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    getList(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const notSelectedRows = listData?.list
    .map(v => v.id)
    .filter(v => !selectedRows?.includes(v));

  const handleSelect = (id: number) => {
    setSelectedRows(prevState => {
      if (prevState.includes(id)) {
        return prevState.filter(v => v !== id);
      } else {
        return prevState.concat(id);
      }
    });
  };

  const handleSelectAll = () => {
    if ((notSelectedRows?.length ?? 0) <= 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(listData?.list?.map(v => v.id) || []);
    }
  };

  const handleExport = async () => {
    try {
      setExportBtnLoading(true);
      const { path } = await SolutionServer.downloadBriefReport({
        pdfNumber: selectedRows
      });
      await Promise.all(
        path.map((v: string) => {
          return new Promise(async (resolve, reject) =>
            resolve(await downloadFile(v, v.split('/').reverse()[0]))
          );
        })
      );
    } catch (error) {
    } finally {
      setExportBtnLoading(false);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 100,
      render: (_, index) => index + 1
    },
    {
      title: '名称',
      dataIndex: 'pdfName',
      width: 270
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      width: 200
    },
    {
      title: '操作',
      width: 100,
      render: (record: any) => {
        return (
          <span
            className={'check'}
            onClick={() => {
              onPreview(record?.id || 0);
            }}>
            查看
          </span>
        );
      }
    }
  ];

  const deleteReport = async () => {
    try {
      setDeleteBtnLoading(true);
      await SolutionServer.deleteBriefReport({ briefReportId: selectedRows });
      message.success('删除成功！');
      getList(pageIndex, pageSize);
    } catch (error) {
    } finally {
      setDeleteBtnLoading(false);
    }
  };
  return (
    <ReportListWrapper>
      <div className="list-header">
        <div className="list-header-item" style={{ width: '100rem' }}>
          <div>
            <ReportListCheckbox
              onClick={handleSelectAll}
              checked={(notSelectedRows?.length ?? 0) <= 0}
            />{' '}
            全选
          </div>
        </div>
        {columns.map((v, i) => {
          return (
            <div
              key={i}
              className="list-header-item"
              style={{ width: v?.width ? `${v.width}rem` : 'auto' }}>
              {v.title}
            </div>
          );
        })}
      </div>
      <div className="list-content">
        {listData?.list?.map((v, i) => {
          return (
            <div className="list-col" key={i}>
              <div className={'list-col-item'} style={{ width: '100rem' }}>
                <div>
                  <ReportListCheckbox
                    checked={selectedRows.includes(v.id)}
                    onClick={() => handleSelect(v.id)}
                  />{' '}
                  选择
                </div>
              </div>
              {columns.map(column => {
                return (
                  <div
                    className={'list-col-item'}
                    style={{
                      width: column?.width ? `${column.width}rem` : 'auto'
                    }}>
                    {column?.render
                      ? column?.render(v, i)
                      : v?.[column?.dataIndex]}
                  </div>
                );
              })}
            </div>
          );
        })}
        <Pagination
          total={listData?.count || 0}
          pageSize={pageSize}
          current={pageIndex}
          onChange={(page, pageSize) => {
            setPageIndex(page);
            setPageSize(pageSize);
          }}
        />
      </div>

      <div className="list-bottom">
        <Button
          disabled={(listData?.count ?? 0) < 2}
          onClick={() => {
            changeType('pdfCompare');
          }}>
          方案对比
        </Button>
        <Popconfirm
          title={'确定要删除吗？'}
          onConfirm={async () => await deleteReport()}>
          <Button
            loading={deleteBtnLoading}
            disabled={selectedRows.length === 0}>
            批量删除
          </Button>
        </Popconfirm>
        <Button
          loading={exportBtnLoading}
          disabled={selectedRows.length === 0}
          onClick={async () => await handleExport()}>
          批量导出
        </Button>
      </div>
    </ReportListWrapper>
  );
}

import type { ButtonProps } from 'antd/es/button/button';
export const Button: React.FC<ButtonProps> = props => {
  const { children, className, loading } = props;
  return (
    <BottomBtn
      className={`${className || ''} ${loading ? 'btn-loading' : ''}`}
      {...props}>
      {loading && <LoadingOutlined />}
      {children}
    </BottomBtn>
  );
};

export default ReportList;
