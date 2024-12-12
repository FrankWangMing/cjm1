import { Form } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStoreLeft } from './store';
import { FormItemOuter } from './FormItemOuter';
import { useStore } from '../../store';
import { SelectWaterCom } from './SelectWaterCom';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';

const ShortTimeRainContent = observer(() => {
  const YYFPStore = useStore();
  const leftStore = useStoreLeft();
  const [currRainSceneType, setCurrRainSceneType] = useSafeState<number>(0);

  return (
    <>
      <Form
        form={leftStore.form3}
        onChange={() => leftStore.handleFormChange()}>
        {/* 降雨场景 */}
        <FormItemOuter
          title="降雨场景"
          name="RainfallScene"
          onChange={e => {
            leftStore.handleInputBackTrace(e.target.value);
          }}
          onClick={() => {
            leftStore.waterLineActiveKey =
              leftStore.selectedWaterLine.length > 0 ? '' : '1';
          }}
          options={leftStore.options[3].rainfallScene}
        />
        {/* 设计暴雨天气 */}
      </Form>
    </>
  );
});
export { ShortTimeRainContent };
