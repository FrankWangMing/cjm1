/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 预警发布 - 预警通知
 */
import styled from 'styled-components';
export const AlarmConfirmWrapper = styled.div`
  .alarm-outer {
    width: 100%;
  }
  .ant-input {
    width: 100% !important;
  }
  /* 预警通知时段 */
  .header-outer {
    display: flex;
    align-items: center;
    padding: 0 20rem;
    width: inherit;
    height: 80rem;
    background-color: #ffffff;
    .select-outer {
      width: 200rem;
      margin-right: 20rem;
    }
    strong {
      font-size: 24rem;
      margin: 0 6rem;
    }
  }
  /* 内容区域 */
  .content-outer {
    width: 100%;
    height: 480rem;
    display: flex;
    margin: 20rem 0;
    padding: 0 20rem;
    .ant-radio-group {
      width: 80%;
    }
    /* 风险等级 */
    .risk-list-outer {
      width: 10%;
      height: inherit;
      background: #ffffff;
      /* padding: 0 15rem; */
      display: flex;
      justify-content: center;
      .risk-item {
        width: 100%;
        height: 159rem;
        padding: 20rem 0;
        cursor: pointer;
        span {
          font-family: Mont-HeavyDEMO;
          font-size: 36rem;
          color: #333333;
          letter-spacing: 1rem;
          text-align: center;
        }
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .bottom {
          display: flex;
          justify-content: center;
          margin-top: 20rem;
          margin-left: 5rem;
          span {
            font-family: PingFangSC-Semibold;
            font-size: 20rem;
            color: #333333;
          }
        }
      }
      .ant-divider-horizontal {
        margin: 0;
        height: 1rem;
        background: #d9d9d9;
      }
    }
    /* 内容区域公用的内容样式 */
    .content {
      padding: 10rem;
      background: #f6f8fa;
      border-radius: 2rem;
      width: 100%;
      height: 215rem;
    }
    /* 防汛责任人 */
    .people-list {
      width: 25%;
      height: inherit;
      margin: 0 20rem;
      .ant-tree {
        background-color: rgba(0, 0, 0, 0);
        span {
          font-size: 16rem;
          line-height: 22rem;
        }
      }
      .ant-tree .ant-tree-treenode {
        padding: 9rem 0;
      }
      .content {
        position: relative;
        overflow-y: scroll;
        .loading {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          color: #4371fb;
          font-size: 30rem;
          height: 100%;
        }
      }
    }
    /* 已选接收人 */
    .people-selected-outer {
      width: 65%;
      height: inherit;
      letter-spacing: 0;
      .content {
        padding: 10rem 20rem;
        position: relative !important;
        .loading {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: inherit;
          color: #4371fb;
          font-size: 30rem;
          height: 100%;
        }
      }
    }
  }
  /* 信息模板 */
  .message-outer {
    width: calc(100% - 41rem);
    height: 280rem;
    margin: 20rem;
    .content {
      height: 188rem;
      padding: 10rem 20rem;
      background-color: #f6f8fa;
      letter-spacing: 0;
      line-height: 32rem;
      textarea.ant-input {
        height: 100% !important;
      }
    }
    .operation {
      height: 52rem;
      padding: 0 20rem;
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  /* header对应的公用样式 */
  .header {
    width: 100%;
    height: 40rem;
    background: #ffffff;
    box-shadow: inset 0rem -1rem 0rem 0rem rgba(232, 232, 232, 1);
    border-radius: 2rem 2rem 0rem 0rem;
    display: flex;
    align-items: center;
    padding: 0 10rem;
    letter-spacing: 0;
  }
  /* 按钮公用样式 */
  .btn {
    background-image: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
    border: 1rem solid rgba(147, 182, 230, 1);
    border-radius: 4rem;
    width: 120rem;
    height: 32rem;
    font-size: 18rem;
    line-height: 22rem;
  }
  .btn:disabled {
    color: grey;
  }

  /* 字体设置公用样式 */
  .font-set {
    font-family: AlibabaPuHuiTiR;
    font-size: 18rem;
    color: #333333;
    letter-spacing: 0;
  }
`;

