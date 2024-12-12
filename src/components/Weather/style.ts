/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import styled from 'styled-components';
export const Wrapper = styled.div`
  width: 420rem;
  min-height: 368rem;
  .weather-content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10rem;
    min-height: 478rem;
    .header-desc-outer {
      width: 100%;
      height: 120rem;
      padding: 0 10rem;
      display: flex;
      justify-content: space-between;
      p {
        font-family: AlibabaPuHuiTiR;
        font-size: 16rem;
      }
      .header-desc_left {
        width: 40%;
        padding: 10rem 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
      }
      .header-desc_center {
        width: 30%;
      }
      .header-desc_right {
        width: 40%;
        padding: 10rem 0;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-end;
      }
    }
    .divider-custom {
      width: 100%;
      margin: 0;
      background-color: #798392;
      height: 1rem;
    }
    .content-outer {
      height: calc(100% - 30rem);
      .title {
        width: 100%;
        color: #fff;
        font-size: 14rem;
        padding: 10rem 0;
        font-family: AlibabaPuHuiTiR;
      }
      .chart-outer {
        position: relative;
        z-index: 10;
      }
    }
    .week-outer {
      padding-top: 20rem;
    }
    .list-outer {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 10rem;
      .list-item {
        width: 13.5%;
        text-align: center;
        font-family: AlibabaPuHuiTiR;
        font-size: 16rem;
        color: #ffffff;
        text-align: center;
        overflow: hidden;
        display: flex;
        justify-content: center;
      }
      .date {
        font-size: 13rem;
        line-height: 13rem;
      }
      .timer {
        font-size: 15rem;
      }
      img {
        width: 35rem;
        height: 35rem;
      }
    }
    .dateList {
      margin-bottom: 0 !important;
    }
    .echarts-slider .ec-slider-handle {
      pointer-events: none; /* 禁用手柄的交互 */
      opacity: 0.5; /* 可以设置手柄透明度来显示其被禁用 */
    }

    .echartHandle {
      z-index: 1;
      position: absolute;
      margin-top: -30rem;
      width: 400rem;
    }
  }
`;
