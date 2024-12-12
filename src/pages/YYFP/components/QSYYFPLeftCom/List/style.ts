import styled from 'styled-components';
import { IMG_PATH } from '@/utils/const';

export const ListSelectorWrapper = styled.div`
  margin-top: 6rem;
  display: flex;
  margin-bottom: 10rem;
  font-family: MicrosoftYaHei-Bold;
  color: #ffffff;
  letter-spacing: 1px;
  font-weight: 700;
  font-size: 18rem;

  .selectorItem {
    width: 200rem;
    height: 36rem;
    text-align: center;
    line-height: 36rem;
    background: rgba(197, 218, 221, 0.24);
    cursor: pointer;
  }

  .selected {
    background-image: url(${IMG_PATH.selectedButton});
    background-repeat: no-repeat;
    background-size: 100%;
  }
`;

export const ListTableWrapper = styled.div`
  height: 822rem;
  overflow: auto;

  table {
    width: 100%;
    text-align: center;

    thead {
      background: linear-gradient(
        270deg,
        rgba(0, 152, 214, 0.6) 0%,
        rgba(11, 72, 99, 0.6) 100%
      );
      height: 38rem;

      th {
        font-family: WeiRuanYaHei;
        font-size: 16rem;
        color: #ffffff;
        text-align: center;
        line-height: 18rem;
        font-weight: 400;
        padding: 0 10rem;
      }
    }

    tbody {
      td {
        height: 48rem;
        font-family: WeiRuanYaHei;
        font-size: 14rem;
        color: rgba(255, 255, 255, 0.8);
        line-height: 14rem;
        font-weight: 400;

        .view {
          color: #50fdff;
        }

        .delete {
          color: #ff7272;
          margin-left: 8rem;
        }
      }

      tr:nth-child(2n) {
        background: rgba(255, 255, 255, 0.24);
      }

      tr:nth-child(2n + 1) {
        background: rgba(255, 255, 255, 0.08);
      }

      td:nth-child(3),
      td:nth-child(2) {
        white-space: pre-wrap;
        line-height: 18rem;
      }
    }
  }
`;

export const TitleWrapper = styled.div`
  background-image: linear-gradient(
    270deg,
    rgba(0, 152, 214, 0.6) 0%,
    rgba(11, 72, 99, 0.6) 100%
  );
  height: 42rem;
  font-family: PingFangSC-Medium;
  font-size: 20rem;
  color: #ffffff;
  font-weight: 500;
  padding: 3rem 20rem;

  img {
    width: 20rem;
    height: 24rem;
    position: absolute;
    right: 20rem;
    cursor: pointer;
  }
`;
