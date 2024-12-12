import { useContext, useRef, useState } from 'react';
import { ReservoirSceneFormWrapper } from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import { Divider, Form, InputNumberProps, Select, SelectProps } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import {
  WaterLevelSelectWrapper,
  WaterLevelInputNumberWrapper
} from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/style';
import { CustomSceneContext } from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/CustomScene';

interface WaterLevel extends Record<string, string | number> {
  min: string | number;
  middle: string | number;
  max: string | number;
  normal: string | number;
}

const waterLevels: Record<string, WaterLevel> = {
  ShanZe: {
    min: 790.8,
    max: 801.5,
    middle: 796.66,
    normal: 800.16,
    high: 803.42
  },
  YunShou: {
    min: 780.1,
    max: 791.45,
    middle: 786.7,
    normal: 790.2,
    high: 793.87
  },
  XiaBo: {
    min: 950.38,
    max: 961.1,
    middle: 956.6,
    normal: 960.16,
    high: 962.88
  }
};

const waterLevelName: Record<string, string> = {
  min: '死水位', //
  max: '设计洪水位', //
  middle: '汛限水位', //
  normal: '正常蓄水位', //
  high: '防洪高水位' //校核洪水位
};

const waterLevelToOptions = (
  waterLevel: WaterLevel
): SelectProps['options'] => {
  // 重复水位处理
  const fuck = (u: number | string) => {
    if (typeof u === 'string') {
      return Number(u.split('-')[0]);
    }
    return u;
  };

  return Object.keys(waterLevel).map(v => {
    return {
      label: waterLevelName[v] + ': ' + fuck(waterLevel[v]) + ' mm',
      value: waterLevel[v],
      key: waterLevelName[v]
    };
  });
};

interface WaterLevelSelectProps {
  waterLevel: WaterLevel;
  value?: number;
  onChange?: (value: number) => {};
}

const WaterLevelSelect = (props: WaterLevelSelectProps) => {
  const { waterLevel, onChange, value } = props;

  const [extraOptions, setExtraOptions] = useState<SelectProps['options']>([]);

  const options = waterLevelToOptions(waterLevel) || [];

  const inputRef = useRef<number>();

  const triggerChange = (changedValue: number) => {
    onChange?.(changedValue || 0);
  };

  const handleClickOk = (value: string) => {
    setExtraOptions([
      {
        label: value + ' mm',
        value: +value
      }
    ]);
    triggerChange(Number(value));
  };

  const handleInputChange: InputNumberProps<number>['onChange'] = value => {
    if (value) {
      inputRef.current = value;
    }
  };

  return (
    <WaterLevelSelectWrapper
      placeholder={'请输入'}
      onChange={(value, option) => {
        triggerChange(value as number);
      }}
      value={value}
      dropdownRender={menu => {
        return (
          <>
            <WaterLevelInputNumberWrapper
              placeholder={`其他水位(${waterLevel.min} - ${waterLevel.max})`}
              onChange={handleInputChange}
              addonAfter={
                <CheckOutlined
                  onClick={() => handleClickOk(String(inputRef.current))}
                />
              }
              onPressEnter={() => handleClickOk(String(inputRef.current))}
              min={waterLevel.min}
              max={waterLevel.max}
            />
            <Divider style={{ margin: '8px 0' }} />
            {menu}
          </>
        );
      }}>
      {options.map(v => {
        return (
          <Select.Option key={v.key} value={v.value}>
            {v.label}
          </Select.Option>
        );
      })}
      {extraOptions?.map(v => {
        return (
          <Select.Option
            key={v.value}
            value={v.value}
            style={{ display: 'none' }}>
            {v.label}
          </Select.Option>
        );
      })}
    </WaterLevelSelectWrapper>
  );
};

export interface ReservoirSceneFormData {
  ddc2: string;
  mishan: string;
  yechuan1: string;
  fushan1: string;
}

function ReservoirSceneForm() {
  const { reservoirSceneForm } = useContext(CustomSceneContext);

  return (
    <ReservoirSceneFormWrapper>
      <div className="title">
        <div>水库名称</div>
        <div>起始库水位</div>
      </div>
      <Form<ReservoirSceneFormData> colon={false} form={reservoirSceneForm}>
        <Form.Item
          label={'云首水库'}
          name={'ys'}
          initialValue={waterLevels.YunShou.middle}>
          <WaterLevelSelect waterLevel={waterLevels.YunShou} />
        </Form.Item>
        <Form.Item
          label={'下泊水库'}
          name={'xb'}
          initialValue={waterLevels.XiaBo.middle}>
          <WaterLevelSelect waterLevel={waterLevels.XiaBo} />
        </Form.Item>
        <Form.Item
          label={'山泽水库'}
          name={'sz'}
          initialValue={waterLevels.ShanZe.middle}>
          <WaterLevelSelect waterLevel={waterLevels.ShanZe} />
        </Form.Item>
      </Form>
    </ReservoirSceneFormWrapper>
  );
}

export default ReservoirSceneForm;
