/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import styled from 'styled-components';

export const LoginWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: ${props => props.theme.bgColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('/images/login/login-background.png');
  background-size: cover;
  .login-top {
    padding: 60px 10px;
  }
  .login-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    & .login-form {
      padding: 40px;
      width: 424px;
      height: 449px;
      background: #ffffff;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      & .login-title {
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #4264c6;
        letter-spacing: 10px;
        padding: 40px 0;
        & .form-box {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
`;
