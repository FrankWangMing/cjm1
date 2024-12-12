/**
 * 预演复盘中间上方的数据
 */
import { CenterTop } from '@/components/LayoutsCom';
import SwitchTab from '@/components/SwitchTab';
import { observer } from 'mobx-react-lite';
import { SCENES_TYPE_LIST } from '../const';
import { useStore } from '../store';

const YYFPCenterTop: React.FC = observer(() => {
  const YYFPStore = useStore();
  return (
    <CenterTop
      children={
        <SwitchTab
          tabList={SCENES_TYPE_LIST}
          handleTypeChange={e => {
            YYFPStore.currSceneType = e;
          }}
          currType={YYFPStore.currSceneType + ''}
        />
      }
    />
  );
});

export { YYFPCenterTop };
