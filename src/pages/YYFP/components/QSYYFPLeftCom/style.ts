import styled, { css } from 'styled-components';
import { IMG_PATH } from '@/utils/const';
import { Form, InputNumber } from 'antd';

export const QSYYFPLeftWrapper = styled.div`
  position: relative;

  .operation-outer {
    padding: 10rem 10rem;
    height: 900rem;
    font-family: AlibabaPuHuiTiM;
  }

  .back-btn {
    position: absolute;
    top: 14rem;
    right: 18rem;
    font-size: 24rem;
    cursor: pointer;
  }
`;

export const SceneSelectorWrapper = styled.div`
  display: flex;
  margin-top: 10rem;
  margin-bottom: 20rem;
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

export const SubtitleWrapper = styled.div`
  letter-spacing: 0;
  padding: 0 10rem;
  margin-bottom: 16rem;
  font-family: MicrosoftYaHei-Bold;
  font-size: 16rem;
  color: #ffffff;
  line-height: 16rem;
  font-weight: 700;
  border-left: 4px solid #3cdcff;
`;

export const RainfallIntensityWrapper = styled.div``;

export const RainfallIntensitySelectorWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 28rem;
  margin-bottom: 10rem;

  .selector-item {
    width: 133rem;
    height: 29rem;
    background: rgba(197, 218, 221, 0.24);
    cursor: pointer;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16rem;
    color: #ffffff;
    letter-spacing: 0.89px;
    text-align: center;
    line-height: 28rem;
    font-weight: 700;
  }

  .selected {
    background-image: url(${IMG_PATH.selectedButton2});
    background-repeat: no-repeat;
  }
`;

export const ReservoirWrapper = styled.div`
  font-size: 18rem;
  margin-bottom: 20rem;

  .list-header {
    width: 400rem;
    height: 32rem;
    display: flex;
    justify-content: space-between;
    padding-right: 60rem;
    padding-left: 50rem;
    background-image: linear-gradient(
      270deg,
      rgba(0, 152, 214, 0.6) 0%,
      rgba(11, 72, 99, 0.6) 100%
    );

    font-family: WeiRuanYaHei;
    font-size: 14rem;
    color: #ffffff;
    line-height: 32rem;
    font-weight: 400;
  }

  .list-content-container {
    width: 400rem;
    height: 180rem;
    overflow-x: hidden;
    overflow-y: auto;

    font-family: WeiRuanYaHei;
    font-size: 14rem;
    color: #ffffff;
    line-height: 32rem;
    font-weight: 400;
  }

  .list-item {
    width: 400rem;
    height: 36rem;
    line-height: 36rem;
    display: flex;
    justify-content: space-between;
    padding-right: 25rem;
    padding-left: 50rem;
  }

  .list-item:nth-child(2n) {
    background: rgba(255, 255, 255, 0.16);
  }

  .list-item:nth-child(2n + 1) {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const FormWrapper = styled(Form)`
  position: absolute;
  bottom: 124rem;
  left: 20rem;

  .ant-form-item {
    width: 174rem;
    font-size: 14rem;
    margin-top: 10rem;
  }

  .ant-input-number {
    background: rgba(2, 12, 35, 0.6);
    border: 0.5px solid rgba(80, 253, 255, 0.5);
    color: #fff;
  }
  .ant-input-number-input-wrap {
    font-family: WeiRuanYaHei;
    font-size: 14rem;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 400;
    /* line-height: 26rem; */
  }
  .ant-form-item-label {
    > label {
      font-size: 14rem;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
      font-family: PingFangSC-Medium;
    }
  }
`;

export const LeftBottomBtn = styled.div<{ $disabled?: boolean }>`
  cursor: pointer;
  width: 360rem;
  height: 36rem;
  line-height: 36rem;
  background-image: url(${IMG_PATH.buttonBg});
  background-repeat: no-repeat;

  opacity: 0.9;
  font-family: WeiRuanYaHei;
  font-size: 18rem;
  color: #ffffff;
  letter-spacing: 1px;
  text-align: center;
  font-weight: 400;
  ${props => {
    return props.$disabled
      ? css`
          pointer-events: none;
          cursor: not-allowed;
        `
      : '';
  }}
`;

export const CustomSceneWrapper = styled.div``;

export const RainSceneWrapper = styled.div`
  margin-bottom: 10rem;
`;
export const RainSceneFormInput = styled(InputNumber)`
  width: 96rem !important;
  color: #fff;
  background: #020623;
  border: 0.5rem solid rgba(0, 151, 214, 1);

  .ant-input-number {
    border: none;
    background: transparent;
    text-align: center;
  }

  .ant-input-number-group-addon {
    background: transparent;
    color: #fff;
    border: transparent;
    padding: 0 2rem;
    font-size: 16rem;
  }
