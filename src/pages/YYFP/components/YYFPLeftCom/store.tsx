/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 */
import { createStore } from '@/utils/store';
import { Form, FormInstance } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useLocalStore } from 'mobx-react-lite';

export function useModel() {
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const store = useLocalStore(
    (): {
      /**
       * 选中的水位线
       */
      selectedWaterLine: CheckboxValueType[];
      setSelectedWaterLine: Function;
      /**
       * 水位线激活的key，‘1'激活；''未激活
       */
      waterLineActiveKey: string;
      /**
       * 表单options
       */
      options: {
        '2': {
          rainfallScene: { label: string; value: number }[];
          rainfallIntensity: { label: string; value: number }[];
          rainDuration: { label: string; value: number }[];
          waterLine: { label: string; value: number }[];
          isOk: boolean;
        };
        '3': {
          rainfallScene: { label: string; value: number }[];
          rainfallIntensity: { label: string; value: number }[];
          rainDuration: { label: string; value: number }[];
          isOk: boolean;
        };
      };
      /**
       * 表单
       */
      form3: FormInstance;
      form2: FormInstance;
      /**
       * 表单选中情况发生变化
       */
      handleFormChange: Function;
      /**
       * 表单内容回填
       */
      handleInputBackTrace: Function;
    } => ({
      selectedWaterLine: [],
      setSelectedWaterLine(e) {
        this.selectedWaterLine = e;
        // TODO: 添加表单变化响应事件;
      },
      waterLineActiveKey: '',
      options: {
        '2': {
          rainfallScene: [],
          rainfallIntensity: [],
          rainDuration: [],
          waterLine: [],
          isOk: false
        },
        '3': {
          rainfallScene: [],
          rainfallIntensity: [],
          rainDuration: [],
          isOk: false
        }
      },
      form2: form2,
      form3: form3,
      handleFormChange() {},
      handleInputBackTrace() {}
    })
  );
  return store;
}
const store = createStore(useModel);
export const Provider = store.Provider;
export const useStoreLeft = store.useStore;
