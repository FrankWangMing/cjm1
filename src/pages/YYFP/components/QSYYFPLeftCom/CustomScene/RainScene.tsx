import {
  RainSceneWrapper,
  SubtitleWrapper
} from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import RainSceneForm from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/RainSceneForm';

function RainScene() {
  return (
    <RainSceneWrapper>
      <SubtitleWrapper>降雨场景</SubtitleWrapper>
      <RainSceneForm />
    </RainSceneWrapper>
  );
}

export default RainScene;