`;

export const RainSceneFormWrapper = styled.div`
  width: 400rem;

  .show-line {
    background: rgba(255, 255, 255, 0.06);
    border: 1px dashed rgba(255, 255, 255, 0.6);
  }
  .ant-form {
    padding: 6rem 10rem 10rem 10rem;
    .river-selector {
      .ant-form-item-label {
        width: 90rem;

        > label::after {
          content: '';
        }
      }
      .ant-form-item-control-input {
        width: 258rem;
      }

      .ant-select-focused {
        /* 修改ant-select-focused的样式 */
        .ant-select-selector {
          border-color: rgba(80, 253, 255, 0.5);
        }
      }
    }

    .ant-form-item {
      margin-bottom: 7rem;
      height: 28rem;
    }
    .form-list-container {
      height: 213rem;
      overflow-y: auto;
    }
    .ant-form-item-label {
      > label {
        font-family: WeiRuanYaHei;
        font-size: 14rem;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 18rem;
        font-weight: 400;
      }
    }

    .ant-input-number-group-wrapper {
      .ant-input-number-input-wrap {
        width: 219rem;
      }
    }

    .rain-total,
    .rain-time {
      margin-top: 6rem;
      .ant-input-number-input-wrap {
        width: 58rem;
      }
    }
    .rain-total {
      margin-left: 30rem;
    }
  }

  .icon {
    color: #fff;
    font-size: 16rem;
    cursor: pointer;
  }

  .btn-add {
    width: 370rem;
    height: 28rem;
    font-size: 20rem;
    background: rgba(2, 12, 35, 1);
    border: 1px solid rgba(80, 253, 255, 0.5);
    text-align: center;
    color: #fff;
    cursor: pointer;
    margin: 4rem 5rem;
  }

  .config-selector {
    display: flex;
    margin-bottom: 10rem;
    font-size: 16rem;
    color: #fff;
    font-family: WeiRuanYaHei;
    letter-spacing: 0.89px;
    text-align: center;
    line-height: 20rem;
    font-weight: 700;

    > div {
      width: 50%;
      height: 28rem;
      text-align: center;
      line-height: 28rem;
      background: rgba(197, 218, 221, 0.24);
      cursor: pointer;
    }

    .action {
      background-image: url(${IMG_PATH.selectedButton2});
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }

  .container-btn {
    display: flex;
    margin-top: 14rem;
    .btn-reset {
      width: 80rem;
      height: 32rem;
      line-height: 32rem;
      font-size: 16rem;
      color: #ffffff;
      text-align: center;
      letter-spacing: 0.89px;
      font-weight: 400;
      cursor: pointer;
      margin-left: 110rem;
      background-image: url(${IMG_PATH.buttonBg2});
      background-repeat: no-repeat;
      background-size: cover;
    }

    .btn-submit {
      width: 80rem;
      height: 32rem;
      line-height: 32rem;
      background-image: url(${IMG_PATH.buttonBg3});
      background-repeat: no-repeat;
      background-size: 100%;

      border-radius: 4px;
      font-size: 16rem;
      color: #ffffff;
      text-align: center;
      font-weight: 500;
      cursor: pointer;
      margin-left: 20rem;
    }
  }

  .back-to-form {
    width: 400rem;
    height: 28rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px dashed rgba(255, 255, 255, 0.6);
    margin-bottom: 10rem;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transform: rotate(90deg);
      font-size: 18rem;
      padding: 5rem 0;
    }
  }
`;

export const ReservoirSceneFormWrapper = styled.div`
  .title {
    width: 400rem;
    height: 32rem;
    display: flex;
    justify-content: space-between;
    padding-right: 90rem;
    padding-left: 50rem;
    background-image: linear-gradient(
      270deg,
      rgba(0, 152, 214, 0.6) 0%,
      rgba(11, 72, 99, 0.6) 100%
    );

    font-family: WeiRuanYaHei;
    font-size: 14rem;
    color: #ffffff;
    line-height: 32rem;
    font-weight: 400;
  }

  .ant-form-item-control-input {
    min-height: 32rem;
  }
  .ant-col,
  .ant-form-item-no-colon {
    height: 32rem;
  }

  .ant-form-item {
    height: 32rem;
    margin-bottom: 2rem !important;
    .ant-select-focused {
      /* 修改ant-select-focused的样式 */
      .ant-select-selector {
        border-color: rgba(80, 253, 255, 0.5) !important;
      }
    }
  }

  .ant-form-item:nth-child(2n) {
    background: rgba(255, 255, 255, 0.16);
  }

  .ant-form-item:nth-child(2n + 1) {
    background: rgba(255, 255, 255, 0.06);
  }
  .ant-form-item-label {
    > label {
      font-family: WeiRuanYaHei;
      font-size: 14rem;
      color: #ffffff;
      font-weight: 400;
      margin-left: 50rem;
    }
  }

  .ant-form-item-control {
    margin-left: 50rem;
    margin-right: 18rem;
    height: 32rem;
  }
`;
