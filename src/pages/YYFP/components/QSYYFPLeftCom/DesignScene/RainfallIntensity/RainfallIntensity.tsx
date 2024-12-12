import { useContext } from 'react';
import {
  RainfallIntensityWrapper,
  SubtitleWrapper
} from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import RainfallIntensitySelector from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/RainfallIntensity/RainfallIntensitySelector';
import RainfallIntensityChart from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/RainfallIntensity/RainfallIntensityChart';
import { DesignSceneContext } from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/DesignScene';
import { useStore } from '@/pages/YYFP/store';
import dayjs from 'dayjs';
/**
 * 降雨强度
 * @param props
 * @constructor
 */
function RainfallIntensity() {
  const { previewData, currentSceneId, setCurrentSceneId, currentSceneData } =
    useContext(DesignSceneContext);

  const options = previewData?.sceneList.map(v => {
    return {
      label: v.sceneName,
      value: v.sceneId
    };
  });

  const YYFPStore = useStore();

  return (
    <RainfallIntensityWrapper>
      <SubtitleWrapper>降雨场景</SubtitleWrapper>
      {/* 年份选择 */}
      <RainfallIntensitySelector
        options={options || []}
        value={currentSceneId}
        onChange={value => {
          YYFPStore.resultLoading = null;
          // console.log(value);
          setCurrentSceneId?.(value);
        }}
      />
      {/* 降雨柱状图 */}
      <RainfallIntensityChart
        data={
          currentSceneData?.customRain.map(item => {
            return {
              ...item,
              time: dayjs(item.time).hour()
            };
          }) || []
        }
      />
    </RainfallIntensityWrapper>
  );
}

export default RainfallIntensity;
