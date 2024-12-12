import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';
const YYFPLeftWrapper = styled.div<{
  isHighWaterLevel: boolean;
  isActivePanel: boolean;
}>`
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
  .cus-btn-outer {
    display: flex;
    justify-content: flex-start;
    margin-top: 10rem;
    div {
      margin-right: 15rem;
    }
    margin-bottom: 20rem;
  }
  .show-queue-list-btn {
    display: flex;
    align-items: center;
    font-size: 14rem;
    color: #fff;
    padding: 5rem 10rem;
    border-radius: 2rem;
    cursor: pointer;
    background: #2c51b3;
  }
  .show-rain-process-btn {
    font-size: 14rem;
    display: flex;
    align-items: center;
    color: #fff;
    padding: 5rem 10rem;
    border-radius: 2rem;
    cursor: pointer;
    background: #2c51b3;
  }
  .water-line-outer {
    margin-bottom: 10rem;
  }
  .ant-collapse-content-box {
    padding: 0 !important;
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    width: 360rem !important;
    height: 46rem !important;
    background: linear-gradient(
      180deg,
      rgba(0, 5, 17, 0.5) 0%,
      #282c35 100%
    ) !important;
    border: 1rem solid #979797;
    padding: 0 20rem;
    font-size: 20rem;
    /* font-size: ${props => (props.isActivePanel ? '24rem' : '20rem')}; */
    /* line-height: ${props => (props.isActivePanel ? '' : '36rem')}; */
    line-height: 36rem;
    font-family: AlibabaPuHuiTiP;
    color: #ffffff !important;
  }
  /* 水位线选择样式修正 */
  .water-line-select {
    .water-line-select-content {
      width: 360rem;
      height: 272rem;
      border: 1rem solid #979797;
      border-top: 0;
      position: relative;
      div {
        font-size: 14rem;
        font-family: AlibabaPuHuiTiR;
        white-space: nowrap;
        color: #ffffff;
      }
      div:nth-child(2) {
        font-family: DIN-BlackItalic;
        font-size: 16rem;
      }
      .form-outer {
        .ant-checkbox-wrapper + .ant-checkbox-wrapper,
        .ant-checkbox-wrapper {
          margin-left: unset;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row-reverse;
        }
        .ant-checkbox-disabled .ant-checkbox-inner {
          background-color: #e3e0e050;
          border: 1rem solid #e3e0e050 !important;
        }
        .ant-checkbox-wrapper.ant-checkbox-wrapper-disabled {
          div {
            color: #e3e0e050 !important;
          }
        }
        .ant-checkbox {
          top: unset;
        }
        .ant-checkbox-inner {
          background-color: rgba(1, 1, 1, 0);
        }
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: rgba(1, 1, 1, 0);
          border: 1rem solid #ffffff;
        }
        position: absolute;
        right: 20rem;
        top: 15rem;
        width: 180rem;
        height: 190rem;
      }
      img {
        width: 100%;
      }
    }
  }
  /* 千岛湖实时水位展示 */
  .water-line {
    color: #ffffff;
    line-height: 39rem;
    margin-top: 10rem;
    p {
      font-family: AlibabaPuHuiTiM;
      font-size: 24rem;
    }
    span {
      font-family: DIN-BlackItalic;
      font-size: 32rem;
    }
    .desc {
      font-size: 20rem;
    }
  }
  /* 表单样式 */
  .form-item-outer {
    /* 表单title */
    .form-item_title {
      font-family: AlibabaPuHuiTiM;
      font-size: 20rem;
      color: #ffffff;
    }
    /* 表单select选择样式 */
    .form-item_content {
      .ant-radio-button-wrapper {
        padding: 0 !important;
      }
      .ant-form-item {
        margin: 0;
      }
      div {
        transition: all 1000ms;
      }
      .one {
        width: 100%;
        .ant-radio-button-checked {
          background-image: url(${IMG_PATH.selectedBg1}) !important;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
      .two {
        width: calc(50% - 4rem);
        .ant-radio-button-checked {
          background-image: url(${IMG_PATH.selectedBg2}) !important;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
      .three {
        width: 33%;
        overflow: hidden;
        .ant-radio-button-checked {
          background-image: url(${IMG_PATH.selectedBg3}) !important;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
      .five {
        width: 20%;
        padding: 0 !important;
        .ant-radio-button-checked {
          background-image: url(${IMG_PATH.selectedBg5}) !important;
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }
      .ant-radio-group {
        width: 100%;
      }
      .ant-radio-button-wrapper {
        margin: 5rem 0;
        height: 40rem;
        line-height: 40rem;
        text-align: center;
        font-family: AlibabaPuHuiTiR;
        font-size: 18rem;
        color: #ffffff;
        text-align: center;
        background: rgba(149, 174, 255, 0.28);
        border-radius: 0rem 2rem 2rem 0rem;
        border: 0 !important;
      }
      .ant-radio-button-wrapper:not(:first-child)::before {
        width: 0rem !important;
      }
      .ant-radio-button-wrapper-checked {
        border: 0 !important;
      }
    }
  }

  .rehearsalTime-desc-outer {
    font-size: 18rem;
    font-family: AlibabaPuHuiTiP;
    color: #ffffff;
    line-height: 27rem;
    p {
      margin: 5rem 0 !important;
      span {
        font-size: 32rem;
        font-family: DIN-BlackItalic;
      }
    }
  }
  /* 自定义降雨动态表单 */
  .from-list-outer {
    margin-top: 5rem;
    /* 添加按钮 */
    .operation-add-item {
      width: 360rem;
      height: 48rem;
      background: linear-gradient(180deg, rgba(0, 5, 17, 0.5) 0%, #282c35 100%);
      border-radius: 7rem;
      border: 1rem solid #ffffff;
      span {
        color: #ffffff;
        font-size: 24rem;
      }
    }
    .form-list-operation-outer {
      height: ${props => {
        return !props.isHighWaterLevel
          ? '450rem'
          : props.isActivePanel
          ? '56rem'
          : '390rem';
      }};
      overflow-y: scroll;
    }
    .ant-form-item {
      position: relative;
      margin-bottom: 10rem;
      .ant-form-item-label > label {
        min-width: 140rem;
        font-size: 20rem;
        font-family: AlibabaPuHuiTiP;
        color: #ffffff;
        line-height: 27rem;
      }
      .ant-space-item {
        span {
          color: #ffffff;
          font-size: 24rem;
        }
      }
      .ant-input-number {
        width: 165rem;
        background: linear-gradient(
          180deg,
          rgba(0, 5, 17, 0.5) 0%,
          #282c35 100%
        );
        border: 1px solid #979797;
        font-size: 20rem;
        font-family: DIN-BlackItalic;
        color: #ffffff;
      }
      .ant-input-number-handler-wrap {
        background-color: rgba(1, 1, 1, 0);
        span {
          border: 0;
          font-size: 20rem;
          color: #ffffff;
        }
        span:active {
          background-color: unset;
          color: #2c51b3;
        }
      }
      .ant-input-number-handler-wrap:hover {
      }
    }
    .minusSquareOut-icon {
      color: #ffffff;
      font-size: 26rem;
    }
    .form-list-item-unit {
      position: absolute;
      right: 50rem;
      top: 3rem;
      font-size: 20rem;
      font-family: DIN-BlackItalic, DIN;
      color: #ffffff;
    }
  }
  /* 自定义降雨总的描述 */
  .cus-rainfall-counter {
    margin-top: 10rem;
    font-size: 18rem;
    font-family: AlibabaPuHuiTiP;
    color: #ffffff;
    line-height: 27rem;
    strong {
      font-size: 30rem;
      font-family: DIN-BlackItalic;
    }
    a {
      font-size: 10rem;
      float: right;
    }
  }

  .operation-outer {
    position: relative;
    padding: 20rem;
    height: 818rem;
    font-family: AlibabaPuHuiTiM;
    .ant-collapse-content-box {
      padding: 0;
    }

    .high-water-line {
      height: 30rem;
      display: flex;
      align-items: center;
      font-family: AlibabaPuHuiTiM;
      font-size: 20rem;
      color: #ffffff;
    }
    .select-content {
    }
    .btn-like {
      height: 40rem;
      text-align: center;
      line-height: 40rem;
      background-image: linear-gradient(
        180deg,
        rgba(0, 5, 17, 0.5) 0%,
        #282c35 100%
      );
      border: 1rem solid rgba(151, 151, 151, 1);
      border-radius: 20rem;
      font-family: AlibabaPuHuiTiM;
      font-size: 18rem;
      color: #ffffff;
      margin-bottom: 10rem;
    }
    .operation-btn {
      position: absolute;
      bottom: 20rem;
      width: calc(100% - 40rem);
      height: 40rem;
      text-align: center;
      cursor: pointer;
      background-image: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
      border: 1px solid rgba(147, 182, 230, 1);
      border-radius: 4rem;
      font-family: AlibabaPuHuiTiM;
      font-size: 20rem;
      color: #333333;
      text-align: center;
    }
    .divider {
      width: 100%;
      height: 1rem;
      border-top: 0;
      border-left: 0;
      border-right: 0;
      margin: 10rem 0;
    }
  }
`;
export { YYFPLeftWrapper };
