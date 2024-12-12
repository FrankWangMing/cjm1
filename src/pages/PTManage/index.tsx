/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { Button, Layout, Menu } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LeftOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { history, historys } from '@/utils/history';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'umi';
import { useEffect, useState } from 'react';

const manageTypeList = [
  {
    key: '/ptmanage/modal',
    // icon: <VideoCameraOutlined />,
    label: '模型平台'
  },
  {
    key: '/ptmanage/knowledge',
    // icon: <VideoCameraOutlined />,
    label: '知识平台'
  }
];
const Component = observer(props => {
  const { Header, Sider, Content } = Layout;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  let { pathname } = useLocation();

  useEffect(() => {
    console.log('pathname', pathname);
    if (pathname.includes('modal')) {
      setSelectedKeys(['/ptmanage/modal']);
    } else {
      setSelectedKeys([pathname]);
    }
  }, [pathname]);

  return (
    <Wrapper>
      <Layout>
        <Sider trigger={null}>
          <div className="demo-logo-vertical">平台管理</div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[pathname]}
            selectedKeys={selectedKeys}
            items={manageTypeList}
            onClick={e => {
              history.push(e.key);
              localStorage.setItem('currRouter', e.key);
            }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0
            }}>
            <div
              className="back-btn"
              onClick={() => {
                historys.push('/hlyb', true);
              }}>
              <LeftOutlined />
              返回主平台
            </div>
          </Header>
          <Content className="content-container">{props['children']}</Content>
        </Layout>
      </Layout>
    </Wrapper>
  );
});
export default function Manage(props) {
  return <Component {...props} />;
}
const Wrapper = styled.div`
  .total-count,
  .ant-table-cell,
  .ant-form label,
  .ant-btn > .anticon + span,
  .ant-btn a,
  .info-title span {
    font-size: 18rem;
  }
  .ant-btn {
    display: flex;
    align-items: center;
  }
  .total-count {
    margin-right: 30rem;
  }
  .demo-logo-vertical {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    color: #fff;
    font-size: 30rem;
    font-family: AlibabaPuHuiTiB;
    letter-spacing: 4rem;
    background-color: #2851cf;
  }
  .back-btn {
    margin-right: 60rem;
    color: #fff;
    cursor: pointer;
    font-size: 20rem;
    text-decoration: underline;
  }
  .content-container {
    padding: 20rem 15rem;
    min-height: 280rem;
  }
  .ant-layout-sider {
    background-color: #fff !important;
  }
  .ant-layout-content {
    height: calc(100vh - 64px);
    overflow-y: scroll;
  }
  .ant-layout-header {
    height: 64px;
    background-color: #2851cf;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .ant-menu-title-content {
    font-size: 20rem;
    font-weight: 400;
  }
`;
