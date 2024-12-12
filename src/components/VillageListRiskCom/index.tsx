/**
 * Author: jamie
 * Date: 2024-10-15
 * Description:村庄风险等级展示组件
 * rangeToUse: yyfp-components-villageList
 * rangeToUse：
 */
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';
import { IMG_PATH, RISK_MAP } from '@/utils/const';
import styled from 'styled-components';
interface VillageRiskCountProps {
  riskLevel: string;
  villageCount: number;
}
export const VillageRiskCountCom: React.FC<VillageRiskCountComProp> = ({
  villageRiskCount
}) => {
  let tempRisk = ['1', '2', '3', '0'];
  const [data, setData] = useSafeState<VillageRiskCountProps[]>([]);

  useEffect(() => {
    if (villageRiskCount.length > 0) {
      let tempData = villageRiskCount.filter(item => {
        return tempRisk.includes(item.riskLevel);
      });
      tempData.sort((a, b) => {
        return Number(a.riskLevel) - Number(b.riskLevel);
      });
      console.log('temData', tempData);
      setData([tempData[1], tempData[2], tempData[3], tempData[0]]);
    }
  }, [villageRiskCount]);

  return (
    <RiskWrapper>
      <div className="risk-item-outer flex-between">
        {data.map(item => {
          return (
            <div className="risk-item flex-center column " key={item.riskLevel}>
              <p className="numberP">{item.villageCount}</p>
              <img
                src={IMG_PATH.riskLevel[item.riskLevel]}
                alt=""
                draggable={false}
              />
              <p>{RISK_MAP.RISKLEVEL_DESC_MAP[item.riskLevel]}</p>
            </div>
          );
        })}
      </div>
    </RiskWrapper>
  );
};
interface VillageRiskCountComProp {
  villageRiskCount: {
    riskLevel: string;
    villageCount: number;
  }[];
}

const RiskWrapper = styled.div`
  /* 风险等级个数 */
  width: 100%;
  padding: 10rem 20rem;
  .risk-item {
    height: 120rem;
    width: 80rem;
    img {
      width: 59rem;
      height: 46rem;
      margin: 5rem 0;
    }
    .numberP {
      font-size: 20rem;
      font-family: DIN-MediumItalic;
    }
    p {
      font-family: WeiRuanYaHei;
      font-size: 14rem;
      color: #ffffff;
      text-align: center;
      line-height: 18rem;
      font-weight: 400;
    }
  }
  .risk-item:hover {
    background: rgba(255, 255, 255, 0.16);
    border-radius: 2px;
  }
`;
