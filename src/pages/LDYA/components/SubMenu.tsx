/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { SubTitleCom } from '@/components/LayoutsCom';
import { useSafeState } from 'ahooks';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  AlarmIndex,
  ClosedLoopBriefReport,
  ClosedLoopFloodAlarm,
  RiskLevel
} from './cusModule';
import { LinkageBriefReport } from './cusModule/LinkageBriefReport';

interface SubMenuProp {
  parentKey: string;
}
const SUB_ITEMS: {
  [key: string]: {
    loadingStatusObj: {
      [key: string]: string;
    };
    items: {
      key: string;
      title: string;
      component?: JSX.Element;
    }[];
    component?: JSX.Element;
  };
} = {
  MultiSpanLinkage: {
    loadingStatusObj: {
      'MultiSpanLinkage-FloodControlBulletin': 'success',
      'MultiSpanLinkage-FloodWarning': 'success'
    },
    items: [
      // {
      //   key: 'MultiSpanLinkage-FloodControlBulletin',
      //   title: '防汛专报',
      //   component: <LinkageBriefReport />
      // },
      // {
      //   key: 'MultiSpanLinkage-FloodWarning',
      //   title: '洪水预警',
      //   component: <LinkageFloodAlarm />
      // }
    ],
    component: <LinkageBriefReport />
  },
  TrackingClosedLoop: {
    loadingStatusObj: {
      'TrackingClosedLoop-FloodControlBulletin': 'success',
      'TrackingClosedLoop-FloodWarning': 'success'
    },
    items: [
      // {
      //   key: 'TrackingClosedLoop-FloodControlBulletin',
      //   title: '防汛专报',
      //   component: <ClosedLoopBriefReport />
      // },
      // {
      //   key: 'TrackingClosedLoop-FloodWarning',
      //   title: '洪水预警',
      //   component: <ClosedLoopFloodAlarm />
      // }
    ],
    component: <ClosedLoopBriefReport />
  },
  BusinessRules: {
    loadingStatusObj: {
      'Business-RulesWarningIndex': 'success',
      'BusinessRules-RiskLevel': 'success'
    },
    items: [
      {
        key: 'Business-RulesWarningIndex',
        title: '临界雨量预警指标',
        component: <AlarmIndex />
      },
      {
        key: 'BusinessRules-RiskLevel',
        title: '风险等级划分标准',
        component: <RiskLevel />
      }
    ]
  }
};
const SubMenu: React.FC<SubMenuProp> = ({ parentKey }) => {
  const [selectedSubKey, setSelectedSubKey] = useSafeState<string[]>([]);

  useEffect(() => {
    if (parentKey === 'TrackingClosedLoop') {
    } else {
      if (SUB_ITEMS[parentKey].items.length > 0) {
        setSelectedSubKey([SUB_ITEMS[parentKey].items[0].key]);
      }
    }
  }, [parentKey]);

  return (
    <SubMenuWrapper>
      <div className="content-header-outer">
        <SubTitleCom
          layerList={SUB_ITEMS[parentKey].items}
          isShowProcess={false}
          selectedMenu={selectedSubKey}
          loadingStatusObj={SUB_ITEMS[parentKey].loadingStatusObj}
          isMutex={true}
          isCanNull={false}
          handleActiveChange={e => {
            setSelectedSubKey(e);
          }}
        />
      </div>
      <div className="content-desc-outer ">
        {SUB_ITEMS[parentKey].items.length > 0 ? (
          SUB_ITEMS[parentKey].items.map(item => {
            return (
              <div key={item.key}>
                {item.key == selectedSubKey[0] ? item.component : null}
              </div>
            );
          })
        ) : (
          <div>{SUB_ITEMS[parentKey].component}</div>
        )}
      </div>
    </SubMenuWrapper>
  );
};

const SubMenuWrapper = styled.div`
  .center-bottom-item {
    width: 220rem !important;
    line-height: 50rem !important;
  }
  .content-header-outer {
    margin-top: -10rem;
  }
  .content-desc-outer {
    width: 100%;
    margin-top: 20rem;
  }
  .content-desc-right {
  }
  .content-inner-header {
    width: inherit;
    height: 48rem;
    background-image: linear-gradient(180deg, rgba(0, 5, 17) 0%, #282c35 100%);
    border-radius: 4rem 4rem 0rem 0rem;
  }
  .half-item {
    width: calc(50vw - 30rem);
    height: calc(100vh - 306rem);
  }
  .two2one_two {
    width: 1200rem;
    height: calc(100vh - 306rem);
  }
  .two2one_one {
    width: calc(100vw - 1260rem);
    height: calc(100vh - 306rem);
  }

  /* 防汛专报 */
  .flood-brief-outer {
    width: 100%;
    height: 766rem;
    position: relative;
    .pdf-content-outer {
      width: 100%;
      height: calc(100% - 64rem);
      padding: 12rem 22rem;
      .pdf-content {
        width: 100%;
        height: 100%;
        background-color: #fff;
        overflow: hidden;
      }
      border-bottom: 2px solid #93ddff;
    }

    .operation-btn-outer {
      margin-top: 12rem;
      margin-left: 20rem;

      button:nth-child(2) {
        position: absolute;
        right: 20rem;
      }
    }
  }
`;

export { SubMenu };
