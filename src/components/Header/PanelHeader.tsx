/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

/**
 * 界面小组件的头部样式
 */

import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';

const PanelHeader: React.FC<IProps> = ({ title, OperationFc }) => {
  return (
    <PanelHeaderWrapper>
      <div className="header-outer">
        <img
          className="bgImg"
          src={IMG_PATH.layout.titleBg}
          alt="标题背景图片"
        />
        <p>{title}</p>
        {OperationFc && OperationFc}
      </div>
    </PanelHeaderWrapper>
  );
};

interface IProps {
  title: string; //标题
  style?: any;
  size?: 's' | 'l' | 'superLarge'; // 尺寸大小：s=>小 l=>大
  operationCom?: React.ReactElement | null; // 右侧的操作栏部分
  icon?: string; // 图标
  handleClick?: Function;
  OperationFc?: JSX.Element | null;
}

const PanelHeaderWrapper = styled.div`
  width: inherit;
  height: 36rem;
  .bgImg {
    width: inherit;
    height: inherit;
    position: absolute;
  }
  .header-outer {
    width: inherit;
    height: inherit;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    p {
      position: absolute;
      font-family: MicrosoftYaHei-Bold;
      font-weight: normal;
      font-size: 18rem;
      color: #ffffff;
      text-align: center;
      font-weight: 700;
      margin-left: 14rem !important;
    }
  }
`;

export { PanelHeader };
