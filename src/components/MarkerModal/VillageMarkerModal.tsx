/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 村庄弹窗事件
 */

import { IVillageInfo } from '@/domain/valley';
import { IMG_PATH } from '@/utils/const';
import { useSafeState } from 'ahooks';
import { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { VillageInfo } from './VillageInfo';

interface MarkerModalProps {
  tabList: {
    title: string;
    width: string;
    key: string;
    JsxContent: JSX.Element;
  }[];
  villageInfo: IVillageInfo;
  villageId: number;
}
const VillageMarkerModal = ({
  villageInfo,
  tabList,
  villageId
}: MarkerModalProps) => {
  const [activeTab, setActiveTab] = useSafeState('');
  useEffect(() => {
    if (tabList.length > 0) {
      setActiveTab(tabList[0].key);
    } else {
      return;
    }
  }, [tabList]);
  return (
    <VillageMarkerModalWrapper className="bg-content-area-alpha ">
      <VillageInfo data={villageInfo} villageId={villageId} />
      <div className="village-modal-operation">
        <div className="modal-content-tab-title">
          {tabList.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setActiveTab(item.key);
                }}
                className={[
                  'modal-content-tab-item',
                  'transition-duration',
                  activeTab === item.key ? ' modal-content-tab-item_active' : ''
                ].join(' ')}
                style={{ width: item.width }}>
                {item.title}
              </div>
            );
          })}
        </div>
        <div className="modal-content-charts">
          {tabList.map((item, index) => {
            if (item.key == activeTab) {
              return <Fragment key={index}>{item.JsxContent}</Fragment>;
            }
          })}
        </div>
      </div>
    </VillageMarkerModalWrapper>
  );
};

const VillageMarkerModalWrapper = styled.div`
  width: inherit;
  height: 530rem;
  .village-modal-operation {
    position: absolute;
    left: 0rem;
    width: 100%;
    height: 400rem;
    .modal-content-tab-title {
      margin-top: 10rem;
      border-top: 1rem solid rgba(255, 255, 255, 0.24);
      padding: 0 20rem;
      width: 100%;
      display: flex;
      height: 42rem;
      .modal-content-tab-item {
        width: 140rem;
        height: 42rem;
        text-align: center;
        line-height: 42rem;
        cursor: pointer;
        font-family: AlibabaPuHuiTiR;
        font-size: 18rem;
        color: #ffffff;
        text-align: center;
        background-color: rgba(216, 216, 216, 0.18);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
      .modal-content-tab-item:hover {
        background-image: linear-gradient(
          0deg,
          rgba(0, 152, 214, 0.4) 0%,
          rgba(11, 72, 99, 0.4) 100%
        );
        box-shadow: inset 0px -1px 0px 0px rgba(0, 207, 252, 1);
        /* background-image: url(${IMG_PATH.icon.modalTabSelected}); */
        margin-top: -1rem;
      }
      .modal-content-tab-item_active {
        background-image: linear-gradient(
          0deg,
          rgba(0, 152, 214, 0.4) 0%,
          rgba(11, 72, 99, 0.4) 100%
        );
        box-shadow: inset 0px -1px 0px 0px rgba(0, 207, 252, 1);
        /* background-image: url(${IMG_PATH.icon.modalTabSelected}); */
        margin-top: -1rem;
      }
    }
    .modal-content-charts {
      height: 400rem;
      padding: 0 20rem;
    }
  }
`;
export { VillageMarkerModal };
