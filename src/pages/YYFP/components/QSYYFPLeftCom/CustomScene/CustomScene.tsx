import { createContext, useContext, useState } from 'react';
import {
  CustomSceneWrapper,
  LeftBottomBtn
} from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import RainScene from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/RainScene';
import ReservoirScene from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/ReservoirScene';
import { QSYYFPLeftContext } from '@/pages/YYFP/components/QSYYFPLeftCom';
import { PreviewServer } from '@/service';
import { Form, FormInstance, message } from 'antd';
import { ReservoirSceneFormData } from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/ReservoirSceneForm';
import { useStore } from '@/pages/YYFP/store';
import { observer } from 'mobx-react-lite';
import { riverRainInitData, RiverType } from './const';

type RiverRainDataType = Partial<Record<RiverType, number[]>>;

interface CustomSceneContextValues {
  riverRainData: RiverRainDataType;
  setRiverRainData: (newData: RiverRainDataType) => void;
  reservoirSceneForm?: FormInstance<ReservoirSceneFormData>;
}

export const CustomSceneContext = createContext<CustomSceneContextValues>({
  riverRainData: riverRainInitData,
  setRiverRainData: () => {}
});

function CustomScene() {
  const YYFPStore = useStore();

  const { setShowList } = useContext(QSYYFPLeftContext);

  const [reservoirSceneForm] = Form.useForm();
  const [riverRainData, setRiverRainData] =
    useState<RiverRainDataType>(riverRainInitData); // 降雨场景数据

  const fuck = (u: number | string) => {
    if (typeof u === 'string') {
      return Number(u.split('-')[0]);
    }
    return u;
  };

  const handleSubmit = async () => {
    try {
      if (riverRainData !== riverRainInitData) {
        // 降雨场景保存数据
        const rainDuration: number[] = [];
        const rainFall: number[] = [];
        Object.keys(riverRainData).forEach(key => {
          const length = riverRainData[key].length;
          const count = riverRainData[key].reduce((pre, cur) => {
            return pre + cur;
          }, 0);
          rainDuration.push(length);
          rainFall.push(count);
        });

        console.log('降雨场景保存', riverRainData, rainDuration, rainFall);

        // 水库场景表单数据
        const reservoirSceneFormData = reservoirSceneForm.getFieldsValue();
        const reservoirSceneFormDataKeys = Object.keys(reservoirSceneFormData);
        const reservoirSceneFormDataObjValues = Object.values(
          reservoirSceneFormData
        ).map((v, i) => {
          return {
            [reservoirSceneFormDataKeys[i]]: fuck(v as any)
          };
        });
        const reservoir = Object.assign({}, ...reservoirSceneFormDataObjValues);

        console.log('水库场景表单数据', reservoir);
        // todo 目前没有接口
        // await PreviewServer.customCalculate({
        //   rainDuration: rainDuration,
        //   rainFall: rainFall,
        //   rainProcess: riverRainData,
        //   rainScene: 2,
        //   waterLevel: reservoir
        // });
        message.success('提交任务成功！');
      } else {
        message.info('请先完善降雨场景！');
      }
    } catch (e) {
      message.error('计算提交失败！');
    }
  };

  return (
    <CustomSceneContext.Provider
      value={{
        riverRainData,
        setRiverRainData,
        reservoirSceneForm: reservoirSceneForm
      }}>
      <CustomSceneWrapper>
        <RainScene />
        <ReservoirScene />
        <LeftBottomBtn
          $disabled={YYFPStore.resultLoading}
          onClick={handleSubmit}
          style={{
            ...bottomButtonStyle,
            bottom: '68rem'
          }}>
          {YYFPStore.resultLoading ? '实时预演计算中…' : '开始实时预演'}
        </LeftBottomBtn>
        <LeftBottomBtn
          onClick={() => setShowList(true)}
          style={{
            ...bottomButtonStyle,
            bottom: '20rem'
          }}>
          仿真预演列表
        </LeftBottomBtn>
      </CustomSceneWrapper>
    </CustomSceneContext.Provider>
  );
}

const bottomButtonStyle = {
  position: 'absolute',
  left: '30rem'
};

export default observer(CustomScene);
