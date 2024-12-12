import React from 'react';
import { SubtitleWrapper } from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import ReservoirSceneForm from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/ReservoirSceneForm';

function ReservoirScene() {
  return (
    <div>
      {/* 自定义情景 */}
      <SubtitleWrapper>水库场景</SubtitleWrapper>
      <ReservoirSceneForm />
    </div>
  );
}

export default ReservoirScene;
