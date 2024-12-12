/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-09-18 19:18:11
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-15 16:57:01
 * @FilePath: \cae01\qs-watershed\frontend\src\pages\HLYB\components\RightCom.tsx
 *
 */
import { PanelHeader } from '@/components/Header';
import { VillageList } from '../components/RightVillageList';
import { IMG_PATH } from '@/utils/const';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store';
import GlobalStore from '@/store';
import { MAPBOX_DEFAULT_CONFIG } from '@/components/Map';

/**
 * 右边的组件 - 村落风险统计
 * @returns
 */
const HLYBRightCom = observer(() => {
  const HLYBStore = useStore();

  return (
    <div className="right-outer">
      <div className="common-header-outer">
        <PanelHeader title={'村镇风险统计'} />
        {/* <PanelHeader title={'村落风险统计'} OperationFc={<OperationCom />} /> */}
      </div>
      <div className="right-content">
        <VillageList
          villageList={HLYBStore.currCase.villageRiskList}
          filterByRiskLevel={() => {}}
          clickVillageFunc={id => {
            HLYBStore.currModalObj.type = 'village';
            HLYBStore.currModalObj.id = id;
            let list = GlobalStore.getVillageItemById(id);
            GlobalStore.map?.flyTo({
              center: [list[0].longitude, list[0].latitude],
              zoom: MAPBOX_DEFAULT_CONFIG.maxZoom,
              pitch: 0
            });
            // GlobalStore.mapboxLayer?.updateBottom(GlobalStore.map);
          }}
        />
      </div>
    </div>
  );
});

/**
 * 标题栏目的右上角操作栏目
 * @returns
 */
const OperationCom = () => {
  return (
    <img
      src={IMG_PATH.layout.bigger}
      style={{ position: 'absolute', right: '20rem', cursor: 'pointer' }}
    />
  );
};

export { HLYBRightCom };
