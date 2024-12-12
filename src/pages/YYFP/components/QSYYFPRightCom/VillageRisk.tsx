import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import GlobalStore from '@/store';
import { VillageList } from '../VillageList';
import { VillageRiskWapper } from './style';

/**
 * 右边的组件 - 村落风险统计
 */
const VillageRisk = observer(() => {
  const YYFPStore = useStore();

  // 点击列表跳转指定村庄
  const clickVillage = id => {
    YYFPStore.currModalObj.type = 'village';
    YYFPStore.currModalObj.id = id;
    let list = GlobalStore.getVillageItemById(id);
    GlobalStore.map?.flyTo({
      center: [list[0].longitude, list[0].latitude],
      zoom: 16,
      pitch: 0
    });
    // GlobalStore.mapboxLayer?.updateBottom(GlobalStore.map);
  };

  return (
    <VillageRiskWapper>
      <VillageList
        villageList={YYFPStore.currCase.villageRiskList}
        filterByRiskLevel={() => {}}
        clickVillageFunc={(id: any) => clickVillage(id)}
      />
    </VillageRiskWapper>
  );
});

export default VillageRisk;
