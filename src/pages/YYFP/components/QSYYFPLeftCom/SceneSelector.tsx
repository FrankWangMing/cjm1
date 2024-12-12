import React, { useContext } from 'react';
import { SceneSelectorWrapper } from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import {
  QSYYFPLeftContext,
  QSYYFPLeftContextContent
} from '@/pages/YYFP/components/QSYYFPLeftCom';

function SceneSelector() {
  const { sceneType, setSceneType } = useContext(QSYYFPLeftContext);

  const getSelectorItemClassName = (
    key: QSYYFPLeftContextContent['sceneType']
  ) => {
    const className = ['selectorItem'];
    if (key === sceneType) {
      return className.concat('selected').join(' ');
    }
    return className.join(' ');
  };

  const designClassName = getSelectorItemClassName('design');
  const customClassName = getSelectorItemClassName('custom');

  return (
    <SceneSelectorWrapper>
      <div className={designClassName} onClick={() => setSceneType('design')}>
        设计情景
      </div>
      <div className={customClassName} onClick={() => setSceneType('custom')}>
        自定义情景
      </div>
    </SceneSelectorWrapper>
  );
}

export default SceneSelector;
