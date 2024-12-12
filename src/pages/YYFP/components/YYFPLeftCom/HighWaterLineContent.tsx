import { Form, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStoreLeft } from './store';
import { FormItemOuter } from './FormItemOuter';
import { useStore } from '../../store';
import { SelectWaterCom } from './SelectWaterCom';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';

const HighWaterLineContent = observer(() => {
  const YYFPStore = useStore();
  const leftStore = useStoreLeft();
  const [currRainSceneType, setCurrRainSceneType] = useSafeState<number>(0);
  const [form] = Form.useForm();
  useEffect(() => {
    message.info('高水位数据');
  }, []);
  return (
    <>
      <SelectWaterCom />
      <Form
        form={leftStore.form2}
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
          options={leftStore.options[2].rainfallScene}
        />
        {/* 设计暴雨天气 */}
      </Form>
    </>
  );
});
export { HighWaterLineContent };
