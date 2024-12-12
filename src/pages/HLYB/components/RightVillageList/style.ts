/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import styled from 'styled-components';
const VillageListWrapper = styled.div<{ size?: 'large' | 'small' }>`
  h1 {
    width: 100%;
    height: 50rem;
    line-height: 50rem;
    font-size: 25rem;
    text-align: center;
    color: #fff;
    font-family: AlibabaPuHuiTiR;
  }
  /* 搜索框 */
  .input-search-outer {
    padding-top: 0rem;
    padding-bottom: 12rem;
    width: 420rem;
    height: 42rem;
    position: relative;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .search-input {
      background: rgba(2, 12, 35, 0.6);
      border: 1rem solid rgba(147, 182, 230, 1);
      color: #ffffff;
      width: 90%;
      height: 32rem;
      font-size: 18rem;
      padding-left: 15rem !important;
      padding-right: 60rem !important;
    }
    img {
      width: 32rem;
      height: 32rem;
      position: absolute;
      right: 30rem;
    }
    img:active {
      width: 34rem;
      height: 34rem;
      top: 21rem;
      right: 29rem;
    }
  }
  /* 村庄列表 */
  /* 表格外部 */
  .village-table-outer {
    width: 420rem;
    padding: 20rem;
    padding-top: 0;
    position: relative;
  }
  /* 表格表头 */
  .village-table-outer .village-table-header {
    background-image: linear-gradient(
      270deg,
      rgba(0, 152, 214, 0.6) 0%,
      rgba(11, 72, 99, 0.6) 100%
    );
    width: 100%;
    height: 36rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      height: 100%;
      display: flex;
      align-items: center;
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #ffffff;
    }
    span:nth-child(1) {
      width: 170rem;
      padding-left: 20rem;
    }
    span:nth-child(2) {
      width: 110rem;
    }
    span:nth-child(3) {
      width: 80rem;
    }
    img {
      width: 24rem;
      height: 24rem;
      transition: all 300ms;
    }
  }
  /* 操作要展示的内容区域 */
  .ant-popover-inner {
    background-color: #081b23;
  }
  .ant-popover-inner-content {
    padding: 10rem;
    width: 112rem;
    /* height: 150rem; */
    display: flex;
    align-items: center;
    border-radius: 4rem;
    font-size: 18rem;
    font-family: AlibabaPuHuiTiR;
    color: #333333;
    .ant-checkbox {
      width: 20rem;
      height: 20rem;
    }
    .ant-checkbox-group {
      width: 100rem;
    }
    .ant-checkbox-group-item {
      margin-bottom: 10rem !important;
      .ant-checkbox {
        width: 20rem !important;
        height: 20rem;
        padding: 0 !important;
      }
      span {
        /* color: #333333; */
        color: white;
      }
    }
    .ant-checkbox-group-item:nth-last-child(1) {
      margin-bottom: 0 !important;
    }
  }
  /* 表格内容 */
  .village-table-outer .village-table-content {
    width: 100%;
    height: ${props => (props.size === 'small' ? '170rem' : '610rem')};
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 10rem;
    ::-webkit-scrollbar {
      /*整体样式*/
      width: 5rem;
    }
    ::-webkit-scrollbar-thumb {
      /*滚动条小方块*/
      border-radius: 10rem;
      /* background-color: #2e75d3; */
      background-color: #dee7f6;
    }
    .village-table-content_item {
      cursor: pointer;
      width: 100%;
      height: 40rem;
      margin-bottom: 5rem;
      background: rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .sub-item {
        display: flex;
        align-items: center;
        height: inherit;
        .riskType {
          width: 4rem;
          height: inherit;
          background-color: red;
        }
        span {
          display: inline-block;
          font-family: AlibabaPuHuiTiR;
          font-size: 18rem;
          color: #ffffff;
        }
      }
      span:nth-child(2) {
        margin-left: 10rem;
      }
      .sub-item:nth-child(1) {
        width: 170rem;
      }
      .sub-item:nth-child(2) {
        width: 110rem;
      }
      .sub-item:nth-child(3) {
        width: 80rem;
      }
    }
    .village-table-content_item:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
`;
export { VillageListWrapper };
