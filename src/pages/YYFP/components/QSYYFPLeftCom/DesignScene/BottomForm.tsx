import { useContext, useEffect } from 'react';
import { Form, FormInstance } from 'antd';
import {
  FormWrapper,
  RainSceneFormInput
} from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import { DesignSceneContext } from '@/pages/YYFP/components/QSYYFPLeftCom/DesignScene/DesignScene';

interface BottomFormProps {
  form?: FormInstance;
}

function BottomForm(props: BottomFormProps) {
  const { form } = props;
  const { currentSceneData } = useContext(DesignSceneContext);

  useEffect(() => {
    form?.setFieldsValue({
      rainSum: currentSceneData?.rainSum,
      sceneDuration: currentSceneData?.sceneDuration,
      rainDuration: currentSceneData?.rainDuration
    });
  }, [currentSceneData]);

  return (
    <FormWrapper
      layout={'inline'}
      size={'small'}
      wrapperCol={{
        span: 12
      }}
      form={form}>
      <Form.Item label={'降雨时长'} name={'rainDuration'}>
        <RainSceneFormInput
          disabled
          controls={false}
          formatter={value => `${value}小时`}
        />
      </Form.Item>
      <Form.Item label={'预演时长'} name={'sceneDuration'}>
        <RainSceneFormInput
          disabled
          controls={false}
          formatter={value => `${value}小时`}
        />
      </Form.Item>
      <Form.Item label={'总降雨量'} name={'rainSum'}>
        <RainSceneFormInput
          disabled
          controls={false}
          formatter={value => `${value}mm`}
        />
      </Form.Item>
    </FormWrapper>
  );
}

export default BottomForm;
