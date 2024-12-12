/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { ColorBar } from '@/components/LegendCom/ColorBar';
import Loading from '@/components/Loading';
import { AlarmServer, SolutionServer } from '@/service';
import { deepClone, IMG_PATH, PHYSICAL_KEYWORDS } from '@/utils/const';
import { useMount, useSafeState } from 'ahooks';
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Typography
} from 'antd';
import { observer, useLocalStore } from 'mobx-react-lite';
import { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { downloadImg, exportImage } from '../const';
import Left from '@/pages/UnitTest/Left';
interface ModalContentProp {
  villageName: string;
  forecastTime: string;
  riskLevel: string;
  maxDepth: string;
  maxDuration: string;
  url: string;
  loading: boolean;
  adjustType: string;
  currCloudJsonType: string;
  huNum: number;
  totalPeople: number;
  area: number;
  floodArea: number;
}
const ModalContent: React.FC<ModalContentProp> = observer(
  ({
    villageName,
    forecastTime,
    riskLevel,
    maxDepth,
    maxDuration,
    url,
    loading,
    adjustType,
    currCloudJsonType,
    huNum,
    totalPeople,
    area,
    floodArea
  }) => {
    const store = useLocalStore(
      (): {
        imgPath: string;
        allInfoImgUrl: string;
        imgFormData: FormData | null;
        loadingSubmit: boolean;
        loadingExport: boolean;
      } => ({
        imgPath: '',
        allInfoImgUrl: '',
        imgFormData: null,
        loadingSubmit: false,
        loadingExport: false
      })
    );
    // 发布
    const handleSubmit = async () => {
      store.loadingSubmit = true;
      try {
        if (store.allInfoImgUrl == '' || store.imgFormData == null) {
          let { url, imgFormData } = await exportImage(
            document.getElementById('modal-content-id')!,
            villageName
          );
          store.allInfoImgUrl = url;
          store.imgFormData = imgFormData;
        }
        if (store.imgFormData) {
          const res = await SolutionServer.uploadImg(store.imgFormData);
          store.imgPath = res.imagePath;
          const resSendNotice = await SolutionServer.sendNotice({
            content: '千岛湖生态综合保护局发布洪涝警告',
            departments: [], // 接收部门
            imagePath: store.imgPath,
            linkPath: store.imgPath,
            linkTitle: '武强溪防灾村落风险图',
            receivers: {
              accountInfos: [],
              mobiles: [
                '15076038535',
                '17771797378',
                '15871430381',
                '13758239865',
                '18405816352',
                '17826862573'
              ],
              type: 1
            },
            type: 1
          });
          message.success('发送成功');
        }
      } catch (e) {
        message.error('发送失败');
      } finally {
        store.loadingSubmit = false;
      }
    };
    // 导出
    const handleExport = async () => {
      store.loadingExport = true;
      if (!store.imgPath) {
        if (store.allInfoImgUrl == '' || store.imgFormData == null) {
          if (!store.imgPath) {
            let { url, imgFormData } = await exportImage(
              document.getElementById('modal-content-id')!,
              villageName
            );
            store.allInfoImgUrl = url;
            store.imgFormData = imgFormData;
            const res = await SolutionServer.uploadImg(
              store.imgFormData as FormData
            );
            store.imgPath = res.imagePath;
          }
        }
      }
      await downloadImg(store.imgPath, villageName);
      store.loadingExport = false;
    };
    useMount(() => {
      store.imgPath = '';
      store.allInfoImgUrl = '';
      store.imgFormData = null;
      store.loadingSubmit = false;
      store.loadingExport = false;
    });
    return (
      <ModalContentWrapper>
        <div className="content" id="modal-content-id">
          <div className="grid-container">
            <div className="grid-item" style={{ marginRight: 0 }}>
              预警时段：{forecastTime}
            </div>
            <div className="grid-item">户数：{huNum}户</div>
            <div className="grid-item">总人数：{totalPeople}人</div>
            <div className="grid-item">辖区面积：{area}km²</div>
            <div className="grid-item">
              最大淹没面积：{Math.round(floodArea * 1000) / 1000}km
            </div>
            <div className="grid-item">风险等级：{riskLevel}</div>
          </div>
          <div className="advice">
            <span>{adjustType}</span>
          </div>
          <div className="flex">
            <Loading loadingFlag={loading} color="#00a8ff" />
            {!loading && (
              <img
                style={{
                  width: '100%',
                  position: 'relative'
                }}
                src={url}
                alt=""
              />
            )}
            {currCloudJsonType === PHYSICAL_KEYWORDS.历时 ? (
              <div
                className="scalar-outer"
                style={{ height: '250rem', width: '140rem' }}>
                <ColorBar
                  type={PHYSICAL_KEYWORDS.历时}
                  unit="h"
                  numList={['24', '12', '6', '3', '2', '1', '0.5', '0']}
                  lineBgColor="linear-gradient(180deg,#7a5a0d 0%,#7a5a0d 16.7%,#997819 16.7%,#997819 33.4%,#c3a046 33.4%,#c3a046 50.1%,#e0cc85 50.1%,#e0cc85 66.8%,#f2e0b3 66.8%,#f2e0b3 83.5%,#fff3bf 83.5%,#fff3bf 100%)"
                  handleTypeChange={() => {}}
                  keyValList={[
                    {
                      key: '淹没历时',
                      value: PHYSICAL_KEYWORDS.历时,
                      disable: false
                    }
                  ]}
                />
              </div>
            ) : (
              <div
                className="scalar-outer"
                style={{ height: '210rem', width: '140rem' }}>
                <ColorBar
                  type={PHYSICAL_KEYWORDS.最大水深}
                  unit="cm"
                  numList={['∞', '300', '200', '100', '50', '0']}
                  lineBgColor="linear-gradient(180deg, #004DCC 0%, #004DCC 20%,#2673F2 20%, #2673F2 40%,#5980FF 40%, #5980FF 60%,#8099FF 60%,#8099FF 80%,#B3CCFF 80%,#B3CCFF 100%)"
                  handleTypeChange={() => {}}
                  keyValList={[
                    {
                      key: '最大水深',
                      value: PHYSICAL_KEYWORDS.最大水深,
                      disable: false
                    }
                  ]}
                />
              </div>
            )}
          </div>
        </div>
        <div className="operation-outer flex" id="modal-content-id-operation">
          <Popconfirm
            getPopupContainer={() =>
              document.getElementById(
                'modal-content-id-operation'
              ) as HTMLElement
            }
            disabled={store.loadingSubmit}
            title={'确定发布？'}
            onConfirm={handleSubmit}
            okText="确定"
            cancelText="取消">
            <Button
              className="publishBtn"
              size="large"
              style={{
                marginRight: '10rem',
                height: '40rem',
                lineHeight: '40rem',
                paddingTop: '0rem',
                fontSize: '20rem'
              }}
              loading={store.loadingSubmit}
              disabled={store.loadingSubmit}>
              发布
            </Button>
          </Popconfirm>
          <Button
            style={{
              height: '40rem',
              lineHeight: '40rem',
              paddingTop: '0rem',
              fontSize: '20rem'
            }}
            className="exportBtn"
            size="large"
            onClick={handleExport}
            loading={store.loadingExport}
            disabled={store.loadingExport}>
            导出
          </Button>
        </div>
      </ModalContentWrapper>
    );
  }
);

const ModalContentWrapper = styled.div`
  .ant-popover-inner {
    width: 200rem;
    div {
      margin: 0 !important;
    }
    .ant-popover-message-title {
      margin: 0 !important;
    }
    .ant-popover-buttons {
      display: flex !important;
      button {
        min-width: 80rem !important;
        height: 40rem;
        text-align: center;
        span {
          width: 100%;
          text-align: center;
          color: #333 !important;
          margin: 0;
        }
      }
    }
  }
  .content {
    width: 100%;
    padding: 20rem;
    position: relative;
  }
  .adjust-type {
    position: absolute;
    top: 55rem;
    right: 0rem;
  }

  img {
    width: 100%;
  }
  .scalar-outer {
    width: 140rem;
    height: 230rem;
    background-color: rgba(1, 1, 1, 0.5);
    font-family: AlibabaPuHuiTiM;
    border-radius: 4rem;
    position: absolute;
    bottom: 30rem;
    right: 30rem;
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 每行两个元素 */
    grid-template-rows: auto; /* 自动行高 */
    gap: 10px; /* 元素之间的间隙 */
  }
  .grid-item {
    padding: 9rem 10rem;
    height: 42rem;
    margin-bottom: 4rem;
    background: rgba(255, 255, 255, 0.08);
    font-size: 18rem;
    color: #ffffff;
  }
  /* 特殊处理第一行和最后一行 */
  .grid-item:first-child {
    grid-column: span 2; /* 第一行的元素跨两列 */
  }

  .grid-item:last-child {
    grid-column: span 2; /* 最后一行的元素跨两列 */
  }
  .advice {
    padding: 14rem 10rem;
    height: 56rem;
    span {
      font-family: MicrosoftYaHei-Bold;
      font-size: 20rem;
      color: #ffffff;
      letter-spacing: 1px;
      font-weight: bold;
    }
  }
  .operation-outer {
    border-top: 1px solid rgba(57, 206, 255, 0.5);
    margin: 0 !important;
    padding: 12rem 20rem;
    border-radius: 0px 0px 4px 4px;
    width: 100%;
    height: 64rem;
    justify-content: flex-end;

    button {
      font-family: WeiRuanYaHei;
      font-size: 16rem !important;
      color: #ffffff;
      text-align: center;
      font-style: normal;
    }

    .publishBtn {
      background: linear-gradient(270deg, #0098d6 0%, #0b4863 100%);
      color: #ffffff;
      border: 1rem solid #93b6e6 !important;
    }
    .exportBtn {
      border: 1rem solid #93b6e6 !important;
      color: #ffffff;
      background: linear-gradient(
        180deg,
        rgba(113, 123, 132, 0.3) 0%,
        rgba(61, 69, 77, 0.3) 100%
      );
    }
  }
`;

interface UpdateContentProp {
  villageId: number;
  adminVillage: string;
  town: string;
  natureVillage: string;
}
const UpdateManagerContent: React.FC<UpdateContentProp> = ({
  villageId,
  adminVillage,
  town,
  natureVillage
}) => {
  const [data, setData] = useSafeState<any[]>([]);
  const [allData, setAllData] = useSafeState([]);
  const [editingKey, setEditingKey] = useSafeState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useSafeState(true);
  /**
   * 查询预警责任人
   */
  const queryAlarmManager = async () => {
    setLoading(true);
    const data = await AlarmServer.queryAlarmOwners(villageId);
    let tempData = data.alarmOwners.map((item, index) => {
      return { index: index + 1, ...item };
    });
    setAllData(tempData);
    setData(tempData);
    setLoading(false);
  };
  useEffect(() => {
    queryAlarmManager();
  }, []);

  const cancel = () => {
    if (isDisableAdd) {
      let tempData = deepClone(data);
      tempData.shift();
      setData(tempData);
    }
    setEditingKey('');
    setIsDisableAdd(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await AlarmServer.deleteAlarmOwners([id]);
      if (res['code'] != 0) throw new Error();
      queryAlarmManager();
      message.success('删除成功');
    } catch (e) {
      message.error('删除异常');
    }
  };

  const save = async (id: number) => {
    form.validateFields().then(async res => {
      let tempObj = {
        duty: res.duty,
        id,
        mobile: res.mobile,
        name: res.name,
        villageId
      };
      try {
        const res = await AlarmServer.updateAlarmOwners([tempObj]);
        if (res['code'] != 0) throw new Error();
        message.success('更新成功');
        queryAlarmManager();
      } catch (e) {
        message.error('更新异常');
      } finally {
        setEditingKey('');
        setIsDisableAdd(false);
      }
    });
  };

  const edit = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
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
      width: '27%',
      editable: true
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      width: '30%',
      editable: true
    }
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   render: (_: any, record: any) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <Fragment>
    //         <Popconfirm
    //           title="确认提交？"
    //           getPopupContainer={() =>
    //             document.getElementById('update-modal-content') as HTMLElement
    //           }
    //           style={{ marginRight: '10rem', cursor: 'pointer' }}
    //           onConfirm={() => {
    //             save(record.id);
    //           }}>
    //           <img src={IMG_PATH.icon.confirm} alt="确认" />
    //         </Popconfirm>
    //         <Typography.Link style={{ marginRight: '10rem' }} onClick={cancel}>
    //           <img src={IMG_PATH.icon.cancel} alt="取消" />
    //         </Typography.Link>
    //       </Fragment>
    //     ) : (
    //       <Fragment>
    //         <Typography.Link
    //           disabled={editingKey !== ''}
    //           style={{ marginRight: '10rem' }}
    //           onClick={() => edit(record)}>
    //           <img src={IMG_PATH.icon.edit} alt="编辑" />
    //         </Typography.Link>
    //         <Popconfirm
    //           title="确认删除？"
    //           disabled={editingKey !== ''}
    //           getPopupContainer={() =>
    //             document.getElementById('update-modal-content') as HTMLElement
    //           }
    //           style={{ marginRight: '10rem', cursor: 'pointer' }}
    //           onConfirm={() => {
    //             handleDelete(record.id);
    //           }}>
    //           <img src={IMG_PATH.icon.delete} alt="删除" />
    //         </Popconfirm>
    //       </Fragment>
    //     );
    //   }
    // }
  ];
  const [searchValue, setSearchValue] = useSafeState('');
  const [isDisableAdd, setIsDisableAdd] = useSafeState(false);
  const handleClickAdd = () => {
    setCurrent(1);
    setIsDisableAdd(true);
    let tempData: {}[] = deepClone(data);
    let tempObj = {
      id: 0,
      key: '',
      name: '',
      mobile: '',
      duty: '',
      town: town,
      adminVillage: adminVillage,
      natureVillage: natureVillage
    };
    tempData.unshift(tempObj);
    setData(tempData);
    edit(tempObj);
  };
  /**
   * 根据参数查询数据
   */
  const queryAlarmByParam = async (keywords: string) => {
    let tempData =
      keywords && keywords.length > 0
        ? allData.filter(item => {
            let tempName: string = item['name'] || '';
            let tempMobile: string = item['mobile'] || '';
            let tempDuty: string = item['duty'] || '';
            return (
              tempName.includes(keywords) ||
              tempMobile.includes(keywords) ||
              tempDuty.includes(keywords)
            );
          })
        : allData;
    setData(tempData);
  };
  const [current, setCurrent] = useSafeState(1);
  const isEditing = (record: any) => record.id === editingKey; // 判断是否处于编辑状态
  return (
    <TableComWrapper>
      <div
        className="top-operation-outer flex-between"
        id="update-modal-content">
        <div className="input-search-outer">
          <Input
            value={searchValue}
            placeholder="请输入责任人信息"
            className="search-input"
            onChange={e => {
              setSearchValue(e.target.value);
            }}
            onPressEnter={() => {
              queryAlarmByParam(searchValue);
            }}
          />
          <img
            className="pointer"
            src={IMG_PATH.icon.search}
            onClick={() => {
              queryAlarmByParam(searchValue);
            }}
            draggable={false}
          />
        </div>
        {/* <Button
          className="add-btn"
          onClick={handleClickAdd}
          disabled={isDisableAdd}>
          新增
        </Button> */}
      </div>
      <Form form={form} className="table-outer">
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          rowKey="index"
          loading={loading}
          dataSource={data}
          columns={getEditColum(columns, isEditing)}
          pagination={{
            disabled: isDisableAdd,
            pageSize: 7,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [7],
            current: current,
            onChange: (page: number) => {
              setCurrent(page);
            }
          }}
        />
      </Form>
    </TableComWrapper>
  );
};

