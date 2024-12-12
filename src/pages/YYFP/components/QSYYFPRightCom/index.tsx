import { PanelHeader } from '@/components/Header';
import { RightWrapper } from './style';
import WaterLevelForecast from './WaterLevelForecast';
import VillageRisk from './VillageRisk';
import CoreArea from './CoreArea';

/**
 * 右边的组件 - 村落风险统计
 * @returns
 */
const YYFPRightCom = () => {
  return (
    <RightWrapper>
      <PanelHeader title={'水位预报'} />
      <WaterLevelForecast />

      <div className="right-content">
        <PanelHeader title={'村镇风险统计'} />
        <VillageRisk />
      </div>

      <div className="right-content">
        <PanelHeader title={'流域淹没情况概览'} />
        <CoreArea />
      </div>
    </RightWrapper>
  );
};

export { YYFPRightCom };
