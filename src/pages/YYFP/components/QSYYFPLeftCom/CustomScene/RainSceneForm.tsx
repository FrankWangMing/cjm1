import React, { useContext, useState } from 'react';
import { RainSceneFormWrapper } from '@/pages/YYFP/components/QSYYFPLeftCom/style';
import { Button, Form, FormProps, SelectProps, Space } from 'antd';
import {
  DoubleRightOutlined,
  MinusSquareOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  RainingInput,
  RiverSelector
} from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/style';
import { CustomSceneContext } from '@/pages/YYFP/components/QSYYFPLeftCom/CustomScene/CustomScene';
import RainfallIntensityChart from '../DesignScene/RainfallIntensity/RainfallIntensityChart';
import { ConfigType, riverOption, riverRainInitData, RiverType } from './const';

function RainSceneForm() {
  const { riverRainData, setRiverRainData } = useContext(CustomSceneContext); // 降雨场景数据
  const [form] = Form.useForm();
  const [showChart, setShowChart] = useState<boolean>(false); // 是否展示图表
  const [configType, setConfigType] = useState<ConfigType>('all'); // 默认全流域设置
  const [currentRiver, setCurrentRiver] = useState<RiverType>('沁河'); // 分流域默认选中流域

  const [allRainData, setAllRainData] = useState([0, 0, 0]); // 全流域数据值
  const [chartData, setChartData] = useState([]); // 降雨图表

  // 更新表单数据
  const updateFormValue = value => {
    form.setFieldsValue({
      rain: value, // 小时降雨具体值
      rainDuration: value.length, // 降雨时长
      // 总降雨量
      rainFall: value.reduce((pre, cur) => {
        return pre + cur;
      }, 0)
    });
  };

  const updateChartValue = value => {
    const data =
      value.map((v, i) => ({
        time: i + 1,
        value: v
      })) ?? [];
    setChartData(data);
  };

  // 切换流域设置
  const handleClickConfigSelector = (type: ConfigType) => {
    setConfigType(type);
    // 切换全流域form表单赋值给指定数据
    // 切换分流域form表单赋值给选中流域数据
    const value = type === 'all' ? allRainData : riverRainData[currentRiver];
    updateFormValue(value);

    if (showChart) {
      updateChartValue(value);
    }
  };

  // 选中分流域值
  const handleRiverChange: SelectProps['onChange'] = value => {
    setCurrentRiver(value);
    updateFormValue(riverRainData[value]);
    if (showChart) {
      updateChartValue(riverRainData[value]);
    }
  };

  // 确认事件
  const handleClickConfirm = () => {
    const value =
      configType === 'all' ? allRainData : riverRainData[currentRiver];
    // 更新图表数据
    updateChartValue(value);
    setShowChart(true);
  };

  // 表单数据更新保存
  const handleFormValuesChange: FormProps['onValuesChange'] = changedValues => {
    const changedKey = Object.keys(changedValues)[0];
    const value = form.getFieldValue(changedKey);
    // 降雨量和总降雨量赋值
    form.setFieldsValue({
      rainDuration: value.length,
      rainFall: value.reduce((pre, cur) => {
        return pre + cur;
      }, 0)
    });
    // 全流域
    if (configType === 'all') {
      setAllRainData(value);
      const obj = { ...riverRainData };
      Object.keys(riverRainData).forEach(key => {
        obj[key] = value;
      });
      setRiverRainData(obj);
    } else {
      // 分流域
      const obj = { ...riverRainData };
      obj[currentRiver] = value;
      setRiverRainData(obj);
    }
  };

  // 重置
  const reset = () => {
    setAllRainData([0, 0, 0]);
    setRiverRainData(riverRainInitData);
    form.setFieldsValue({
      rain: [0, 0, 0],
      rainDuration: 0,
      rainFall: 0
    });
  };

  return (
    <RainSceneFormWrapper>
      <div className={'config-selector'}>
        <div
          className={configType === 'all' ? 'action' : ''}
          onClick={() => handleClickConfigSelector('all')}>
          全流域设置
        </div>
        <div
          className={configType === 'difference' ? 'action' : ''}
          onClick={() => handleClickConfigSelector('difference')}>
          分河流设置
        </div>
      </div>

      {showChart && (
        <>
          <div className="back-to-form" onClick={() => setShowChart(false)}>
            <DoubleRightOutlined style={{}} />
          </div>
          <RainfallIntensityChart data={chartData || []} />
        </>
      )}

      <Form
        className={showChart ? 'hide-line' : 'show-line'}
        form={form}
        onValuesChange={handleFormValuesChange}>
        {/* 流域选择 */}
        {configType === 'difference' && (
          <Form.Item className="river-selector" label={'流域选择'}>
            <RiverSelector
              value={currentRiver}
              options={riverOption}
              onChange={handleRiverChange}
            />
          </Form.Item>
        )}

        <Form.Item noStyle hidden={showChart}>
          <Form.List name="rain" initialValue={allRainData}>
            {(fields, operation) => (
              <>
                <div className="form-list-container">
                  {fields.map((field, index) => (
                    <Space key={field.key}>
                      <Form.Item
                        colon={false}
                        label={`第${index + 1}小时降雨`}
                        name={[field.name]}>
                        <RainingInput controls={false} addonAfter={'mm'} />
                      </Form.Item>
                      <MinusSquareOutlined
                        className={'icon'}
                        onClick={() => operation.remove(index)}
                      />
                    </Space>
                  ))}
                </div>
                <Button
                  className={'btn-add'}
                  icon={<PlusOutlined />}
                  onClick={() => operation.add(0)}
                  disabled={fields?.length >= 24}
                />
              </>
            )}
          </Form.List>
        </Form.Item>
        <Space>
          <Form.Item
            className="rain-time"
            label={'降雨时长'}
            name={['rainDuration']}
            initialValue={0}>
            <RainingInput disabled controls={false} addonAfter={'小时'} />
          </Form.Item>
          <Form.Item
            label={'总降雨量'}
            className="rain-total"
            name={['rainFall']}
            initialValue={0}>
            <RainingInput disabled controls={false} addonAfter={'mm'} />
          </Form.Item>
        </Space>

        {!showChart && (
          <div className={'container-btn'}>
            <Form.Item>
              <div className={'btn-reset'} onClick={() => reset()}>
                重置
              </div>
            </Form.Item>
            <Form.Item>
              <div className={'btn-submit'} onClick={handleClickConfirm}>
                确认
              </div>
            </Form.Item>
          </div>
        )}
      </Form>
    </RainSceneFormWrapper>
  );
}

export default RainSceneForm;