/**
 * 防御清单
 * @param param0
 * @returns
 */
const UpdateDefenseContent: React.FC<UpdateContentProp> = ({
  villageId,
  natureVillage,
  town,
  adminVillage
}) => {
  const [data, setData] = useSafeState<any[]>([]);
  const [allData, setAllData] = useSafeState([]);
  const [editingKey, setEditingKey] = useSafeState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useSafeState(true);
  /**
   * 防御对象清单
   */
  const queryDefenses = async () => {
    setLoading(true);
    const data = await AlarmServer.queryAlarmInfluencePeople(villageId);
    let tempData = data.influencePeople.map((item, index) => {
      return { index: index + 1, ...item };
    });
    setAllData(tempData);
    setData(tempData);
    setLoading(false);
  };
  useEffect(() => {
    queryDefenses();
  }, []);

  const cancel = () => {
    if (isDisableAdd) {
      let tempData = deepClone(data);
      tempData.shift();
      setData(tempData);
    }
    setEditingKey('');
    setIsDisableAdd(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await AlarmServer.deleteAlarmInfluencePeople([id]);
      if (res['code'] != 0) throw new Error();
      queryDefenses();
      message.success('防御清单=删除成功');
    } catch (e) {
      message.error('防御清单=删除异常');
    }
  };

  const save = async (id: number) => {
    form.validateFields().then(async res => {
      let tempObj = {
        duty: '',
        id,
        mobile: res.mobile,
        name: res.name,
        adminVillage,
        town,
        natureVillage
      };
      try {
        const res = await AlarmServer.updateAlarmInfluencePeople([tempObj]);
        if (res['code'] != 0) throw new Error();
        message.success('更新成功');
        setEditingKey('');
        queryDefenses();
      } catch (e) {
        message.error('更新异常');
      } finally {
        setIsDisableAdd(false);
      }
    });
  };

  const edit = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
      editable: false
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '25%',
      editable: true
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      width: '40%',
      editable: true
    }
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   render: (_: any, record: any) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <Fragment>
    //         <Popconfirm
    //           title="确认提交？"
    //           getPopupContainer={() =>
    //             document.getElementById('update-modal-content') as HTMLElement
    //           }
    //           style={{ marginRight: '10rem', cursor: 'pointer' }}
    //           onConfirm={() => {
    //             save(record.id);
    //           }}>
    //           <img src={IMG_PATH.icon.confirm} alt="确认" />
    //         </Popconfirm>
    //         <Typography.Link style={{ marginRight: '10rem' }} onClick={cancel}>
    //           <img src={IMG_PATH.icon.cancel} alt="取消" />
    //         </Typography.Link>
    //       </Fragment>
    //     ) : (
    //       <Fragment>
    //         <Typography.Link
    //           disabled={editingKey !== ''}
    //           style={{ marginRight: '10rem' }}
    //           onClick={() => edit(record)}>
    //           <img src={IMG_PATH.icon.edit} alt="编辑" />
    //         </Typography.Link>
    //         <Popconfirm
    //           title="确认删除？"
    //           disabled={editingKey !== ''}
    //           getPopupContainer={() =>
    //             document.getElementById('update-modal-content') as HTMLElement
    //           }
    //           style={{ marginRight: '10rem', cursor: 'pointer' }}
    //           onConfirm={() => {
    //             handleDelete(record.id);
    //           }}>
    //           <img src={IMG_PATH.icon.delete} alt="删除" />
    //         </Popconfirm>
    //       </Fragment>
    //     );
    //   }
    // }
  ];
  const [searchValue, setSearchValue] = useSafeState('');
  const [isDisableAdd, setIsDisableAdd] = useSafeState(false);
  const handleClickAdd = () => {
    setCurrent(1);
    setIsDisableAdd(true);
    let tempData: {}[] = deepClone(data);
    let tempObj = {
      index: '',
      id: 0,
      name: '',
      mobile: '',
      duty: '',
      town: town,
      adminVillage: adminVillage,
      natureVillage: natureVillage
    };
    tempData.unshift(tempObj);
    setData(tempData);
    edit(tempObj);
  };
  /**
   * 根据参数查询数据
   */
  const queryAlarmByParam = async (keywords: string) => {
    let tempData =
      keywords && keywords.length > 0
        ? allData.filter(item => {
            let tempName: string = item['name'] || '';
            let tempMobile: string = item['mobile'] || '';
            let tempDuty: string = item['duty'] || '';
            return (
              tempName.includes(keywords) ||
              tempMobile.includes(keywords) ||
              tempDuty.includes(keywords)
            );
          })
        : allData;
    setData(tempData);
  };
  const [current, setCurrent] = useSafeState(1);
  const isEditing = (record: any) => record.id === editingKey; // 判断是否处于编辑状态
  return (
    <TableComWrapper>
      <div
        className="top-operation-outer flex-between"
        id="update-modal-content">
        <div className="input-search-outer">
          <Input
            value={searchValue}
            placeholder="请输入要查询的人员信息"
            className="search-input"
            onChange={e => {
              setSearchValue(e.target.value);
            }}
            onPressEnter={() => {
              queryAlarmByParam(searchValue);
            }}
          />
          <img
            className="pointer"
            src={IMG_PATH.icon.search}
            onClick={() => {
              queryAlarmByParam(searchValue);
            }}
            draggable={false}
          />
        </div>
        {/* <Button
          className="add-btn"
          onClick={handleClickAdd}
          disabled={isDisableAdd}>
          新增
        </Button> */}
      </div>
      <Form form={form} className="table-outer">
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          loading={loading}
          rowKey="index"
          dataSource={data}
          columns={getEditColum(columns, isEditing)}
          pagination={{
            disabled: isDisableAdd,
            pageSize: 7,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [7],
            current: current,
            onChange: (page: number) => {
              setCurrent(page);
            }
          }}
        />
      </Form>
    </TableComWrapper>
  );
};
/**
 * 获取可编辑的column
 * @param columns
 * @param isEditing
 * @returns
 */
