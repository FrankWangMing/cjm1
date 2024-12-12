/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

/**
 * 高水位最高风险组件
 */
interface IProps {
  waterLine: string[];
  riskLevel: number[];
}

const RISK_MAP = {
  1: {
    name: '一级',
    cssName: 'first'
  },
  2: {
    name: '二级',
    cssName: 'second'
  },
  3: {
    name: '三级',
    cssName: 'third'
  },
  0: {
    name: '无风险',
    cssName: 'zero'
  }
};

export default (props: IProps) => {
  return (
    <Wrapper>
      <div className="max-risk-outer flex">
        <div className="header-outer flex">
          {props.riskLevel.includes(3) && (
            <div className="legend">
              <div className="flag color_three"></div>三级风险
            </div>
          )}
          {props.riskLevel.includes(2) && (
            <div className="legend">
              <div className="flag color_second"></div>二级风险
            </div>
          )}
          {props.riskLevel.includes(1) && (
            <div className="legend">
              <div className="flag color_first"></div>
              一级风险
            </div>
          )}
          {props.riskLevel.includes(0) && (
            <div className="legend">
              <div className="flag color_zero"></div>
              无风险
            </div>
          )}
        </div>
        <div className="column-outer flex">
          {props.riskLevel.map((item: number, index: number) => {
            return (
              <div className="column-item flex" key={index}>
                <span>{props.waterLine[index]}m高水位</span>
                <div className={RISK_MAP[item]?.cssName}></div>
              </div>
            );
          })}
        </div>
        <div className="line"></div>
      </div>
    </Wrapper>
  );
};

import { useEffect } from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
  align-self: flex-start;
  padding: 30rem;
  .max-risk-outer {
    width: inherit;
    height: inherit;
    flex-direction: column;
    justify-content: center;
  }
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-outer {
    width: 100%;
    margin-top: 10rem;
    margin-bottom: 70rem;
    justify-content: center;
    span {
      font-family: AlibabaPuHuiTiR;
      font-size: 18rem;
      color: #ffffff;
    }
    .legend:nth-last-child() {
      margin: 0;
    }
    .legend {
      display: flex;
      align-items: center;
      margin-right: 40rem;
      .flag {
        width: 20rem;
        height: 20rem;
        margin-right: 10rem;
      }
      font-family: AlibabaPuHuiTiR;
      font-size: 16rem;
      color: #ffffff;
    }
  }
  .column-outer {
    width: 100%;
    height: 150rem;
    display: flex;
    justify-content: center;
  }
  .column-item {
    width: 120rem;
    padding: 0 100rem;
    height: inherit;
    flex-direction: column;
    justify-content: flex-end;
    span {
      width: inherit;
      font-family: AlibabaPuHuiTiR;
      font-size: 16rem;
      color: #ffffff;
      margin-bottom: 10rem;
    }
    .first {
      width: inherit;
      height: 100rem;
      background-color: #ff0000;
    }
    .second {
      width: inherit;
      height: 80rem;
      background-color: #ff7700;
    }
    .third {
      width: inherit;
      height: 60rem;
      background-color: #f4e819;
    }
    .zero {
      width: inherit;
      height: 100rem;
      background-color: #5af901;
    }
  }
  .color_zero {
    background-color: #5af901;
  }
  .color_three {
    background-color: #f4e819;
  }
  .color_second {
    background-color: #ff7700;
  }
  .color_first {
    background-color: #ff0000;
  }
  .line {
    width: 100%;
    height: 1rem;
    background-color: #fff;
  }
`;
