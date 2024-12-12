import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';
const SLYZTWrapper = styled.div`
  width: 420rem;
  /* 实时警情 */
  .realtime-alarm {
    margin-bottom: 10rem;
    height: 168rem;
    .realtime-alarm-content {
      height: 120rem;
      border-radius: 0px 0px 4rem 4rem;
      display: flex;
      align-items: center;
      .alarm-item {
        cursor: pointer;
        width: 33%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        margin-top: -5rem;
        p {
          text-align: center;
          font-family: AlibabaPuHuiTiM;
          font-size: 18rem;
          color: #ffffff;
          margin-bottom: 15rem;
          line-height: 48rem;
          span {
            font-size: 48rem;
            text-align: right;
            margin-right: 10rem;
          }
        }
        p:nth-last-child(1) {
          margin: 0;
          line-height: 20rem;
        }
        position: relative;
        .selected-item {
          width: 70%;
          height: 9rem;
          position: absolute;
          bottom: 5rem;
          background: linear-gradient(
            180deg,
            rgba(255, 77, 86, 0) 0%,
            rgba(255, 77, 86, 0.5) 100%
          );
        }
      }
      .alarm-item_selected {
        p,
        span {
          color: #ff5e5e !important;
        }
      }
    }
  }
  /* 雨情统计 */
  .rainfall-static {
    height: 481rem;
    margin-bottom: 10rem;
    .rainfall-static-content {
      height: 433rem;
      border-radius: 0px 0px 4rem 4rem;
      padding: 20rem;
      padding-top: 0;
      .rainfall-static-desc {
        font-family: AlibabaPuHuiTiM;
        font-size: 20rem;
        color: #ffffff;
        span {
          font-size: 32rem;
        }
      }
      .table-outer {
        width: 360rem;
        height: 310rem;
        position: relative;
      }
    }
  }
  .video-monitor {
    height: 300rem;
    .video-monitor-content {
      height: 253rem;
      border-radius: 0px 0px 4rem 4rem;
      padding: 10rem 20rem;
      p {
        font-family: AlibabaPuHuiTiM;
        font-size: 16rem;
        line-height: 22rem;
        color: #ffffff;
      }
      img {
        margin-top: 10rem;
        width: 100%;
      }
      .view-all-btn {
        cursor: pointer;
        min-width: 100rem;
        height: 30rem;
        background: rgba(53, 100, 226, 0.15);
        border-radius: 6rem;
        border: 1rem solid #3564e2;
        width: 63px;
        font-size: 16rem;
        font-family: AlibabaPuHuiTiR;
        color: #ffffff;
      }
      .cus-carousel-outer {
        position: relative;
        height: calc(100% - 20rem);
        .cur-carousel-operation {
          position: absolute;
          top: 10rem;
          width: 30rem;
          cursor: pointer;
          height: inherit;
          font-size: 25rem;
        }
        .cur-carousel-operation-left {
          left: 0rem;
        }
        .cur-carousel-operation-right {
          right: 0rem;
        }
        img {
          width: 100%;
          height: 190rem;
        }
      }
    }
  }
  .hydrologic-statistics {
    height: 970rem;
    .hydrologic-statistics-content {
      height: 922rem;
      padding: 10rem 20rem;
      /* 千岛湖水位 */
      .water-level {
        font-family: AlibabaPuHuiTiM;
        font-size: 24rem;
        color: #ffffff;
        line-height: 39rem;
        span {
          font-family: DIN-BlackItalic;
          font-size: 32rem;
          line-height: 39rem;
        }
      }
      /* 水库相关 */
      .reservoir-outer {
        height: 314rem;
        .reservoir-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: AlibabaPuHuiTiM;
          font-size: 20rem;
          line-height: 27rem;
          color: #ffffff;
          .ant-badge {
            font-family: AlibabaPuHuiTiM;
            font-size: 24rem;
            color: #ffffff;
          }
          .ant-select-selector {
            width: 120rem;
            height: 38rem;
            display: flex;
            align-items: center;
            font-family: AlibabaPuHuiTiM;
            font-size: 18rem;
            color: #ffffff;
            background-color: rgba(1, 1, 1, 0);
            border: 1px solid rgba(151, 151, 151, 1);
            border-bottom: 0;
          }
          .ant-select-arrow {
            font-size: 25rem;
            color: #ffffff;
          }
        }
        .reservoir-content {
          height: 270rem;
          .content-top {
            text-align: center;
            height: 46rem;
            line-height: 46rem;
            /* padding: 0 5rem; */
            overflow: hidden;
            background-image: linear-gradient(
              180deg,
              rgba(0, 5, 17, 0.5) 0%,
              #282c35 100%
            );
            border: 1px solid rgba(151, 151, 151, 1);
            border-bottom: 0;
            font-family: AlibabaPuHuiTiM;
            font-size: 18rem;
            color: #ffffff;
            div {
              width: 20rem;
              display: inline-flex;
            }
            span {
              font-family: DIN-BlackItalic;
              font-size: 18rem;
              margin-left: 10rem;
            }
          }
          .content-bottom {
            height: 224rem;
            background-image: linear-gradient(
              180deg,
              rgba(0, 5, 17, 0.5) 0%,
              #282c35 100%
            );
            border: 1px solid rgba(151, 151, 151, 1);
          }
        }
      }
    }
  }

  /* 河道站 */
  .river-road-outer {
    width: 360rem;
    height: 420rem;
  }

  .SLYZT-title {
    width: 100%;
    height: 40rem;
    background: #2c51b3;
    border: 1px solid rgba(61, 70, 92, 1);
    border-radius: 24rem;
    margin: 10rem 0;
    line-height: 40rem;
    font-family: AlibabaPuHuiTiM;
    font-size: 24rem;
    color: #ffffff;
    text-align: center;
    z-index: 999;
  }
  .SLYZT-modal-charts-outer {
    width: 100%;
    height: 500rem;
  }
  /* 弹窗头部的标题栏目 */
  .SLYZT-modal-title-desc-outer {
    display: flex;
    align-items: center;
    font-family: AlibabaPuHuiTiM;
    font-size: 24rem;
    color: #ffffff;
  }
  .SLYZT-modal-title-desc {
    width: 220rem;
    height: 36rem;
    background: #2c51b3;
    border: 1px solid rgba(61, 70, 92, 1);
    border-radius: 24rem;
    text-align: center;
    line-height: 36rem;
    font-family: AlibabaPuHuiTiM;
    font-size: 20rem;
    color: #ffffff;
    margin-left: 20rem;
  }

  /* 大弹窗用来展示概化图放大版本 */
  .modal-bigger {
    width: calc(100vw - 40rem);
    position: absolute;
    top: 100rem;
    left: 20rem;
    height: 890rem;
    z-index: 999;
    img:nth-child(1) {
      width: 100%;
      height: 100%;
    }
    .modal-close-icon {
      position: absolute;
      width: 50rem;
      height: 50rem;
      top: 30rem;
      right: 30rem;
      cursor: pointer;
    }
  }
`;

