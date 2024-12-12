/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

/**
 * CenterTop的切换组件
 */

import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';

/**
 * @params handleTypeChange type发生变化后的处理事件
 * @params currType 当前选中的type
 * @params tabList tab的列表
 */
interface Props {
  handleTypeChange: Function;
  currType: string;
  tabList: { value: string; label: string }[];
}
export default ({ handleTypeChange, currType, tabList }: Props) => {
  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {tabList.map(item => {
          return (
            <div
              key={item.value}
              onClick={() => {
                handleTypeChange(item.value);
              }}
              className={[
                'center-sub-menu-tab',
                currType === item.value ? 'center-sub-menu-tab_active' : ''
              ].join(' ')}>
              {item.label}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* 中间切换 */
  .center-sub-menu-tab {
    width: 220rem;
    height: 68rem;
    background-image: url(${IMG_PATH.layout.center.tab});
    background-repeat: no-repeat;
    background-size: 100%;
    margin: 0 10rem;
    cursor: pointer;
    font-family: HuXiaoBoNanShenTi;
    font-size: 22rem;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    line-height: 68rem;
    transition: all 300ms;
  }
  .center-sub-menu-tab:hover,
  .center-sub-menu-tab_active {
    background-image: url(${IMG_PATH.layout.center.tabSelected});
  }
`;
