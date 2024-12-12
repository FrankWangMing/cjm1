/*
 * @Author: Even
 * @Date: 2022-03-28 14:13:26
 * @LastEditors: Even
 * @LastEditTime: 2022-04-06 09:14:10
 * @FilePath: /cae/SX/frontend/src/pages/404.tsx
 */
import { Button, Result } from 'antd';
import React from 'react';
// import { history } from 'umi';
// import { login } from '@/service';
// import { JWT_TOKEN_KEY } from '@/utils';
import styled from 'styled-components';
const Wrapper = styled.div`
  .ant-result-404 {
    height: 100vh;
    padding-top: 100px;
  }
`;

const NoFoundPage: React.FC = () => (
  <Wrapper>
    <Result
      status="404"
      title="404"
      subTitle="页面不存在"
      extra={
        <Button
          type="primary"
          onClick={async () => {
            // const { token = '' } = await login();
            // if (token) {
            //   localStorage.setItem(JWT_TOKEN_KEY, token);
            //   history.push('/');
            // }
            //
          }}>
          返回首页
        </Button>
      }
    />
  </Wrapper>
);

export default NoFoundPage;
