import React, { useContext, useState } from 'react';
import RainfallIntensity from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/RainfallIntensity/RainfallIntensity';
import Reservoir from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/Reservoir';
import BottomForm from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/BottomForm';
import { LeftBottomBtn } from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import { QSYYFPLeftContext } from '@/pages/YYFP/components/QSYYFPLeftCom';
import { Form } from 'antd';
import { useRequest } from 'ahooks';
import { PreviewScenesRes, PreviewServer, SceneListItem } from '@/service';
import { useStore } from '@/pages/YYFP/store';
import { observer } from 'mobx-react-lite';
import { previewData } from '../mock';

interface DesignSceneContextValues {
  previewData?: PreviewScenesRes;
  currentSceneData?: SceneListItem;
  currentSceneId?: number;
  setCurrentSceneId?: (currentSceneId: number) => void;
}

export const DesignSceneContext = React.createContext<DesignSceneContextValues>(
  {}
);

function DesignScene() {
  const YYFPStore = useStore();

  const { setShowList, handlePreviewResult } = useContext(QSYYFPLeftContext);

  const [bottomForm] = Form.useForm();

  // todo 降雨场景接口
  // const { data: previewData = { sceneList: [] } } = useRequest(
  //   PreviewServer.previewScenes
  // );

  const [currentSceneId, setCurrentSceneId] = useState<number>(1);

  const currentSceneData = previewData?.sceneList.find(
    v => v.sceneId === currentSceneId
  );
  const handleStartPreview = async () => {
    // 动态获取场景ID
    const projectId = currentSceneData?.projectId || 0;
    // todo 获取预演结果时间修改
    await handlePreviewResult?.(
      '2023-01-01 00:00:00',
      '2023-01-02 00:00:00',
      projectId,
      5
    );
  };

  return (
    <DesignSceneContext.Provider
      value={{
        previewData,
        currentSceneData,
        currentSceneId,
        setCurrentSceneId
      }}>
      <div>
        <RainfallIntensity />
        <Reservoir />
        <BottomForm form={bottomForm} />
        <LeftBottomBtn
          $disabled={!!YYFPStore.resultLoading}
          onClick={handleStartPreview}
          style={{
            ...bottomButtonStyle,
            bottom: '68rem'
          }}>
          {YYFPStore.resultLoading === null
            ? '查看预演结果'
            : YYFPStore.resultLoading
            ? '预演结果加载中…'
            : '预演结果已加载'}
        </LeftBottomBtn>
        <LeftBottomBtn
          onClick={() => setShowList(true)}
          style={{
            ...bottomButtonStyle,
            bottom: '20rem'
          }}>
          仿真预演列表
        </LeftBottomBtn>
      </div>
    </DesignSceneContext.Provider>
  );
}

const bottomButtonStyle = {
  position: 'absolute',
  left: '30rem'
};

export default observer(DesignScene);
