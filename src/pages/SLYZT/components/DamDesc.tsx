/**
 * 大坝详情
 */
import { IMG_PATH } from '@/utils/const';
import { Fragment } from 'react';
import styled from 'styled-components';

const SingleDamComWrapper = styled.div<{ size: 'large' | 'small' }>`
  font-family: AlibabaPuHuiTiM;
  position: relative;
  width: 100%;
  font-size: 18rem;
  color: #ffffff;
  /* height: 100%; */
  height: ${props => (props.size === 'large' ? '374rem' : '100%')};
  img {
    width: 99.8%;
    height: 100%;
  }
  .right-desc-outer {
    position: absolute;
    right: ${props => (props.size === 'large' ? '40rem' : '20rem')};
    top: ${props => (props.size === 'large' ? '55rem' : '20rem')};
  }
  .right-desc {
    margin-bottom: ${props => (props.size === 'large' ? '20rem' : '10rem')};
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .right-desc:nth-last-child(1) {
    margin: 0;
  }
  span {
    font-family: DIN-BlackItalic;
    margin-left: 10rem;
  }
  .top-desc-outer {
    position: absolute;
    top: 10rem;
    left: 50rem;
    display: flex;
    line-height: 25rem;
    .top-desc-item {
      margin-right: 40rem;
    }
    .top-desc-item:nth-last-child(1) {
      margin: 0;
    }
  }
  .left-desc-outer {
    position: absolute;
    left: 90rem;
    top: 200rem;
    transform: rotateZ(270deg);
  }
`;
type ShowData = { title: string; value: string | number; unit: string };

interface IDamDescCom {
  size: 'large' | 'small';
  topData?: ShowData[];
  leftData?: ShowData;
  rightData: ShowData[];
}
const DamDescCom: React.FC<IDamDescCom> = ({
  size,
  topData,
  leftData,
  rightData
}: IDamDescCom) => {
  return (
    <SingleDamComWrapper size={size}>
      <img src={size == 'large' ? IMG_PATH.damBgWithLine : IMG_PATH.damBg} />
      {/* 表格 */}
      {size === 'large' && (
        <Fragment>
          <div className="top-desc-outer">
            {topData?.map((item, index) => {
              return (
                <div key={index} className="top-desc-item">
                  {item.title}：<span>{item.value}</span>
                  &nbsp; {item.unit}
                </div>
              );
            })}
          </div>
          <div className="left-desc-outer">
            {leftData?.title}：<span>{leftData?.value}</span>
            &nbsp;{leftData?.unit}
          </div>
        </Fragment>
      )}
      <div className="right-desc-outer">
        {rightData.map((item, index) => {
          return (
            <div key={index} className="right-desc">
              {item.title} <span>{item.value}</span>
              &nbsp;{item.unit}
            </div>
          );
        })}
      </div>
    </SingleDamComWrapper>
  );
};

export { DamDescCom };
