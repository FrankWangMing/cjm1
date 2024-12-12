import styled from 'styled-components';
const Wrapper = styled.div`
  width: 100%;
  height: 120rem;
  display: flex;
  position: relative;
  font-family: AlibabaPuHuiTiB;
  font-size: 20rem;
  color: #ffffff;
  text-align: center;
  .outer {
    width: calc(100% - 190rem);
    height: 80rem;
    display: block;
    margin-top: -55rem;
    cursor: pointer;
    position: relative;
    .degree-list-outer {
      width: 97%;
      margin-left: 1%;
      display: flex;
      justify-content: space-between;
      .degree-item {
        font-family: D-DIN-Bold;
        font-size: 14rem;
        color: #ffffff;
        text-align: center;
        line-height: 16rem;
        font-weight: 700;
        width: 4rem;
        height: 16rem;
        background: rgba(255, 255, 255, 0.24);
        position: relative;
        span {
          width: 60rem;
          position: absolute;
          top: 20rem;
          left: -30rem;
        }
      }
      /* .degree-item:nth-child(1) span {
        left: -10rem;
      } */
      .degree-item:nth-last-child(1) span {
        left: -30rem;
      }
    }
  }

  /**操作栏目 */
  .operator-outer {
    padding: 0;
    padding-left: 20rem;
    /* width: 545rem; */
    height: 100%;
    display: flex;
    justify-content: space-between;
    .title {
      width: 362rem;
      height: 48rem;
      line-height: 48rem;
      font-family: AlibabaPuHuiTiR;
      font-size: 20rem;
      color: #ffffff;
      text-align: center;
      margin-top: 20rem;
      background-image: linear-gradient(
        180deg,
        rgba(0, 6, 18, 0.9) 0%,
        rgba(4, 26, 54, 0.9) 100%
      );
      border-radius: 24rem;
    }
    .operator-btn-outer {
      margin-right: 20rem;
      width: 36rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      p {
        margin-top: 8rem;
        font-family: MicrosoftYaHei;
        font-size: 14rem;
        color: #ffffff;
        text-align: center;
        font-weight: 400;
      }
      img {
        width: 36rem;
        height: 36rem;
      }
    }
  }
  .without-title {
    width: 180rem;
    padding: 0 20rem;
  }
`;
export { Wrapper };
