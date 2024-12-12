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
import { Provider } from './VillageInfo/store';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'umi';
import { useEffect, useState } from 'react';

const manageTypeList = [
  // {
  //   key: '/manage/userInfo',
  //   // icon: <UserOutlined />,
  //   label: '用户信息'
  // },
  {
    key: '/manage/villageInfo',
    // icon: <VideoCameraOutlined />,
    label: '村落信息'
  },
  {
    key: '/manage/responsible',
    // icon: <VideoCameraOutlined />,
    label: '预警责任人'
  },
  {
    key: '/manage/defenseList',
    label: '防御对象清单'
  },
  {
    key: '/manage/device',
    // icon: <UploadOutlined />,
    label: '设备信息',
    children: [
      {
        key: '/manage/device/camera',
        // icon: <UploadOutlined />,
        label: '监控摄像头'
      },
      {
        key: '/manage/device/waterGage',
        // icon: <UploadOutlined />,
        label: '雷达流量计'
      }
    ]
  }
  // {
  //   key: '/manage/briefUserManage',
  //   label: '多跨联动负责人'
  // }
];
const Component = observer(props => {
  const { Header, Sider, Content } = Layout;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  let { pathname } = useLocation();

  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  return (
    <Wrapper>
      <Layout>
        <Sider trigger={null}>
          <div className="demo-logo-vertical">后台管理</div>
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
                historys.push('/slyzt', true);
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
  return (
    <Provider>
      <Component {...props} />
    </Provider>
  );
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
    height: 100vh;
  }
  .ant-layout-header {
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