const CusModalWrapper = styled.div`
  padding: 0;
  .time-operation-outer {
    width: 60%;
    display: flex;
    align-items: center;
    .ant-radio-group {
      display: flex;
      height: 30rem;
    }
    .ant-radio-wrapper {
      position: relative;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: DIN-BlackItalic, AlibabaPuHuiTiR;
      color: #fff;
      span.ant-radio + * {
        margin-top: 8rem;
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
    .lianjie-line {
      width: 64rem;
      height: 2rem;
      background: rgba(255, 255, 255, 0.24);
      border-radius: 2rem;
      position: absolute;
      top: 0rem;
    }

    .line1 {
      right: -37rem;
    }

    .line2 {
      right: -37rem;
    }

    .line3 {
      width: 52rem;
      right: -23rem;
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
    border-bottom: 1px solid #ffffff40;
    width: 100%;
    /* margin-bottom: 10rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rem;
    height: 15%;
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
    height: calc(73% - 10rem);
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    strong {
      font-size: 20px;
      color: #fff;
    }
    .ant-table,
    .ant-table-cell {
      background-color: rgba(1, 1, 1, 0);
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
      padding: 0;
      border: 0;
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
      height: 40rem;
      width: 100%;
      background: rgba(255, 255, 255, 0.08);
    }
    .ant-table-row:hover .ant-table-cell-row-hover {
      background-color: #2c51b3 !important;
    }
    tr:nth-child(odd) {
      background: rgba(201, 214, 255, 0.24);
    }
    .ant-table-thead {
      background: rgba(149, 174, 255, 0.28);
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
    table {
      border-spacing: 0 10rem !important;
    }
    .ant-table-pagination.ant-pagination {
      justify-content: center;
      margin: 0 !important;

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
    background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
    border: unset !important;
    span {
      color: #333 !important;
    }
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    span {
      color: #fff !important;
    }
    background: linear-gradient(180deg, #5789da 0%, #2c51b3 100%);
  }
  .ant-radio-button-wrapper > .ant-radio-button span {
    color: black !important;
  }
  ._operation {
    width: 20%;
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
      width: 145rem;
      height: 32rem;
      display: flex;
    }
    .ant-radio-button-wrapper:active {
      box-shadow: unset !important;
    }

    .ant-radio-button-wrapper {
      width: 62rem;
      height: 32rem;
      text-align: center;
      line-height: 32rem;
      padding: 0;
      transition: all 200ms;
      font-family: AlibabaPuHuiTiM;
      font-size: 16rem;
    }
  }
  .operation-outer {
    width: 100%;
    padding: 12rem 20rem;
    background: linear-gradient(
      180deg,
      rgba(37, 56, 96, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    border-radius: 4rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    bottom: 0;
    .download-btn {
      width: 80rem;
      height: 40rem;
      font-size: 20rem;
      font-family: AlibabaPuHuiTiR;
      color: #333333;
      line-height: 40rem;
      background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      border-radius: 4rem;
      opacity: 0.8;
      border: 1rem solid #93b6e6;
      text-align: center;
      cursor: pointer;
      transition: all 200ms;
    }
    .download-btn:active {
      border: 2rem solid #1971c2;
    }
  }
  .ant-form-item {
    margin: 0 !important;
  }
`;