// 信息联动wrapper
export const MessageLinkageWrapper = styled.div`
  .header {
    width: 100%;
    height: 80rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 20rem;
    .ant-form-item-label > label {
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #333333;
      letter-spacing: 0;
    }
    .ant-form-item-label {
      display: flex;
      align-items: center;
    }
    .ant-picker-input > input {
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #333333;
      letter-spacing: 0;
      line-height: 40rem;
    }

    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
      width: 224rem !important;
      height: 40rem !important;
    }
    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
      width: 224rem !important;
      height: 40rem !important;
    }
    .ant-picker,
    .ant-select-selector {
      width: 224rem !important;
      height: 40rem !important;
      span {
        font-family: AlibabaPuHuiTiR;
        font-size: 18rem;
        color: #333333;
        letter-spacing: 0;
        line-height: 40rem;
      }
    }
    .btn {
      min-width: 80rem;
      height: 40rem;
    }
  }
  .msgLink-content-outer {
    width: inherit;
    scroll-behavior: smooth;
    background-color: #ccd7eb;
    height: calc(100vh - 270rem);
    padding: 20rem;
    padding-bottom: 0;
    overflow-y: overlay;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      /*整体样式*/
      width: 5rem;
    }
    ::-webkit-scrollbar-thumb {
      /*滚动条小方块*/
      border-radius: 10rem;
      background: rgba(154, 167, 186, 0.8);
      border-radius: 3rem;
    }
  }
  .content-item {
    width: calc(100vw - 80rem);
    height: 374rem;
    margin-bottom: 20rem;
    transition: all;
    transition-duration: 2000ms;
  }
  .content-item-header {
    height: 86rem;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 20rem;
    img {
      margin-right: 20rem;
    }
    div {
      font-family: PingFangSC-Semibold;
      font-size: 20rem;
      color: #333333;
      margin-right: 80rem;
    }
  }
  .content-item-content {
    height: 288rem;
    background-color: #e5e8f0;
    padding: 20rem;
    display: flex;
    .chart {
      width: 26%;
      height: 248rem;
      padding: 0 20rem;
    }
    .right-outer {
      width: 74%;
      height: 248rem;
      .right-item {
        width: 100%;
        height: 114rem;
        background: rgba(246, 248, 250, 0.6);
        border-radius: 2rem 2rem 0rem 0rem;
        display: flex;
        position: relative;
        .cornor {
          width: 6rem;
          height: inherit;
          background-image: linear-gradient(
            270deg,
            rgba(5, 58, 180, 0.8) 0%,
            rgba(43, 117, 210, 0.8) 100%
          );
        }
        .content {
          width: calc(100% - 6rem);
          height: inherit;
          padding: 20rem;
          padding-left: 14rem;
          .span {
            font-family: AlibabaPuHuiTiR;
            font-size: 18rem;
            color: #333333;
            letter-spacing: 0;
          }
          .list-outer {
            color: #333333;
            width: 100%;
            height: 36rem;
            display: flex;
            align-items: center;
          }
          .list-item {
            min-width: 200rem;
            margin-right: 80rem;
            display: flex;
            align-items: center;
            .order-outer {
              width: 36rem;
              height: 36rem;
              margin-right: 10rem;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                width: inherit;
                height: inherit;
              }
              span {
                display: inline-block;
                position: absolute;
                color: #fff;
              }
            }
          }
          .list-item:nth-last-child(1) {
            margin-right: 0;
          }
        }
        .operation {
          position: absolute;
          right: 20rem;
          top: 20rem;
          button {
            background-image: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
            border: 1px solid rgba(147, 182, 230, 1);
            border-radius: 4px;
            width: 240rem;
            height: 40rem;
          }
        }
      }
      .right-item:nth-child(1) {
        margin-bottom: 20rem;
      }
    }
  }
`;
export const FXYJWrapper = styled.div`
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
    background: #081b23;
    border-radius: 8px;
    width: 100%;
    height: 540rem;
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
`;
