/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 */
import { Spin } from 'antd';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingWrapper = styled.div`
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const CustomerLoadingImgWrapper = styled.div`
  .customer_img {
    font-size: 0.4rem;
    color: #4371fb;
  }
`;

/**
 * loading图形组件
 * @returns 返回转圈图形的样式 -- 可以在这里转圈样式
 */
const antIcon = function antIcon(color?: string) {
  return (
    <CustomerLoadingImgWrapper>
      <LoadingOutlined style={{ color }} spin />
    </CustomerLoadingImgWrapper>
  );
};

/**
 * loadingFlag： 如果是true返回转圈的组件否则返回<></>
 *
 * height：转圈图层的高度 ->没有必要
 */
interface LoadingProps {
  loadingFlag: boolean;
  color?: string;
}
export default function Loading(props: LoadingProps) {
  return (
    <LoadingWrapper>
      {props.loadingFlag && (
        <div className="loading">
          <Spin size="large" indicator={antIcon(props.color)} />
        </div>
      )}
    </LoadingWrapper>
  );
}