const ReservoirModalWrapper = styled.div`
  height: 500rem;
  .shuiku-table-outer {
    padding: 20rem;
  }
  .chart-title {
    font-family: AlibabaPuHuiTiM;
    font-size: 20rem;
    color: #ffffff;
    padding: 5rem 20rem;
  }
  .bar {
    width: 20rem;
    height: 3rem;
    margin-right: 10rem;
    margin-left: 40rem;
  }
  .bar-colorRain {
    background-image: linear-gradient(180deg, #daeaff 0%, #126bca 100%);
  }
  .bar-color_waterLine {
    background: #4887c2;
  }
  .bar-color_limit {
    background: #ad445e;
  }

  .chart-content-outer {
    width: 100%;
    height: 80%;
    /* margin-top: 10rem; */
    /* height: 480rem; */
  }
  div {
    font-family: AlibabaPuHuiTiM;
    font-size: 18rem;
    line-height: 32rem;
  }
  .table-tr {
    display: flex;
    align-items: center;
    margin-bottom: 10rem;
    height: 40rem;
    line-height: 40rem;
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
    .table-td {
      width: 25%;
      padding: 0 20rem;
      span {
        font-family: DIN-BlackItalic;
      }
    }
  }
  .table-th {
    background: rgba(149, 174, 255, 0.28);
  }
  .ant-carousel .slick-dots-bottom {
    bottom: -40rem;
  }
  .switch-operation-outer {
    position: absolute;
    color: #fff;
    bottom: 0;
    left: 20rem;
    width: calc(100% - 40rem);
    height: 32rem;
    display: flex;
    justify-content: space-between;
    .switch-operation-item {
      min-width: 130rem;
      padding: 0 10rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-image: url(${IMG_PATH.layout.center.bottomTab});
      background-repeat: no-repeat;
      background-size: 100%;
      font-size: 18rem;
      font-family: AlibabaPuHuiTiM;
    }
    .switch-operation-item_active {
      background-image: url(${IMG_PATH.layout.center.bottomTabSelected});
    }
    .download-btn {
      margin-bottom: 10rem;
      width: 60rem;
      height: 30rem;
      font-size: 18rem;
      font-family: AlibabaPuHuiTiR;
      color: #333333;
      line-height: 30rem;
      background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      border-radius: 4rem;
      opacity: 0.8;
      border: 1rem solid #93b6e6;
      text-align: center;
      cursor: pointer;
      transition: all 200ms;
    }
    .download-btn:active {
      border: 2rem solid #1971c2;
    }
  }
  .ant-radio-button-wrapper {
    background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
    border: unset !important;
    span {
      color: #333 !important;
    }
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    span {
      color: #fff !important;
    }
    background: linear-gradient(180deg, #5789da 0%, #2c51b3 100%);
  }
  .ant-radio-button-wrapper > .ant-radio-button span {
    color: black !important;
  }
  .ant-pagination .ant-pagination-options-quick-jumper input,
  .ant-pagination
    .ant-select:not(.ant-select-customize-input)
    .ant-select-selector,
  .ant-pagination .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination .ant-pagination-next .ant-pagination-item-link {
    height: 37rem;
  }
`;

const PondsModalWrapper = styled.div`
  padding: 10rem 20rem;
  width: 500rem;
  height: 220rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  .side-outer {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  div {
    width: 50%;
  }
  p {
    font-family: AlibabaPuHuiTiM;
    font-size: 20rem;
    color: #ffffff;
    line-height: 50rem;
  }
`;

const EmbankmentModalWrapper = styled.div`
  padding: 0rem 20rem;
  font-family: AlibabaPuHuiTiM;
  font-size: 20rem;
  color: #ffffff;
  line-height: 44rem;
`;
const VillageModalWrapper = styled.div`
  padding: 0rem 20rem;
  font-family: AlibabaPuHuiTiM;
  font-size: 20rem;
  color: #ffffff;
  line-height: 44rem;
  min-height: 150rem;
`;
export {
  SLYZTWrapper,
  CusModalWrapper,
  ReservoirModalWrapper,
  PondsModalWrapper,
  EmbankmentModalWrapper,
  VillageModalWrapper
};
