import styled from 'styled-components';
import { IMG_PATH } from './utils/const';
export const GlobalLayoutWrapper = styled.div<{
  bottomChildren: string;
}>`
  .outer {
    height: ${props =>
      props.bottomChildren ? 'calc(100vh - 212rem)' : 'calc(100vh - 130rem)'};
    position: fixed;
    z-index: 3;
    top: 90rem;
    display: flex;
    color: #fff;
  }
  .outer_left {
    margin-top: 24rem;
    left: 20rem;
  }
  .outer_right {
    margin-top: 24rem;
    right: 20rem;
  }
  .outer-center {
    z-index: 2;
    position: fixed;
    width: calc(100vw - 880rem);
    left: 440rem;
  }
  .outer-center-content {
    width: 100%;
    height: calc(100vh - 150rem);
    padding: 20rem;
    top: 150rem;
    .content-outer {
      width: 100%;
      height: 100%;
    }
  }
  .outer-center_top {
    top: 80rem;
  }
  .outer-center_bottom {
    bottom: ${props => (props.bottomChildren ? '120rem' : '20rem')};
    transition: all 500ms;
  }
  .outer-bottom {
    left: 460rem;
    width: calc(100vw - 880rem);
    z-index: 999999 !important;
    position: fixed;
    bottom: 60rem;
    max-height: 100rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: all 100ms;
  }
  /* 没有预测结果显示描述 */
  .bottom-without-result-desc {
    width: 100%;
    background-image: linear-gradient(
      180deg,
      rgba(0, 5, 17, 0.5) 0%,
      #282c35 100%
    );
    border-radius: 4rem;
    height: 80rem;
    font-family: AlibabaPuHuiTiM;
    font-size: 32rem;
    color: #ffffff;
    text-align: center;
    line-height: 80rem;
  }
  /* 装饰条 */
  .side-decorator-line {
    width: 20rem;
    height: 100%;
    z-index: 3;
    position: fixed;
  }
  .side-decorator-line_left {
    background-image: linear-gradient(to right, #2a4378, #759ac500);
    left: 0;
    top: 0;
  }
  .side-decorator-line_right {
    background-image: linear-gradient(to left, #2a4378, #759ac500);
    right: 0;
    top: 0;
  }
  .side-decorator-line_bottom {
    background-image: linear-gradient(to top, #2a4378, #759ac500);
    bottom: 0;
    width: 100%;
    height: 20rem;
  }
  .content {
    height: 100%;
    transition-timing-function: ease-in;
    --animate-delay: 2s !important;
  }

  .content_right {
    width: 420rem;
  }
  .content_left {
    /* width: ${props => (props.isOpenLeft ? '400rem' : '0')}; */
    width: 420rem;
  }
  .content_left_legend {
    border-radius: 8rem;
    position: absolute;
    bottom: 50rem;
    right: -160rem;
    /* background-image: linear-gradient(
      180deg,
      rgba(0, 5, 17, 0.5) 0%,
      #282c35 100%
    );
    padding: 10rem 20rem; */
    border-radius: 8rem;
  }
  .content-operation {
    width: 35rem;
    height: calc(100% - 10rem);
    display: flex;
    align-items: center;
    .content-decorator-line {
      margin-left: 1rem;
      width: 1rem;
      height: 100%;
    }
    img {
      /* width: 32rem; */
      height: 56rem;
    }
    .content-operation-btn {
      width: 32rem;
      height: 56rem;
      cursor: pointer;
      z-index: 99;
    }
    .sidebar-expand-operate-outer {
      position: absolute;
      right: 0rem;
      display: flex;
      height: 100%;
      align-items: center;
    }
  }
  .content-operation_right {
    right: 90rem;
  }
  .choice-forecastTime-outer {
    position: absolute;
    bottom: 430rem !important;
    width: 140rem !important;
    /* padding: 10rem 0 !important; */
    height: 120rem !important;
    right: 40rem !important;
    background-image: linear-gradient(
      180deg,
      rgba(0, 5, 17, 0.5) 0%,
      #282c35 100%
    );
    border-radius: 8rem;
  }
  .color-select-outer {
    width: 100%;
    padding-top: 20rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .ant-radio-wrapper {
      margin: 0;
      font-family: AlibabaPuHuiTiM;
      font-size: 18rem;
      color: #ffffff;
    }
    .ant-radio-inner {
      background-color: rgba(1, 1, 1, 0);
    }
    .ant-radio-inner::after {
      background-color: #fff;
    }
    .ant-radio-checked .ant-radio-inner {
      border-color: #fff;
    }
    .ant-radio-disabled + span {
      color: #c3c3c3;
    }
  }

  /* 左右两个仿抽屉--不删除DOM */
  .transform-x_time {
    transition: all 200ms;
    transition-timing-function: linear;
  }
  .transform_in {
    transform: translateX(0);
  }
  .left-transform_out {
    transform: translateX(-420rem);
  }
  .left-transform_out_optBtn {
    /* transform: translateX(-400rem); */
  }
  .right-transform_out {
    transform: translateX(420rem);
  }
  .right-transform_out_optBtn {
    /* transform: translateX(400rem); */
  }

  /* 地图图层控制小组件 */
  .map-operator-outer {
    position: absolute;
    top: 0;
    left: 440rem;
    /* right: 10rem; */
    z-index: 9999;
    width: 80rem;
    height: 280rem;
    .map-operator-item {
      box-sizing: border-box;
      border: 3rem solid rgba(1, 1, 1, 0);
      position: relative;
      width: 80rem;
      height: 80rem;
      background-image: url('/images/operation-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 4rem;
      margin-bottom: 20rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .compass {
        width: 40rem;
        height: 40rem;
        position: absolute;
        bottom: 30rem;
        transition: all 200ms;
      }
      .pointer-to-the-north {
        width: 40rem;
        height: 40rem;
        margin-top: -20rem;
      }

      span {
        font-family: AlibabaPuHuiTiB;
        font-size: 14rem;
        color: #ffffff;
        text-align: center;
        position: absolute;
        bottom: 6rem;
        width: 100%;
        text-align: center;
      }
    }
    .map-operator-item:hover {
      border: 3rem solid #73beff;
    }
    .map-operator-item:nth-last-child(1) {
      margin: 0;
    }
  }

  /* 底部tab选中样式 */
  /* 中间底部 */
  .center-bottom-outer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .center-bottom-item {
      min-width: 189rem;
      padding: 0 10rem !important;
      height: 40rem;
      line-height: 35rem;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      background-image: url(${IMG_PATH.layout.center.bottomTab});
      background-repeat: no-repeat;
      background-size: 100%;
      font-family: DOUYUFont;
      font-size: 16rem;
      /* font-family: AlibabaPuHuiTiM;
      font-size: 20rem; */
      color: #ffffff;
      transition: all 300ms;
      cursor: pointer;
    }
    .center-bottom-item_active {
      background-image: url(${IMG_PATH.layout.center.bottomTabSelected});
    }
  }
  /* 中间区域内容--主要是弹窗 */
  .center-outer {
    z-index: 9999;
    background: #081b23;
    border-radius: 8rem;
    border: 1px solid rgba(57, 206, 255, 1);
    /* 弹窗表头 */
    .center-modal-header {
      background: #1c395f;
      border-bottom: 1px solid rgba(57, 206, 255, 1);
      border-radius: 8rem 8rem 0rem 0rem;

      position: relative;
      height: 54rem;
      font-family: WeiRuanYaHei;
      font-weight: bold;
      font-size: 20rem;
      letter-spacing: 2px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rem;
      img {
        cursor: pointer;
      }
      .border-bottom-line {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1rem;
        background-image: linear-gradient(
          270deg,
          #173479 0%,
          #90abee 51%,
          #173479 100%
        );
        z-index: 999;
      }
    }
    /* 弹窗内容 */
    .center-modal-content {
      min-height: 100rem;
      position: relative;
      transition: all 5 00ms;
    }
  }
  .center-outer-modal_large {
    width: 874rem;
    /* min-height: 600rem; */
    position: absolute;
    top: 240rem;
    left: calc(50vw - 437rem);
  }
  .center-outer-modal_middle {
    width: 480rem;
    /* min-height: 324rem; */
    position: absolute;
    top: 355rem;
    right: 624rem;
  }
  .center-outer-modal_small {
    width: 400rem;
    height: 330rem;
    position: absolute;
    top: 355rem;
    right: 624rem;
  }
  /* 中间内容区域 --  */
  .center-content {
    z-index: 1;
    background-color: red;
  }
`;
