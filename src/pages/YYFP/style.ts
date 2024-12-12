/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import styled from 'styled-components';

export const YYFPWrapper = styled.div``;

export const Wrapper = styled.div`
  position: relative;
  width: inherit;
  height: inherit;
  .process-outer {
    width: 100%;
    height: 120rem;
    position: fixed;
    bottom: 0;
    color: #fff;
  }
`;

export const LeftWrapper = styled.div`
  position: absolute;
  left: 20rem;
  top: 100rem;
  .panelContent {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    p {
      width: 204rem;
      height: 52rem;
      text-align: center;
      line-height: 50rem;
      background-image: linear-gradient(83deg, #215ba7 0%, #458f8b 100%);
      border: 1rem solid rgba(156, 230, 255, 1);
      border-radius: 100rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
    }
  }
`;

export const RightWrapper = styled.div`
  position: absolute;
  right: 20rem;
  top: 100rem;
  display: flex;
  .risk-analysis-outer {
    width: 420rem;
    height: 490rem;
    .custom-select {
      width: 158rem;
      height: 32rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #333333;
    }
  }
  .risk-analysis-header-outer {
    width: inherit;
    height: 48rem;
  }
  .risk-analysis-content-outer {
    width: inherit;
    height: 438rem;
    background-image: linear-gradient(
      270deg,
      rgba(97, 142, 237, 0.4) 0%,
      #14366d 100%
    );
    border-radius: 0px 0px 4px 4px;
    padding: 20rem;
  }
  .risk-analysis-content-outer .form-outer {
    .ant-form-item {
      margin: 0 !important;
      margin-bottom: 20rem !important;
    }
    .ant-form-item-label > label {
      font-family: AlibabaPuHuiTiM;
      font-size: 18rem;
      color: #ffffff;
      text-align: right;
    }
    .ant-select.ant-select-in-form-item {
      width: 198rem;
      height: 32rem;
    }
    .ant-select-selection-item {
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #333333;
    }
    .ant-input[disabled] {
      border: 0;
      width: 198rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 2px;
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #333333;
    }
    .ant-form-item-control-input-content {
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #fff;
    }
    .calc-btn {
      width: 360rem;
      height: 40rem;
      background-image: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      border: 1px solid rgba(147, 182, 230, 1);
      border-radius: 4px;
      font-family: AlibabaPuHuiTiM;
      font-size: 18rem;
      color: #333333;
      text-align: center;
    }
  }
`;
