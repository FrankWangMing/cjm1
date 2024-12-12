import { useContext, useState } from 'react';
import { useRequest } from 'ahooks';
import { CustomListItem, PreviewServer } from '@/service';
import {
  TitleWrapper,
  ListSelectorWrapper,
  ListTableWrapper
} from '@/pages/YYFP/components/QSYYFPLeftCom/List/style';
import { Popconfirm, Spin } from 'antd';
import { QSYYFPLeftContext } from '@/pages/YYFP/components/QSYYFPLeftCom';
import { resultList } from '../mock';

function List({ setShowList }) {
  const { handlePreviewResult } = useContext(QSYYFPLeftContext);

  const [listType, setListType] = useState<'task' | 'result'>('task');

  const listTypeParam = listType === 'task' ? 1 : 2;

  // todo 任务列表
  const {
    data: listData = [],
    refresh,
    loading
  } = useRequest(() => PreviewServer.customCalculateList(listTypeParam), {
    refreshDeps: [listType]
  });

  const mockData = resultList.customList;

  const handleViewResult = async (record: CustomListItem) => {
    //todo 接口暂时没有，目前写死
    // await handlePreviewResult?.(
    //   record.durationStart,
    //   record.durationEnd,
    //   record.jobId,
    //   5
    // );
    await handlePreviewResult?.(
      '2023-01-01 00:00:00',
      '2023-01-02 00:00:00',
      99
    );
  };

  const handleDelete = async (id: number) => {
    await PreviewServer.customCalculateDelete(id);
    refresh();
  };

  return (
    <>
      <TitleWrapper className="title">
        仿真预演列表
        <img src="/images/back.svg" onClick={setShowList} />
      </TitleWrapper>
      <ListSelectorWrapper>
        <div
          className={'selectorItem ' + (listType === 'task' ? 'selected' : '')}
          onClick={() => setListType('task')}>
          任务列表
        </div>
        <div
          className={
            'selectorItem ' + (listType === 'result' ? 'selected' : '')
          }
          onClick={() => setListType('result')}>
          成果列表
        </div>
      </ListSelectorWrapper>
      <Spin spinning={loading}>
        <ListTableWrapper>
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>{listType === 'task' ? '预演提交时间' : '任务提交时间'}</th>
                <th>降雨强度</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((v, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{v.submitTime.split(' ').join('\n')}</td>
                    <td>{v.rainFall.split(' ').join('\n')}</td>
                    {listType === 'task' ? (
                      <td>{v.jobStatus}</td>
                    ) : (
                      <td>
                        <a className="view" onClick={() => handleViewResult(v)}>
                          查看
                        </a>
                        <Popconfirm
                          title={'确定删除？'}
                          onConfirm={() => handleDelete(v.jobId)}>
                          <a className="delete">删除</a>
                        </Popconfirm>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ListTableWrapper>
      </Spin>
    </>
  );
}
export default List;
