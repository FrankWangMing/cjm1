import { CenterContent, SideDecoratorLine } from '@/components/LayoutsCom';
import GlobalStore from '@/store';
import { GlobalLayoutWrapper } from '@/style';
import { useMount, useSafeState, useUnmount } from 'ahooks';
import { history } from '@umijs/max';
import { SubMenu } from './components/SubMenu';

export default () => {
  const TEMP_DATA_TABS = [
    { value: 'MultiSpanLinkage', label: '多跨联动' },
    { value: 'TrackingClosedLoop', label: '追踪闭环' },
    { value: 'BusinessRules', label: '业务规则' }
  ];

  if (GlobalStore.villageList.length > 0) {
    villageNameMarker();
  }
  useMount(() => {
    let pathName = history.location.pathname.split('/')[1];
    ShenjiServer.sendAuditLog(pathName);
  });

  useUnmount(() => {
    handleLayerShow(GlobalStore.map, true, 'simple-tiles2');
    GlobalStore.leaveCurrPage();
  });

  const [type, setType] = useSafeState('MultiSpanLinkage');
  return (
    <GlobalLayoutWrapper bottomChildren={null}>
      {/* <CenterTop
        children={
          <SwitchTab
            handleTypeChange={e => {
              setType(e);
            }}
            currType={type}
            tabList={TEMP_DATA_TABS}
          />
        }
      /> */}
      <CenterContent children={<SubMenu parentKey={type} />} />
      {/* 周边的背景颜色条 */}
      <SideDecoratorLine />
    </GlobalLayoutWrapper>
  );
};

import { handleLayerShow, villageNameMarker } from '@/components/Map';
import { ShenjiServer } from '@/service';
import styled from 'styled-components';
const FooterWrapper = styled.div`
  .footer-outer {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom a {
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
      text-align: center;
      margin-right: 40rem;
    }
    a:nth-last-child(1) {
      margin: 0;
    }
    div {
      width: 1rem;
      height: 20rem;
      background-color: #ffffff;
      margin-right: 40rem;
    }
  }
`;
const Footer = () => {
  return (
    <FooterWrapper>
      <div className="footer-outer flex-center">
        <a style={{ cursor: 'default' }}>联动部门友情链接：</a>
        <a
          target="_blank"
          href="http://www.qdh.gov.cn/col/col1229229552/index.html">
          应急管理局
        </a>
        <div></div>
        <a
          target="_blank"
          href="http://www.qdh.gov.cn/col/col1229229556/index.html">
          气象局
        </a>
        <div></div>
        <a
          target="_blank"
          href="http://www.qdh.gov.cn/col/col1229229561/index.html">
          城市管理局
        </a>
        <div></div>
        <a
          target="_blank"
          href="http://www.qdh.gov.cn/col/col1293526/index.html">
          交通运输局
        </a>
      </div>
    </FooterWrapper>
  );
};
