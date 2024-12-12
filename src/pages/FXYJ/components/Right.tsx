/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { PanelHeader } from '@/components/Header';
import { AlarmServer } from '@/service';
import { useSafeState } from 'ahooks';
import { Button, Popconfirm, Tag, Tooltip, message } from 'antd';
import { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import GlobalStore from '@/store';
import { IMG_PATH, MomentFormatStr } from '@/utils/const';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { useUpdateEffect } from '@umijs/hooks';
import {
  minFormatterStr,
  ModalContent,
  UpdateDefenseContent,
  UpdateManagerContent
} from '.';
import { observer, useLocalStore } from 'mobx-react-lite';
import { useStore } from '../store';
import { exportImage } from '@/utils';
import { MAP_IMG_NAME_TYPE } from '../const';

const map_modal_title = {
  person_manager: '预警责任人',
  person_defense: '防御对象清单'
};
/**
 * 风险预警 右侧内容
 */
const Right: React.FC = observer(() => {
  const IndexStore = useStore();
  const store = useLocalStore(
    (): {
      /**
       * 当前点击的村庄基础信息
       */
      currShowVillageInfo: {
        name: string;
        risk: string;
        riskNum: number;
        forecastTime: number;
        loading: boolean;
        area: number; // 辖区面积
        floodArea: number; // 淹没面积
        huNum: number; // 户数
        maxFloodDuration: string; // 最大淹没历时
        maxFloodWaterDeep: number; // 最大淹没水深
        totalPeople: number; // 总人数
      };
    } => ({
      currShowVillageInfo: {
        name: '',
        risk: '',
        riskNum: 0,
        forecastTime: 0,
        loading: true,
        area: 0,
        floodArea: 0,
        huNum: 0,
        maxFloodDuration: '',
        maxFloodWaterDeep: 0,
        totalPeople: 0
      }
    })
  );

  const [managerList, setManagerList] = useSafeState<ListProp[]>([]);
  const [defenseList, setDefenseList] = useSafeState<ListProp[]>([]);
  /**
   * 查询风险
   */
  const queryRisk = async () => {
    store.currShowVillageInfo.loading = true;
    // 村庄名字
    let villageNameList = GlobalStore.getVillageItemById(
      IndexStore.currProjectObj.villageId
    );
    let villageName = '';
    if (villageNameList.length > 0) {
      villageName =
        villageNameList[0].town +
        '-' +
        villageNameList[0].administrationVillage +
        '-' +
        villageNameList[0].natureVillage;
    }
    console.log(
      IndexStore.currProjectObj.startTime.format(MomentFormatStr),
      IndexStore.currProjectObj.endTime.format(MomentFormatStr)
    );
    const data = await AlarmServer.queryAlarmRisks({
      projectId: IndexStore.currProjectObj.caseId,
      id: IndexStore.currProjectObj.villageId,
      startTime: IndexStore.currProjectObj.startTime.format(MomentFormatStr),
      endTime: IndexStore.currProjectObj.endTime.format(MomentFormatStr)
    });
    store.currShowVillageInfo = {
      name: villageName,
      risk: riskTextMap[data.riskLevel],
      riskNum: data.riskLevel,
      forecastTime: IndexStore.currProjectObj.forecastTime,
      loading: false,
      area: data.area,
      floodArea: data.floodArea,
      huNum: data.huNum,
      maxFloodDuration: minFormatterStr(data.maxFloodDuration),
      maxFloodWaterDeep: data.maxFloodWaterDeep,
      totalPeople: data.totalPeople
    };
  };
  /**
   * 查询预警责任人
   */
  const queryAlarmManager = async () => {
    const data = await AlarmServer.queryAlarmOwners(
      IndexStore.currProjectObj.villageId
    );
    setManagerList(data.alarmOwners);
  };
  /**
   * 查询防御对象清单
   */
  const queryDefenses = async () => {
    const data = await AlarmServer.queryAlarmInfluencePeople(
      IndexStore.currProjectObj.villageId
    );
    setDefenseList(data.influencePeople);
  };

  /**
   * 展开或者关闭弹窗的时候重新加载列表数据
   */
  useUpdateEffect(() => {
    queryDefenses();
    queryAlarmManager();
  }, [IndexStore.modalData.type]);

  useEffect(() => {
    if (IndexStore.currProjectObj.villageId != -1) {
      queryDefenses();
      queryAlarmManager();
      queryRisk();
    }
  }, [IndexStore.currProjectObj.villageId, IndexStore.currProjectObj.endTime]);

  /**
   * 风险等级对应的map
   */
  const riskTextMap = {
    0: '无',
    1: '一级',
    2: '二级',
    3: '三级'
  };

  /**
   * 发布/导出 村落风险图
   */
  const handleClickExport = async e => {
    // 截图;
    console.log(
      'villageName-cjm',
      e.villageName + MAP_IMG_NAME_TYPE[IndexStore.currLayerId]
    );
    IndexStore.modalData.loading = true;
    IndexStore.modalData.type = 'village';
    let { url } = await exportImage(
      document.getElementById('map')!,
      `${e.villageName}（${MAP_IMG_NAME_TYPE[IndexStore.currLayerId]}）`
    );
    IndexStore.modalData.loading = false;
    IndexStore.modalData.title = `${e.villageName}（${
      MAP_IMG_NAME_TYPE[IndexStore.currLayerId]
    }）`;
    IndexStore.modalData.style = {
      width: '600rem',
      left: 'calc(50vw - 300rem)',
      top: '200rem'
    };
    IndexStore.modalData.content = (
      <ModalContent
        forecastTime={
          e.startTime.format('YYYY/MM/DD HH:mm') +
          '-' +
          e.endTime.format('YYYY/MM/DD HH:mm')
        }
        villageName={`${e.villageName}（${
          MAP_IMG_NAME_TYPE[IndexStore.currLayerId]
        }）`}
        riskLevel={e.riskLevel || ''}
        maxDepth={e.maxDepth || ''}
        maxDuration={e.maxDuration || ''}
        url={url}
        loading={IndexStore.modalData.loading}
        adjustType={IndexStore.currProjectObj.adjustType}
        currCloudJsonType={IndexStore.currLayerId}
        huNum={store.currShowVillageInfo.huNum}
        totalPeople={store.currShowVillageInfo.totalPeople}
        area={store.currShowVillageInfo.area}
        floodArea={store.currShowVillageInfo.floodArea}
      />
    );
    IndexStore.modalData.isVisible = true;
  };

  const setModalType = (e: string) => {
    IndexStore.modalData.isVisible = e != '';
    IndexStore.modalData.type = e;
    if (Object.keys(map_modal_title)?.includes(e)) {
      IndexStore.modalData.title = map_modal_title[e];
      IndexStore.modalData.content = getMapModalContentData(e);
    }
  };

  const getMapModalContentData = e => {
    return (
      <Fragment>
        {e == 'person_manager' ? (
          <UpdateManagerContent
            villageId={IndexStore.currProjectObj.villageId}
            adminVillage={IndexStore.currProjectObj.adminVillage}
            town={IndexStore.currProjectObj.town}
            natureVillage={IndexStore.currProjectObj.natureVillage}
          />
        ) : (
          <UpdateDefenseContent
            villageId={IndexStore.currProjectObj.villageId}
            adminVillage={IndexStore.currProjectObj.adminVillage}
            town={IndexStore.currProjectObj.town}
            natureVillage={IndexStore.currProjectObj.natureVillage}
          />
        )}
      </Fragment>
    );
  };

  /**
   * 从数据仓同步影响人口
   */
  const handleResetInfluence = async () => {
    const data = await AlarmServer.syncInfluence();
    // 同步之后刷新表单;
    queryDefenses();
  };

  /**
   * 从数据仓同步责任人
   */
  const handleResetManagePeople = async () => {
    const data = await AlarmServer.syncOwners();
    // 同步之后刷新表单;
    queryAlarmManager();
  };

  return (
    <RightWrapper>
      <div className="common-header-outer">
        <PanelHeader title={'防灾村镇预警详情'} />
      </div>
      <div
        className="right-content flex-between column risk-content"
        style={{ position: 'relative' }}>
        <div className="alarm-period">
          预警时段：
          {IndexStore.currProjectObj.startTime.format('MM/DD HH:mm - ') +
            IndexStore.currProjectObj.endTime.format('MM-DD HH:mm')}
        </div>
        <div className="sub-title">{store.currShowVillageInfo.name}</div>
        <img
          src={IMG_PATH.icon['risk_info_' + store.currShowVillageInfo.riskNum]}
          alt=""
        />
        {/* 仅仅占个位置使用 */}
        <div style={{ height: '5rem' }}></div>
        {/* 风险预报预警 四个方位的数据 */}
        <div className="sub-content flex-between">
          <div className="textItem-left">
            <div className="circle"></div>
            <div>
              <p>户数</p>
              <p className="text-left">{store.currShowVillageInfo.huNum}户</p>
            </div>
          </div>
          <div className="textItem-right">
            <div>
              <p>辖区面积</p>
              <p className="text-right">
                {Math.round(store.currShowVillageInfo.area * 1000) / 1000}km²
              </p>
            </div>
            <div className="circle"></div>
          </div>
        </div>
        <div className="sub-content flex-between">
          <div className="textItem-left">
            <div className="circle"></div>
            <div>
              <p>总人数</p>
              <p className="text-left">
                {store.currShowVillageInfo.totalPeople}人
              </p>
            </div>
          </div>
          <div className="textItem-right">
            <div>
              <p>最大淹没面积</p>
              <p className="text-right">
                {Math.round(store.currShowVillageInfo.floodArea * 1000) / 1000}
                km²
              </p>
            </div>
            <div className="circle"></div>
          </div>
        </div>
        <Button
          className="preview-risk-btn"
          loading={
            IndexStore.modalData.loading ||
            store.currShowVillageInfo.loading ||
            IndexStore.currProjectObj.loading ||
            !IndexStore.isMapRotateDone
          }
          disabled={
            IndexStore.modalData.loading ||
            store.currShowVillageInfo.loading ||
            IndexStore.currProjectObj.loading ||
            !IndexStore.isMapRotateDone
          }
          onClick={() => {
            handleClickExport({
              villageName: store.currShowVillageInfo.name,
              riskLevel: store.currShowVillageInfo.risk,
              maxDepth: store.currShowVillageInfo.maxFloodWaterDeep,
              maxDuration: store.currShowVillageInfo.maxFloodDuration,
              startTime: IndexStore.currProjectObj.startTime,
              endTime: IndexStore.currProjectObj.endTime
            });
          }}>
          发布/导出 村落风险图
        </Button>
      </div>
      <div className="common-header-outer">
        <PanelHeader
          title={'防汛负责人'}
          OperationFc={
            null
            // GlobalStore.isHaveRoleToEdit ? (
            //   <div className="people-outer" id="manage-alarm-reset-id">
            //     <CusPopconfirm
            //       title="确定同步数据仓信息进行所有村落的【预警责任人】信息更新吗？该操作将会清空通过本平台新增或修改的信息。"
            //       handleConfirm={handleResetManagePeople}
            //       id="manage-alarm-reset-id"
            //     />
            //     <OperationCom
            //       handleEnLarge={e => {
            //         setModalType(e);
            //       }}
            //       currType={IndexStore.modalData.type}
            //       type="person_manager"
            //     />
            //   </div>
            // ) : null
          }
        />
      </div>
      <div className="right-content manager-content">
        <ListCom
          headerData={['责任人', '岗位', '联系方式']}
          tableData={managerList}
        />
      </div>
      {/* <div className="common-header-outer">
        <PanelHeader
          title={'防御对象清单'}
          OperationFc={
            null
            // GlobalStore.isHaveRoleToEdit ? (
            //   <div className="people-outer" id="manage-defense-reset-id">
            //     <CusPopconfirm
            //       title="确定同步数据仓信息进行所有村落的【防御对象清单】信息更新吗？该操作将会清空通过本平台新增或修改的信息。"
            //       handleConfirm={handleResetInfluence}
            //       id="manage-defense-reset-id"
            //     />
            //     <OperationCom
            //       handleEnLarge={e => {
            //         setModalType(e);
            //       }}
            //       currType={IndexStore.modalData.type}
            //       type="person_defense"
            //     />
            //   </div>
            // ) : null
          }
        />
      </div>
      <div className="right-content defense-content">
        <ListCom headerData={['姓名', '联系方式']} tableData={defenseList} />
      </div> */}
    </RightWrapper>
  );
});

/**
 * 标题栏目的右上角操作栏目
 * @returns
 */
interface OperationComProp {
  handleEnLarge: Function;
  type: string;
  currType: string;
}
const OperationCom: React.FC<OperationComProp> = ({
  handleEnLarge,
  type,
  currType
}) => {
  // 处理放大按钮展开弹窗
  return (
    <div>
      {currType == type ? (
        <FullscreenExitOutlined
          onClick={() => {
            handleEnLarge('');
          }}
        />
      ) : (
        <FullscreenOutlined
          onClick={() => {
            handleEnLarge(type);
          }}
        />
      )}
    </div>
  );
};

interface ListProp {
  name: string;
  duty?: string;
  mobile: string;
}

const ListCom: React.FC<{
  headerData: string[];
  tableData: { name: string; mobile: string; duty?: string }[];
}> = ({ headerData, tableData }) => {
  return (
    <ListWrapper>
      <div className="list-tr header">
        {headerData.map(item => {
          return (
            <div className="list-th" key={item}>
              {item}
            </div>
          );
        })}
      </div>
      {tableData.length > 0 ? (
        tableData.map((item, index) => {
          return (
            <div className="list-tr" key={index}>
              <div className="list-td">
                {item.name}
                {/* {item.duty && (
                  <Tag className="td-tag" color="#2C51B3">
                    <Tooltip title={item.duty}>{item.duty}</Tooltip>
                  </Tag>
                )} */}
              </div>
              <div className="list-td"> {item.duty}</div>
              <div className="list-td">{item.mobile}</div>
            </div>
          );
        })
      ) : (
        <h1>暂无数据</h1>
      )}
    </ListWrapper>
  );
};
const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 10rem;
  ::-webkit-scrollbar {
    /*整体样式*/
    width: 5rem;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条小方块*/
    border-radius: 10rem;
    /* background-color: #2e75d3; */
    background-color: #dee7f6;
  }
  .td-tag {
    padding: 0;
    margin: 0;
    width: 95rem;
    height: 28rem;
    font-family: AlibabaPuHuiTiR;
    font-size: 14rem;
    color: #ffffff;
    text-align: center;
    overflow: hidden;
  }
  h1 {
    text-align: center;
    color: #c3c3c3;
    font-size: 20rem;
    margin-top: 20rem;
  }
  .list-td,
  .list-th {
    width: 50%;
    font-family: AlibabaPuHuiTiR;
    font-size: 14rem;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
    padding-left: 10rem;
  }
  .header {
    font-size: 16rem !important;
    background-image: linear-gradient(
      270deg,
      rgba(0, 152, 214, 0.6) 0%,
      rgba(11, 72, 99, 0.6) 100%
    ) !important;
  }
  .list-th:nth-child(1),
  .list-td:nth-child(1) {
    padding-left: 20rem;
    padding-right: 15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list-tr:nth-child(1) {
    margin: 0;
  }
  .list-tr {
    width: 100%;
    height: 40rem;
    line-height: 40rem;
    display: flex;
    margin-top: 4rem;
  }
  .list-tr:nth-child(2n + 1) {
    background: rgba(201, 214, 255, 0.24);
  }
`;
interface CusPopconfirmProp {
  handleConfirm: Function;
  title: string;
  id: string;
}
const CusPopconfirm = ({ title, handleConfirm, id }: CusPopconfirmProp) => {
  return (
    <Popconfirm
      title={
        <div className="confirm-header-content">
          <h1>同步数据仓更新</h1>
          <p>{title}</p>
        </div>
      }
      getPopupContainer={() => document.getElementById(id)!}
      onConfirm={() => handleConfirm()}
      okText="确定"
      icon={false}
      cancelText="取消">
      <RedoOutlined />
    </Popconfirm>
  );
};

const RightWrapper = styled.div`
  width: 420rem;
  height: 922rem;
  .people-outer {
    position: absolute;
    height: 100%;
    padding: 0 20rem;
    width: 100%;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      cursor: pointer;
      font-size: 26rem;
    }
  }
  div {
    font-family: AlibabaPuHuiTiR;
    font-size: 16rem;
    color: #ffffff;
  }
  .right-content {
    padding: 10rem 20rem;
    margin-bottom: 20rem;
    /* background-image: linear-gradient(
      180deg,
      rgba(37, 56, 96, 0.8) 1%,
      rgba(0, 0, 0, 0.6) 99%
    ); */
    background-image: linear-gradient(
      180deg,
      rgba(0, 13, 17, 0.45) 0%,
      rgba(40, 49, 53, 0.9) 100%
    );
    border-radius: 0rem 0rem 4rem 4rem;
  }
  .risk-content {
    height: 282rem;
    padding-bottom: 20rem;
    img {
      position: absolute;
      bottom: 90rem;
      width: 158rem;
      height: 120rem;
    }
  }
  .manager-content {
    height: 574rem;
    padding: 20rem;
  }
  .defense-content {
    height: 230rem;
    padding: 20rem;
  }
  .sub-title {
    width: 100%;
    height: 0rem;
    line-height: 40rem;
    margin-top: 30rem;
  }
  .sub-title::before {
    color: #3cdcff;
    content: '.';
    width: 4rem;
    height: 16rem;
    background: #3cdcff;
    border-radius: 1px;
    margin-right: 8rem;
  }
  /* 预警时段 */
  .alarm-period {
    padding-left: 20rem;
    width: 100%;
    height: 24rem;
    border-radius: 12rem;
    font-size: 16rem;
    font-family: AlibabaPuHuiTiM;
    color: #ffffff;
    position: absolute;
  }
  .sub-content {
    font-size: 16rem;
    width: 100%;
    /* padding: 12rem 10rem; */
    .textItem-left {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      .circle {
        margin-top: 8rem;
        width: 6rem;
        height: 6rem;
        margin-right: 6rem;
        background-image: linear-gradient(161deg, #abf5a7 0%, #27c763 98%);
        border: 0.5px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        box-shadow: 0px 0px 4px 0px rgba(71, 255, 136, 0.5);
      }
    }
    .textItem-right {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      .circle {
        margin-top: 8rem;
        width: 6rem;
        height: 6rem;
        margin-left: 6rem;
        background-image: linear-gradient(161deg, #abf5a7 0%, #27c763 98%);
        border: 0.5px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        box-shadow: 0px 0px 4px 0px rgba(71, 255, 136, 0.5);
      }
    }
    .text-left {
      text-align: left;
      font-size: 20rem;
      font-weight: 700;
    }
    .text-right {
      text-align: right;
      font-size: 20rem;
      font-weight: 700;
    }
    z-index: 1;
  }
  .preview-risk-btn {
    background: linear-gradient(
      180deg,
      rgba(113, 123, 132, 0.3) 0%,
      rgba(61, 69, 77, 0.3) 100%
    );
    width: 100%;
    height: 40rem;
    font-family: MicrosoftYaHei;
    font-size: 16rem;
    color: #ffffff;
    text-align: center;
  }
  .preview-risk-btn:hover {
    border: 1px solid #ffffff;
    background: linear-gradient(180deg, #0098d6 0%, #0b4863 100%);
  }
  .ant-popconfirm {
    left: -415rem;
    top: -130rem;
  }
  /* 预警责任人 & 防御对象清单点击Popover */
  .ant-popover-message-title,
  .ant-popover-message {
    padding: 0;
  }
  .ant-popover-inner-content {
    width: 414rem;
    height: 222rem;
    background: linear-gradient(
      180deg,
      rgba(37, 56, 96, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    border-radius: 4rem;
    padding: 0;
    .confirm-header-content {
      h1 {
        width: 100%;
        height: 64rem;
        background: linear-gradient(
          180deg,
          rgba(0, 5, 17, 0.5) 0%,
          #282c35 100%
        );
        border-radius: 4rem 4rem 0rem 0rem;
        font-size: 24rem;
        font-family: AlibabaPuHuiTiR;
        padding: 0 20rem;
        line-height: 64rem;
        color: #ffffff;
        margin: 0;
      }
      p {
        width: 100%;
        background: linear-gradient(
          180deg,
          rgba(37, 56, 96, 0.8) 0%,
          rgba(0, 0, 0, 0.6) 100%
        );
        border-radius: 4rem;
        text-align: left;
        padding: 10rem 35rem !important;
        font-size: 18rem;
        font-family: AlibabaPuHuiTiR;
        color: #ffffff;
        line-height: 26rem;
      }
    }
    .ant-popover-buttons {
      position: absolute;
      bottom: -5rem;
      width: 100%;
      height: 60rem;
      padding: 0 20rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: linear-gradient(
        180deg,
        rgba(37, 56, 96, 0.8) 0%,
        rgba(0, 0, 0, 0.6) 100%
      );
      border-radius: 4rem;
      button {
        height: 32rem;
        background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
        border-radius: 2rem;
        border: 1rem solid #93b6e6;
        span {
          font-size: 16rem;
          font-family: AlibabaPuHuiTiM;
          color: #989595;
          line-height: 22rem;
        }
      }
      button:nth-child(2) {
        background: linear-gradient(180deg, #5789da 0%, #2c51b3 100%);
        border-radius: 2rem;
        border: 1rem solid #93b6e6;
        span {
          font-size: 16rem;
          font-family: AlibabaPuHuiTiB;
          color: #ffffff;
          line-height: 22rem;
        }
      }
    }
  }
`;
export { Right };
