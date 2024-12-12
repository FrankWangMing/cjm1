import styled from 'styled-components';
import { Checkbox } from 'antd';
import { IMG_PATH } from '@/utils/const';

export const ReportListWrapper = styled.div`
  background-image: linear-gradient(
    180deg,
    rgba(0, 13, 17, 0.45) 0%,
    rgba(40, 49, 53, 0.9) 100%
  );
  border-radius: 0px 0px 4px 4px;
  height: 549rem;
  padding: 14rem 0 0 0;
  position: relative;

  .list-header {
    height: 38rem;
    display: flex;
    justify-content: space-between;
    line-height: 38rem;
    text-align: center;
    margin: 0 20rem;

    background-image: linear-gradient(
      270deg,
      rgba(0, 152, 214, 0.6) 0%,
      rgba(11, 72, 99, 0.6) 100%
    );

    .list-header-item {
      font-family: WeiRuanYaHei;
      font-size: 16rem;
      color: #ffffff;
      font-weight: 400;
    }
  }

  .list-content {
    font-size: 16rem;
    padding: 0 20rem;
    padding-bottom: 32rem;
    border-bottom: 2px solid #93ddff;
    height: 432rem;
    position: relative;
  }

  .list-col {
    height: 32rem;
    display: flex;
    justify-content: space-between;
    line-height: 32rem;
    text-align: center;
    margin-bottom: 2rem;

    .list-col-item {
      font-family: WeiRuanYaHei;
      font-size: 14rem;
      color: #ffffff;
      font-weight: 400;
    }
  }

  .list-col:nth-child(2n + 1) {
    background: rgba(255, 255, 255, 0.08);
  }
  .list-col:nth-child(2n) {
    background: rgba(255, 255, 255, 0.16);
  }
  .check {
    text-align: center;
    cursor: pointer;
    color: #31d6ff;
  }

  .ant-pagination {
    position: absolute;
    bottom: 20rem;
    .ant-pagination-item,
    .ant-pagination-prev,
    .ant-pagination-next,
    .ant-pagination-item-link,
    .ant-select-selector,
    .ant-pagination-options-quick-jumper,
    .ant-select,
    input {
      height: 32rem !important;
      line-height: 32rem !important;
    }

    .ant-select-selection-item {
      line-height: 32rem;
    }
  }
  .list-bottom {
    display: flex;
    align-items: center;
    margin-top: 13rem;
    margin-left: 20rem;
  }
`;

export const ReportListCheckbox = styled(Checkbox)`
  .ant-checkbox {
    .ant-checkbox-inner {
      background: transparent;
      width: 16rem;
      height: 16rem;
    }
    .ant-checkbox-inner::after {
      width: 5rem;
      height: 8rem;
    }
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    border: 0.8px solid rgba(255, 255, 255, 1);
    border-radius: 3.2px;
  }
`;

export const BottomBtn = styled.button`
  width: 112rem;
  height: 36rem;
  font-family: WeiRuanYaHei;
  font-size: 16rem;
  line-height: 36rem;
  color: #ffffff;
  text-align: center;
  font-style: normal;
  background: transparent;
  background-image: url(${IMG_PATH.buttonBg2}) !important;
  background-size: 100%;
  background-repeat: no-repeat;
  cursor: pointer;
  border: none;

  &.btn-loading {
    cursor: default;
    pointer-events: none;
  }
  :disabled {
    cursor: not-allowed;
  }
  :nth-child(2) {
    position: absolute;
    right: 152rem;
  }
  :nth-child(3) {
    position: absolute;
    right: 20rem;
  }
  .anticon-loading {
    margin-right: 6rem;
  }
`;
