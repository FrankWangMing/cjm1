import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';
const HLYBLeftWrapper = styled.div`
  /* 预见期选择 */
  .forecast-period-outer {
    width: 420rem;
    height: 128rem;
    margin: 20rem 0;
    /* 预见期选择的内容部分 */
    .forecast-period-content {
      width: inherit;
      height: 92rem;
      /* height: 140rem; */
      background-image: linear-gradient(
        180deg,
        rgba(0, 13, 17, 0.45) 0%,
        rgba(40, 49, 53, 0.9) 100%
      );
      border-radius: 0rem 0rem 4rem 4rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .ant-form-item {
        margin: 0;
      }
      /* 选择list */
      .radio-list {
        .radio-item-outer {
          display: contents;
        }
        .ant-radio-wrapper {
          margin: 0 !important;
        }
        .splice-line {
          background: rgba(255, 255, 255, 0.24);
          border-radius: 2rem;
          width: 48rem;
          height: 2rem;
          margin: 0 6rem;
        }
      }
      /* labelList */
      .label-list {
        margin-top: 8rem;
        width: 100%;
        height: 30rem;
        display: flex;
        justify-content: space-between;
        span {
          font-family: AlibabaPuHuiTiR;
          font-size: 20rem;
          color: #ffffff;
          display: inline-block;
          cursor: pointer;
        }
      }
    }
    .ant-tooltip-inner,
    .ant-tooltip-arrow-content::before {
      background: rgba(44, 81, 179, 0.6);
      box-shadow: 0rem 2rem 2rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 2rem;
      font-family: AlibabaPuHuiTiM;
      color: #ffffff;
      line-height: 17rem;
      text-shadow: 0rem 2rem 2rem rgba(0, 0, 0, 0.2);
    }
    /* 预见期选择 - 回溯 */
    .forecast-period-operation {
      position: absolute;
      right: 20rem;
      padding: 5rem;
      font-size: 25rem;
      background: rgba(44, 81, 179, 0.6);
      box-shadow: 0rem 2rem 2rem 0rem rgba(0, 0, 0, 0.2);
      border-radius: 2rem;
      cursor: pointer;
    }

    .forecast-timePicker {
      width: 120rem;
      margin-left: 20rem;
      .ant-select-selector {
        background: rgba(1, 1, 1, 0);
        color: #fff;
      }
      .ant-select-arrow {
        color: #fff;
      }
    }
    .forecast-confirm-outer {
      width: 100%;
      margin-top: 20rem;
      display: flex;
      justify-content: flex-end;
      padding: 0 20rem;
      .btn {
        width: 60rem;
        height: 32rem;
        background: linear-gradient(180deg, #eef3fb 0%, #d9e4f5 100%);
        border-radius: 2rem;
        border: 1rem solid #93b6e6;
        font-size: 16rem;
        font-family: AlibabaPuHuiTiM;
        color: #989595;
        line-height: 22rem;
        text-align: center;
        line-height: 32rem;
        cursor: pointer;
      }
      .btn:nth-child(2) {
        background: linear-gradient(180deg, #5789da 0%, #2c51b3 100%);
        color: #ffffff;
        margin-left: 10rem;
      }
    }
  }
  /* 全域淹没面积 */
  .core-area-outer {
    width: 100%;
    height: 240rem;
    position: relative;
  }
  .core-area-desc {
    position: absolute;
    bottom: 20rem;
    left: 20rem;
    height: 150rem;
    min-width: 100rem;
    h1 {
      font-family: AlibabaPuHuiTiM;
      font-size: 14rem;
      color: #ffffff;
      text-align: left;
      line-height: 29rem;
    }
    span {
      font-family: DIN-BlackItalic;
      font-size: 20rem;
    }
  }
  .core-area-content {
    padding: 10rem;
    height: 210rem;
    img {
      width: 256rem;
      height: 184rem;
      position: absolute;
      right: 20rem;
    }
  }

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

  /* 右边 */
  .right-outer {
    width: 420rem;
    height: 100%;
    /* height: 868rem; */
    .right-content {
      width: inherit;
      height: calc(100% - 60rem);
      /* height: 820rem; */
      background-image: linear-gradient(
        180deg,
        rgba(0, 13, 17, 0.45) 0%,
        rgba(40, 49, 53, 0.9) 100%
      );
      border-radius: 0rem 0rem 4rem 4rem;
      color: #fff;
    }
  }
`;

export { HLYBLeftWrapper };
