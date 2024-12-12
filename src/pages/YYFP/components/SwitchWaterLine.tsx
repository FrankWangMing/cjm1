/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { Radio } from 'antd';

/**
 * 水位线结果切换
 * @returns
 */
interface SwitchWaterLineProp {
  allWaterLine: string[];
  currentWaterLine: string;
  handleCurrentWaterLineChange: Function;
}
const SwitchWaterLine: React.FC<SwitchWaterLineProp> = ({
  allWaterLine,
  currentWaterLine,
  handleCurrentWaterLineChange
}: SwitchWaterLineProp) => {
  return (
    <SwitchWaterLineWrapper className="bg-color-colorBar">
      <span>水位线</span>
      <Radio.Group
        value={currentWaterLine}
        onChange={e => {
          handleCurrentWaterLineChange(e);
        }}>
        {allWaterLine.map((item, index) => {
          return (
            <Radio key={index} value={item}>
              {item}m
            </Radio>
          );
        })}
      </Radio.Group>
    </SwitchWaterLineWrapper>
  );
};

export { SwitchWaterLine };

import styled from 'styled-components';
const SwitchWaterLineWrapper = styled.div`
  padding: 10rem;
  width: 150rem;
  margin-left: -100rem;
  height: 130rem;
  span {
    color: #fff;
    font-family: AlibabaPuHuiTiR;
    font-size: 20rem;
    color: #ffffff;
  }
  .ant-radio-wrapper {
    margin: 5rem 0;
  }
  .ant-radio-inner {
    background-color: rgba(1, 1, 1, 0);
  }
  .ant-radio-wrapper:hover .ant-radio,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    border-color: #fff;
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: #fff;
    background: rgba(1, 1, 1, 0);
  }
  .ant-radio-checked .ant-radio-inner::after {
    background-color: #fff;
  }
  .ant-radio-checked::after {
    border: 1rem solid #fff !important;
  }
`;
