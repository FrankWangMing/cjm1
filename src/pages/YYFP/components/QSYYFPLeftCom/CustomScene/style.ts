import styled from 'styled-components';
import { InputNumber, Select } from 'antd';

export const WaterLevelSelectWrapper = styled(Select)`
  height: 28rem !important;
  background: transparent;
  color: #fff;
  :not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid rgba(80, 253, 255, 0.5);
  }

  :hover {
    .ant-select-selector {
      border: 1px solid rgba(80, 253, 255, 0.5) !important;
    }
  }

  .ant-select-selector {
    height: 28rem !important;
    /* background: #020623 !important; */
  }

  .ant-select-selection-search {
    height: 28rem;
    line-height: 28rem;
  }

  .ant-select-selection-item {
    height: 28rem;
    line-height: 28rem;
  }

  .ant-select-arrow {
    color: white;
  }

  .ant-select-selection-search {
    height: 28rem !important;
    font-size: 16rem !important;
    line-height: 28rem !important;
  }

  .ant-select-selection-item {
    height: 28rem !important;
    line-height: 28rem !important;
    opacity: 0.8;
    font-family: WeiRuanYaHei;
    font-size: 14rem;
    color: #ffffff;
    font-weight: 400;
  }

  .ant-select-selector {
    height: 28rem !important;
    font-size: 16rem !important;
    line-height: 28rem !important;
    background: #282c35 !important;
    border: 1px solid rgba(151, 151, 151, 1);
  }

  > .ant-select-arrow {
    color: white;
  }
`;

export const WaterLevelInputNumberWrapper = styled(InputNumber)`
  width: 100%;
  font-size: 11px;
`;

export const RiverSelector = styled(Select)`
  height: 28rem;
  color: rgba(255, 255, 255, 0.8);

  :not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid rgba(80, 253, 255, 0.5);
  }

  :hover {
    .ant-select-selector {
      border: 1px solid rgba(80, 253, 255, 0.5) !important;
    }
  }

  .ant-select-selector {
    height: 28rem !important;
    background: #020623 !important;
  }

  .ant-select-selection-search {
    height: 28rem;
    line-height: 28rem;
  }

  .ant-select-selection-item {
    height: 28rem;
    line-height: 28rem !important;
  }

  .ant-select-arrow {
    color: white;
  }
`;

export const RainingInput = styled(InputNumber)`
  .ant-input-number-group-addon {
    border: 1px solid rgba(80, 253, 255, 0.5);
    border-left: none;
    background: rgba(2, 12, 35, 1);
    font-family: MicrosoftYaHei;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 0;
    font-weight: 400;
    height: 28rem;
    padding: 0 5rem;
  }
  .ant-input-number-input-wrap {
    background-color: rgba(2, 12, 35, 1);
    border: 1px solid rgba(80, 253, 255, 0.5);
    border-right: none;
  }
  input {
    border-radius: 0;
    font-family: MicrosoftYaHei;
    font-size: 14rem;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 0;
    font-weight: 400;
  }
  .ant-input-number {
    border: none;
  }
  .ant-input-number-input {
    height: 28rem;
    border-right: none;
    .ant-input-number-handler-wrap {
      height: calc(100% - 2px); /* 减去边框的厚度，确保箭头部分的高度也调整 */
    }
  }
  .ant-input-number:focus,
  .ant-input-number-focused {
    box-shadow: none;
  }
`;
