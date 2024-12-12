import React, { useContext } from 'react';
import {
  ReservoirWrapper,
  SubtitleWrapper
} from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import { DesignSceneContext } from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/DesignScene';

const reservoirTag = [
  {
    name: '云首水库',
    tag: 'ys'
  },
  {
    name: '下泊水库',
    tag: 'xb'
  },
  {
    name: '山泽水库',
    tag: 'sz'
  }
];

function Reservoir() {
  const { currentSceneData } = useContext(DesignSceneContext);

  return (
    <ReservoirWrapper>
      {/* 设计情景 */}
      <SubtitleWrapper>水库场景</SubtitleWrapper>
      <div className={'list-header'}>
        <span>水库名称</span>
        <span>起始库水位</span>
      </div>
      <div className={'list-content-container'}>
        {Object.keys(currentSceneData?.reservoirInfo || {})?.map(
          (key: string, i) => (
            <div key={i} className={'list-item'}>
              <span>{reservoirTag.find(v => v.tag === key)?.name}</span>
              <span>
                汛限水位: {currentSceneData?.reservoirInfo?.[key].toFixed(2)}mm
              </span>
            </div>
          )
        )}
      </div>
    </ReservoirWrapper>
  );
}

export default Reservoir;
