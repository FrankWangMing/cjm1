import { observer } from 'mobx-react-lite';
import { YYFPLeftWrapper } from './style';
import { PanelHeader } from '@/components/Header';
import { SelectWaterCom } from './SelectWaterCom';
import { Provider, useStoreLeft } from './store';
import { useStore } from '../../store';
import { Form } from 'antd';
import { FormItemOuter } from './FormItemOuter';
import { PreviewServer } from '@/service';
import { useMount } from 'ahooks';
import { HighWaterLineContent } from './HighWaterLineContent';
import { ShortTimeRainContent } from './ShortTimeRainContent';
import { useEffect } from 'react';

const Component = observer(() => {
  const leftStore = useStoreLeft();
  const YYFPStore = useStore();
  /**
   * 获取所有select选项数据
   */
  const getOptions = async () => {
    if (!leftStore.options['2'].isOk || !leftStore.options['3'].isOk) {
      let sceneType = YYFPStore.currSceneType;
      const data = await PreviewServer.previewScenes(Number(sceneType));
      leftStore.options[sceneType].rainfallScene = data.conditions[0].options;
      leftStore.options[sceneType].rainfallIntensity =
        data.conditions[1].options;
      leftStore.options[sceneType].rainDuration = data.conditions[2].options;
      if (sceneType == '2')
        leftStore.options[2].waterLine = data.conditions[4].options.reverse();
      leftStore.options[sceneType].isOk = true;
    }
  };

  useEffect(() => {
    getOptions();
  }, [YYFPStore.currSceneType]);

  return (
    <YYFPLeftWrapper
      isHighWaterLevel={YYFPStore.currSceneType == '2'}
      isActivePanel={leftStore.waterLineActiveKey == '1'}>
      <div className="common-header-outer">
        <PanelHeader title={'情景设置'} />
      </div>
      <div className="operation-outer bg-content-area-alpha">
        {YYFPStore.currSceneType === '2' ? (
          <HighWaterLineContent />
        ) : (
          <ShortTimeRainContent />
        )}
      </div>
    </YYFPLeftWrapper>
  );
});

const YYFPLeftCom = () => {
  return (
    <Provider>
      <Component />
    </Provider>
  );
};

export { YYFPLeftCom };
