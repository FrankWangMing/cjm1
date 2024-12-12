/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { IMG_PATH, RISK_MAP } from '@/utils/const';
import styled from 'styled-components';
/**
 * 业务规则 - 风险等级划分标准 -- 静态界面无后端交互
 * @returns
 */
const RiskLevel = () => {
  const LEFT_DATA = {
    title: '判据说明',
    desc: '小流域洪涝具有点多面广、突发性强、成灾快的特点，风险定义综合考虑淹没范围内的水深、流速、泥石三种因素。',
    formula: '风险值=水深*（流速+0.5）+泥石因子',
    valueRange: [
      '当水深 ≤0.25米时，泥石因子取值0.5；',
      '当水深＞0.25米时，泥石因子取值1.0。'
    ],
    unitDesc: '其中：水深——米， 流速——米/秒。',
    lastDesc:
      '村落风险等级划分依据：计算村落所有节点在空间范围内的风险平均值，再根据预报/预演时段内的空间平均风险值中的最大值，划分洪涝风险等级。'
  };
  const RISK_DATA = [
    {
      icon: IMG_PATH.riskLevel[1],
      title: RISK_MAP.RISKLEVEL_DESC_MAP[1],
      desc: '风险值 > 2.0'
    },
    {
      icon: IMG_PATH.riskLevel[2],
      title: RISK_MAP.RISKLEVEL_DESC_MAP[2],
      desc: '1.25 < 风险值 ≤ 2.0'
    },
    {
      icon: IMG_PATH.riskLevel[3],
      title: RISK_MAP.RISKLEVEL_DESC_MAP[3],
      desc: '0.75 < 风险值 ≤ 1.25'
    },
    {
      icon: IMG_PATH.riskLevel[0],
      title: RISK_MAP.RISKLEVEL_DESC_MAP[0],
      desc: '0.5 < 风险值 ≤ 0.75'
    }
  ];
  return (
    <RiskLevelWrapper className="bg-content-area-alpha flex animate__animated animate__fadeIn">
      {/* <div className="half-item">
        <div className="risk-level-header flex-center">{LEFT_DATA.title}</div>
        <div className="risk-desc-content flex-center column">
          <div className="text-outer">{LEFT_DATA.desc}</div>
          <div className="text-outer">{LEFT_DATA.formula}</div>
          <div className="text-outer">
            <div>{LEFT_DATA.valueRange[0]}</div>
            <div>{LEFT_DATA.valueRange[1]}</div>
          </div>
          <div className="text-outer" style={{ lineHeight: '48rem' }}>
            {LEFT_DATA.unitDesc}
          </div>
          <div className="risk-map-outer">
            {RISK_DATA.map((item, index) => {
              return (
                <div className="risk-map-outer-item" key={index}>
                  <img
                    src={item.icon}
                    alt=""
                    style={{ marginRight: '20rem' }}
                  />
                  <span style={{ marginRight: '60rem' }}>{item.title}</span>
                  <div className="risk-map-outer-desc">{item.desc}</div>
                </div>
              );
            })}
          </div>
          <div
            className="text-outer"
            style={{
              border: '0',
              textAlign: 'left',
              background: 'unset',
              boxShadow: 'unset',
              lineHeight: 'unset'
            }}>
            {LEFT_DATA.lastDesc}
          </div>
        </div>
      </div> */}
      <div className="half-item">
        <div className="risk-level-header flex-center">判据说明</div>
        <div className="risk-desc-content">
          <img
            style={{ width: '100%', height: '100%' }}
            src={IMG_PATH.riskDescTable1}
            alt="判据说明"
          />
        </div>
      </div>
      {/* 右侧表格 */}
      <div className="half-item">
        <div className="risk-level-header flex-center">
          水深流速组合风险判定成果表
        </div>
        <div className="risk-desc-content">
          <img
            style={{ width: '100%', height: '100%' }}
            src={IMG_PATH.riskDescTable2}
            alt="水深流速组合风险判定成果表"
          />
        </div>
      </div>
    </RiskLevelWrapper>
  );
};

const RiskLevelWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 276rem);
  margin-top: -20rem;
  padding: 20rem;
  .half-item:nth-child(1) {
    padding-right: 10rem;
  }
  .half-item:nth-child(2) {
    padding-left: 10rem;
  }
  .risk-level-header {
    width: 100%;
    height: 70rem;
    background: rgba(149, 174, 255, 0.28);
    font-size: 24rem;
    text-align: center;
  }
  .risk-table-header-td {
    width: 25%;
    font-size: 24rem;
  }
  .risk-level-table-tr {
    margin-top: 10rem;
    height: 160rem;
    background: rgba(201, 214, 255, 0.24);
  }
  .risk-level-table-tr:nth-child(odd) {
    background: rgba(255, 255, 255, 0.08);
  }
  .risk-desc-content {
    justify-content: unset !important;
    background: rgba(255, 255, 255, 0.08);
    width: 100%;
    height: calc(100% - 80rem);
    margin-top: 10rem;
    .text-outer {
      width: calc(100% - 130rem);
      background: rgba(0, 2, 7, 0.2);
      border: 1rem solid rgba(151, 151, 151, 1);
      box-shadow: inset 0rem -1rem 0rem 0rem rgba(61, 70, 92, 1);
      margin-bottom: 10rem;
      text-align: center;
    }
    .text-outer:nth-child(1) {
      background: unset;
      border: unset;
      box-shadow: unset;
      margin: 20rem 0;
      text-align: left;
    }
    .text-outer:nth-child(2) {
      height: 54rem;
      line-height: 54rem;
    }
    .text-outer:nth-child(3) {
      height: 100rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .text-outer:nth-last-child(1) {
      height: 64rem;
      line-height: 48rem;
    }
    .risk-map-outer-item {
      width: inherit;
      margin-bottom: 20rem;
      position: relative;
      display: flex;
    }
    .risk-map-outer-desc {
      position: absolute;
      left: 250rem;
    }
    .risk-map-outer {
      width: 480rem;
      img {
        width: 40rem;
        height: 40rem;
      }
    }
  }

  div {
    font-family: AlibabaPuHuiTiR;
    font-size: 24rem;
    color: #ffffff;
  }
`;

export { RiskLevel };
