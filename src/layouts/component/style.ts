/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { IMG_PATH } from '@/utils/const';
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  /* height: 94rem; */
  background-image: url(${IMG_PATH.layout.header.bgImg});
  background-repeat: no-repeat;
  background-size: 100%;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  /* z-index: 10; */
  .menu-outer {
    height: 80rem;
    display: flex;
    align-items: center;
  }
  .menu-outer_left {
    padding-left: 0rem;
    padding-top: 40rem;
  }
  .menu-outer_right {
    padding-left: 20rem;
    padding-top: 40rem;
  }
  .menu-item {
    pointer-events: auto;
    width: 160rem;
    height: 36rem;
    line-height: 36rem;
    font-family: HuXiaoBoNanShenTi;
    font-size: 20rem;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    background-image: url(${IMG_PATH.layout.header.leftTab});
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 10rem;
    cursor: pointer;
  }
  .menu-item:hover {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(${IMG_PATH.layout.header.leftTabSelected});
  }
  .menu-item_active {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(${IMG_PATH.layout.header.leftTabSelected});
  }
  .menu-item-right {
    pointer-events: auto;
    width: 160rem;
    height: 36rem;
    line-height: 36rem;
    font-family: HuXiaoBoNanShenTi;
    font-size: 20rem;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    background-image: url(${IMG_PATH.layout.header.rightTab});
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 10rem;
    cursor: pointer;
    z-index: 11;
  }
  .menu-item-right:hover {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(${IMG_PATH.layout.header.rightTabSelected});
  }
  .menu-item-right_active {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(${IMG_PATH.layout.header.rightTabSelected});
  }
  .left-avatar-outer {
    width: 316rem;
    height: 80rem;
    padding: 0 10rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 10rem;
    pointer-events: auto;
    .timer p {
      font-family: AlibabaPuHuiTiM;
      font-size: 20rem;
      /* font-size: 28rem; */
      color: #ffffff;
      letter-spacing: 0;
      line-height: 22rem;
      text-align: right;
    }
    .column {
      width: 36rem;
      margin-right: 36rem;
      h1 {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 1.17px;
        font-weight: 400;
      }
      .avatar {
        width: 36rem;
        height: 36rem;
        border-radius: 50%;
        margin-top: 18rem;
        cursor: pointer;
        transition: all 200ms;
      }
    }
  }
  .avatar-outer {
    margin-left: 50rem;
    width: 66rem;
    height: 80rem;
    pointer-events: auto;
    .column {
      height: 100%;
      h1 {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 1.17px;
        font-weight: 400;
      }
      .avatar {
        width: 36rem;
        height: 36rem;
        border-radius: 50%;
        cursor: pointer;
        transition: all 200ms;
        margin-top: 18rem;
      }
    }
  }
  .title-outer {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 14rem;
    .place-name {
      font-size: 20rem;
      font-family: HuXiaoBoNanShenTi;
      color: #ffffff;
      background: linear-gradient(180deg, #f1ffff 0%, #b9deff 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-right: 20rem;
      div {
        font-size: 18rem;
        font-family: HuXiaoBoNanShenTi;
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        line-height: 10rem;
      }
    }
    .main-title {
      font-size: 36rem;
      font-family: HuXiaoBoNanShenTi;
      color: #ffffff;
      margin-top: -8rem;
      letter-spacing: 2rem;
      background: linear-gradient(180deg, #f1ffff 0%, #b9deff 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
`;

export const LayoutWrapper = styled.div`
  .layout-content_outer {
    width: inherit;
    height: 100vh;
    position: relative;
  }
`;