const getEditColum = (columns, isEditing) => {
  let mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return mergedColumns;
};
/**
 * 内容区域 输入框或者汉字
 */
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  record: any;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
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
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableComWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20rem;
  .top-operation-outer {
    width: 100%;
    height: 40rem;
    margin-bottom: 20rem;
    .input-search-outer {
      padding: 20rem 0 0 0;
      width: 300rem;
      height: 80rem;
      position: relative;
      top: 0;
      .search-input {
        background-color: rgba(1, 1, 1, 0);
        background: rgba(255, 255, 255, 0.12);
        border: 1rem solid rgba(147, 182, 230, 1);
        border-radius: 20rem;
        color: #ffffff;
        width: 100%;
        height: 40rem;
        font-size: 18rem;
        padding-left: 15rem !important;
        padding-right: 60rem !important;
      }
      img {
        width: 32rem;
        height: 32rem;
        position: absolute;
        top: 24rem;
        right: 30rem;
      }
      img:active {
        width: 34rem;
        height: 34rem;
        top: 21rem;
        right: 29rem;
      }
    }
    .add-btn {
      width: 110rem;
      height: 40rem;
      background-image: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      border: 1rem solid rgba(147, 182, 230, 1);
      border-radius: 4rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #333333;
      text-align: center;
    }
  }
  .list-header-outer {
    background: rgba(149, 174, 255, 0.28);
    width: 100%;
    height: 40rem;
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
    padding: 0 20rem;
    margin-bottom: 10rem;
  }
  .table-outer {
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
  }
  table {
    border-spacing: 0 10rem !important;
  }
  .ant-table-pagination.ant-pagination {
    justify-content: center;
    margin: 0;
  }
`;

export { ModalContent, UpdateManagerContent, UpdateDefenseContent };
