import styled from 'styled-components';

export const RightWrapper = styled.div`
  width: 400rem;
  height: 861rem;

  .right-content {
    margin-top: 10rem;
  }
`;

/* 默认背景颜色 */
const backgroundColor =
  'linear-gradient(180deg,rgba(0, 13, 17, 0.45) 0%,rgba(40, 49, 53, 0.9) 100%)';

/* 水位预报 */
export const WaterLevelForecastWapper = styled.div`
  width: inherit;
  height: 230rem;
  overflow: hidden;
  background-image: ${backgroundColor};
  color: #fff;
  padding: 12rem 20rem;

  .table-container {
    height: 160rem;
    overflow: auto;
  }

  table {
    width: 100%;
    table-layout: fixed;

    thead {
      background-image: linear-gradient(
        270deg,
        rgba(0, 152, 214, 0.6) 0%,
        rgba(11, 72, 99, 0.6) 100%
      );
      font-family: WeiRuanYaHei;
      color: #ffffff;
      font-weight: 400;
      font-size: 16rem;
      height: 38rem;

      th:nth-child(1) {
        padding: 0 10rem;
        text-align: center;
        width: 180rem;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    tbody {
      tr:nth-child(2n + 1) {
        background: rgba(255, 255, 255, 0.06);
      }

      tr:nth-child(2n) {
        background: rgba(255, 255, 255, 0.16);
      }

      tr {
        height: 32rem;
        font-family: WeiRuanYaHei;
        font-size: 14rem;
        color: #ffffff;
        font-weight: 400;
        cursor: pointer;

        td {
          padding: 0 10rem;
          text-align: center;
        }

        td:nth-child(1) {
          text-align: center;
          width: 180rem;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
`;

/* 村落风险统计 */
export const VillageRiskWapper = styled.div`
  width: inherit;
  height: 340rem;
  overflow-y: auto;
  overflow-x: hidden;
  background-image: ${backgroundColor};
  color: #fff;
`;

/* 全域淹没情况概览 */
export const CoreAreaWapper = styled.div`
  width: inherit;
  height: 230rem;
  position: relative;
  background-image: ${backgroundColor};

  img {
    width: 256rem;
    height: 184rem;
    position: absolute;
    right: 20rem;
    top: 20rem;
  }

  .core-area-desc {
    position: absolute;
    top: 48rem;
    left: 20rem;
    min-width: 100rem;

    h1 {
      font-family: AlibabaPuHuiTiM;
      font-size: 14rem;
      color: #ffffff;
      text-align: left;
      font-weight: 500;
    }

    span {
      font-family: DIN-BoldItalic;
      font-size: 20rem;
      color: #ffffff;
      font-weight: 700;
    }
  }
`;
