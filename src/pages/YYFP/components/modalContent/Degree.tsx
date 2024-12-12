/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 水刻度样式组件
 */
import { message } from 'antd';
import { Fragment } from 'react';
import styled from 'styled-components';

const Actual_DegreeNumList = [
  '108.0',
  '108.1',
  '108.2',
  '108.3',
  '108.4',
  '108.5',
  '108.6',
  '108.7',
  '108.8',
  '108.9',
  '109.0'
];

const degreeNumList = ['108.0', '108.2', '108.4', '108.6', '108.8', '109.0'];

interface IProps {
  currentVal: string;
  updateCurrentVal: Function;
  contrastWaterLines: (string | number)[];
}

/**
 * 刻度线的小组件
 * @param currentVal 当前选中的值
 * @param updateCurrentVal 更新选中的值
 * @param contrastWaterLines 对比水位线
 * @returns
 */
export const Degree = (props: IProps) => {
  return (
    <DegreeWrapper>
      <div className="degree-outer">
        <div className="degree-radio-list">
          {Actual_DegreeNumList.map((item, index) => {
            return (
              <Fragment key={index}>
                {index > 0 && <div className="split-line"></div>}
                {props.contrastWaterLines[0] == item ||
                props.contrastWaterLines[1] == item ? (
                  <div
                    className="degree-radio-item degree-radio-item_holder"
                    key={index}
                    onClick={() => {
                      props.updateCurrentVal(item);
                    }}></div>
                ) : props.currentVal == item ? (
                  <div
                    className="degree-radio-item degree-radio-item_checked"
                    key={index}>
                    <div className="checked-inner"></div>
                  </div>
                ) : (
                  <div
                    className="degree-radio-item"
                    key={index}
                    onClick={() => {
                      props.updateCurrentVal(item);
                    }}></div>
                )}
              </Fragment>
            );
          })}
        </div>

        <div className="num-list-outer">
          {degreeNumList.map(item => {
            return (
              <span
                key={item}
                onClick={() => {
                  message.info(item);
                  props.updateCurrentVal(item);
                }}>
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </DegreeWrapper>
  );
};

const DegreeWrapper = styled.div`
  width: 360rem;
  .degree-outer {
    width: inherit;
    margin-bottom: 20rem;
    margin-top: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .degree-radio-list {
    width: 350rem;
    height: 24rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .split-line {
      width: 10rem;
      height: 2rem;
      background: rgba(255, 255, 255, 0.24);
      border-radius: 2rem;
    }
    .degree-radio-item {
      width: 20rem;
      height: 20rem;
      background-color: rgba(1, 1, 1, 0);
      border-radius: 50%;
      border: 1rem solid #fff;
      cursor: pointer;
    }
    .degree-radio-item_holder {
      background-color: #fff;
      width: 20rem;
      height: 20rem;
    }
    .degree-radio-item_checked {
      background-color: #fff;
      width: 24rem;
      height: 24rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .checked-inner {
        width: 18rem;
        height: 18rem;
        border-radius: 50%;
        background-image: linear-gradient(
          270deg,
          rgba(5, 58, 180, 0.8) 0%,
          rgba(43, 117, 210, 0.8) 100%
        );
      }
    }
  }

  .degree-outer .line {
    width: 307rem;
    height: 2rem;
    background: rgba(255, 255, 255, 0.24);
    border-radius: 2rem;
  }
  .tick-outer {
    width: 320rem;
    display: flex;
    justify-content: space-between;
    .tick-item-outer {
      width: 20rem;
      height: 20rem;
      border-radius: 50%;
      background-color: #1f3046;
      border: 1rem solid #ffffff;
      display: flex;
      justify-content: center;
      transform: translateY(8rem);
      cursor: pointer;
    }
    .tick_selected {
      width: 24rem;
      height: 24rem;
      transform: translateY(8rem);
      background-color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .tick_selected-blue {
        width: 20rem;
        height: 20rem;
        background-image: linear-gradient(
          270deg,
          rgba(5, 58, 180, 0.8) 0%,
          rgba(43, 117, 210, 0.8) 100%
        );
        border-radius: 50%;
      }
    }
  }
  .num-list-outer {
    width: 370rem;
    margin-top: 10rem;
    padding: 0;
    display: flex;
    justify-content: space-between;
    span {
      font-family: AlibabaPuHuiTiM;
      font-size: 14rem;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
    }
  }
`;
