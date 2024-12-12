/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import styled from 'styled-components';
export const Wrapper = styled.div`
  margin-top: 20rem;
  .video-monitor {
    height: 266rem;
    .video-monitor-content {
      height: 215rem;
      border-radius: 0px 0px 4rem 4rem;
      padding: 10rem 12rem;
      .flex-between {
        padding: 6rem 10rem;
        height: 34rem;
        position: relative;
        margin-bottom: -43rem;
        background: rgba(0, 0, 0, 0.32);
        z-index: 10;
      }
      p {
        font-weight: 500;
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
        height: 100%;
        /* height: calc(100% - 20rem); */
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
`;
