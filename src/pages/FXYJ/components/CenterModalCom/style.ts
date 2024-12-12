import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';
const CusModalWrapper = styled.div`
  padding: 0;
  .SLYZT-modal-title-desc {
    background: rgba(143, 231, 255, 0.4);
    font-size: 18rem;
  }
  .time_interval {
    position: absolute;
    right: 160rem;
    .ant-radio-wrapper {
      display: block;
    }
    span {
      font-size: 16rem;
    }
    .ant-radio-input,
    .ant-radio-inner {
      width: 16rem !important;
      height: 16rem !important;
    }

    .ant-radio-inner {
      background-color: transparent !important;
      border: 1rem solid #8fe7ff !important;
      border-radius: 50%;
      transition: all 0.3s;
      box-shadow: 0 0 1rem 1rem rgba(143, 231, 255, 0.4);
    }

    .ant-radio-inner::after {
      background: linear-gradient(
        225deg,
        rgb(222, 255, 255) 0%,
        rgb(143, 231, 255) 28%,
        rgba(68, 164, 196, 0.8) 47%,
        rgba(32, 131, 216, 0.2) 100%
      );
    }
  }
  .cus-modal-search-btn {
    width: 78rem;
    height: 36rem;
  }
  .time-operation-outer {
    display: flex;
    align-items: center;
    .ant-radio-inner::after {
      display: none;
    }
    .ant-radio-wrapper {
      margin: 0px !important;
      position: relative;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: DIN-BlackItalic, AlibabaPuHuiTiR;
      color: #fff;
      span.ant-radio + * {
        margin-top: 8rem;
        padding: 0 !important;
      }
    }
    .ant-form label {
      color: #fff;
      display: flex;
      flex-direction: column !important;
      justify-content: center;
      align-items: center;
      height: 40rem;
      margin-right: 20rem;
    }
    /* 选择list */
    .radio-list {
      padding: 0 20rem;
      .radio-item-outer {
        display: contents;
      }
      .ant-radio-wrapper {
        margin: 8 !important;
      }
      .splice-line {
        background: rgba(255, 255, 255, 0.24);
        border-radius: 2rem;
        width: 28rem;
        height: 2rem;
        margin-top: -20rem;
      }
    }
  }
  .ant-picker-panel-container .ant-picker-panel {
    font-family: AlibabaPuHuiTiR;
    font-size: 16rem;
  }
  .ant-picker-range {
    width: 360rem;
    height: 40rem;
    background: linear-gradient(180deg, rgba(0, 5, 17, 0.5) 0%, #282c35 100%);
    border: 1rem solid rgba(0, 0, 0, 1);
    border-radius: 2rem;
    .ant-picker-input > input,
    span {
      color: #fff;
      font-family: AlibabaPuHuiTiR;
      font-size: 16rem;
    }
  }

  .search-form-outer {
    background: #081b23;
    border-bottom: 2px solid rgba(57, 206, 255, 0.2);
    width: 100%;
    /* margin-bottom: 10rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rem;
    height: 18%;
    .back2select {
      color: rgba(188, 224, 255, 0.99);
      font-size: 18rem !important;
      line-height: 40rem !important;
      margin: 0 10rem;
      cursor: pointer;
    }
    ._content {
      width: 100%;
    }
  }

  .content-list-graph {
    background: #081b23;
    height: calc(72% - 10rem);
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    strong {
      font-size: 20px;
      color: #fff;
    }
    table {
      border-spacing: 0 4rem !important;
      margin-top: 20rem;
    }
    .ant-table,
    .ant-table-cell {
      background-color: rgba(1, 1, 1, 0);
      font-family: WeiRuanYaHei;
      color: #ffffff;
      padding: 0;
      border: 0;
    }
    .ant-table-thead {
      background: linear-gradient(270deg, #0098d6 0%, #0b4863 100%);
      height: 42rem;
      font-size: 18rem;
    }
    .ant-table-thead
      > tr
      > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
      display: none;
    }
    .ant-table-cell {
      padding: 0 10rem;
    }
    tr {
      height: 42rem;
      width: 100%;
      background: rgba(255, 255, 255, 0.12);
    }
    .ant-table-row:hover .ant-table-cell-row-hover {
      background-color: rgba(255, 255, 255, 0.24);
    }
    tr:nth-child(odd) {
      background: rgba(255, 255, 255, 0.06);
    }

    .ant-input {
      background-color: #000000;
      color: #fff;
      border: 0;
      height: 32rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
      margin: 0;
    }
    .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input,
    .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover {
      border: 3rem solid red;
      background: #000;
    }
    .ant-form-item-with-help .ant-form-item-explain {
      display: none;
    }
    .ant-pagination {
      margin-top: 20rem !important;
    }
    .ant-table-pagination.ant-pagination {
      justify-content: center;

      li {
        height: 40rem !important;
        font-family: AlibabaPuHuiTiR !important;
        line-height: 40rem !important;
      }
    }
    ._list {
      width: 100%;
      .ant-table-cell {
        font-size: 18rem;
        font-family: AlibabaPuHuiTiM;
      }
    }
  }
  .ant-radio-button-wrapper {
    margin-right: 16rem;
    background: linear-gradient(
      180deg,
      rgba(113, 123, 132, 0.3) 0%,
      rgba(61, 69, 77, 0.3) 100%
    );
    border: 1rem solid #93b6e6 !important;
    span {
      color: #fff !important;
    }
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    span {
      color: #fff !important;
    }
    background: linear-gradient(270deg, #0098d6 0%, #0b4863 100%);
  }
  .ant-radio-button-wrapper > .ant-radio-button span {
    color: #fff !important;
  }
  ._operation {
    display: flex;
    justify-content: flex-end;

    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before,
    .ant-radio-button-wrapper:not(:first-child)::before {
      content: none !important;
    }
    button {
      width: 70rem;
      margin: 0 5rem;
      padding: 0;
    }
    .ant-radio-group {
      display: flex;
    }
    .ant-radio-button-wrapper:active {
      box-shadow: unset !important;
    }

    .ant-radio-button-wrapper {
      width: 78rem;
      height: 36rem;
      text-align: center;
      line-height: 36rem;
      padding: 0;
      transition: all 200ms;
      font-family: AlibabaPuHuiTiM;
      font-size: 16rem;
    }
  }
  .operation-outer {
    border-top: 2px solid rgba(57, 206, 255, 0.2);
    background: #081b23;
    border-radius: 8rem;
    width: 100%;
    padding: 12rem 20rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    bottom: 0;
    .download-btn {
      width: 78rem;
      height: 36rem;
      background-image: url(${IMG_PATH.buttonBg3});
      background-size: 100%;
      background-repeat: no-repeat;
      font-family: WeiRuanYaHeii;
      font-weight: bold;
      font-size: 16rem;
      color: #e9f6ff;
      line-height: 36rem;
      text-align: center;
      font-style: normal;
      cursor: pointer;
      transition: all 200ms;
    }
  }
  .ant-form-item {
    margin: 0 !important;
  }
  .ant-form-item-explain-error {
    font-size: 14rem;
    position: absolute;
  }
`;

export { CusModalWrapper };
