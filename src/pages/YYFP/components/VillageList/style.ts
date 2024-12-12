import styled from 'styled-components';
const VillageListWrapper = styled.div<{ size?: 'large' | 'small' }>`
  .village-table-outer {
    width: 400rem;
    padding: 0rem 20rem;
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

    .ant-popover-content {
      width: 128rem;
    }
    th {
      text-align: left;
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #ffffff;
    }

    th:nth-child(1) {
      width: 100rem;
      padding-left: 33rem;
    }

    th:nth-child(2) {
      width: 100rem;
    }

    th:nth-child(3) {
      width: 120rem;
    }

    th:nth-child(4) {
      width: 60rem;
    }

    img {
      width: 24rem;
      height: 24rem;
      transition: all 300ms;
    }
  }

  /* 表格内容 */

  .village-table-outer .village-table-content {
    width: 100%;
    height: 136rem;
    overflow-y: auto;
    overflow-x: hidden;

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
      height: 32rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;

      .sub-item {
        display: flex;
        align-items: center;
        height: inherit;
        font-family: AlibabaPuHuiTiR;
        font-size: 14rem;
        color: #ffffff;

        .riskType {
          width: 2rem;
          height: inherit;
          background-color: red;
        }
      }
    }

    tr:nth-child(2n) {
      background: rgba(255, 255, 255, 0.16);
    }
    tr:nth-child(2n + 1) {
      background: rgba(255, 255, 255, 0.06);
    }

    .sub-item:nth-child(1) {
      width: 100rem;

      span:nth-child(2) {
        padding-left: 20rem;
      }
    }

    .sub-item:nth-child(2) {
      width: 100rem;
    }

    .sub-item:nth-child(3) {
      width: 110rem;
    }
  }
`;
export { VillageListWrapper };
