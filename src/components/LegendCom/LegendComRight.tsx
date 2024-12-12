/**
 * 右侧颜色图例
 */

import { PHYSICAL_KEYWORDS } from '@/utils/const';
import { useSafeState } from 'ahooks';
import styled from 'styled-components';
import { Radio, Space } from 'antd';
import { useEffect } from 'react';
import { ColorBar } from './ColorBar';
import { useUpdateEffect } from '@umijs/hooks';
import GlobalStore from '@/store';

/**
 * 仿真云图相关数据
 */
interface LegendComProp {
  hideAnimateRes?: boolean;
  handleLayersChange: Function;
  bottom?: string;
  currType?: string;
  dateType?: 'day' | 'week';
}
const color_map_render = {
  bgColor: {
    [PHYSICAL_KEYWORDS.水深]:
      'linear-gradient(180deg, #0000ff 0%, #0000cd 31%, #1e90ff 65%, #6aadec 100%)',
    [PHYSICAL_KEYWORDS.流速]:
      // #0001ff #07c0ff #ffea05 #fa5252 #ff0400
      // 0 0.75 1.5 2.25 3
      // 'linear-gradient(180deg,#fbdb14 0%,#fa1f0e 31%,#060b8d 65%,#0495fd 100%)',
      'linear-gradient(180deg,#ff0400 20%,#fa5252 40%,#ffea05 60%,#03ffe2 80%,#0017ff 100%)',
    // 'linear-gradient(180deg,#ff2900 10%,#c92a2a 20%,#e67700 50%,#4dabf7 75%,#1971c2 100%)',
    [PHYSICAL_KEYWORDS.最大水深]:
      'linear-gradient(180deg, #004DCC 0%, #004DCC 20%,#2673F2 20%, #2673F2 40%,#5980FF 40%, #5980FF 60%,#8099FF 60%,#8099FF 80%,#b3ccff 80%,#b3ccff 100%)',
    [PHYSICAL_KEYWORDS.历时]:
      'linear-gradient(180deg,#7a5a0d 0%,#7a5a0d 16.7%,#997819 16.7%,#997819 33.4%,#c3a046 33.4%,#c3a046 50.1%,#e0cc85 50.1%,#e0cc85 66.8%,#f2e0b3 66.8%,#f2e0b3 83.5%,#fff3bf 83.5%,#fff3bf 100%)'
  },
  valList: {
    [PHYSICAL_KEYWORDS.水深]: ['300', '200', '100', '50', '0'],
    [PHYSICAL_KEYWORDS.流速]: ['3', '2', '1', '0'],
    [PHYSICAL_KEYWORDS.最大水深]: ['∞', '300', '200', '100', '50', '0'],
    [PHYSICAL_KEYWORDS.历时]: ['24', '12', '6', '3', '2', '1', '0.5', '0']
  },
  unit: {
    [PHYSICAL_KEYWORDS.水深]: 'cm',
    [PHYSICAL_KEYWORDS.流速]: 'm/s',
    [PHYSICAL_KEYWORDS.最大水深]: 'cm',
    [PHYSICAL_KEYWORDS.历时]: 'h'
  }
};
const allLegends = [
  {
    key: '过程水深',
    value: PHYSICAL_KEYWORDS.水深,
    disable: false
  },
  {
    key: '过程流速',
    value: PHYSICAL_KEYWORDS.流速,
    disable: false
  },
  {
    key: '最大水深',
    value: PHYSICAL_KEYWORDS.最大水深,
    disable: false
  },
  {
    key: '淹没历时',
    value: PHYSICAL_KEYWORDS.历时,
    disable: false
  }
];
const LegendComRight: React.FC<LegendComProp> = ({
  hideAnimateRes = false,
  handleLayersChange,
  currType = '',
  bottom,
  dateType = 'day'
}: LegendComProp) => {
  const [allCloudLayer, setAllCloudLayer] = useSafeState(allLegends);
  const [type, setType] = useSafeState('WATER DEPTH');
  const handleTypeChange = e => {
    handleLayersChange(e);
    setType(e);
  };
  const [value, setValue] = useSafeState(allCloudLayer[0].value);
  const handleValueChange = e => {
    setValue(e.target.value);
    handleTypeChange(e.target.value);
    GlobalStore.mapboxLayer?.updateBottomDebounce();
  };
  useEffect(() => {
    if (currType != '') {
      setType(currType);
      setValue(currType);
    }
  }, [currType]);

  useEffect(() => {
    if (hideAnimateRes) {
      setAllCloudLayer([allLegends[2], allLegends[3]]);
      setType(PHYSICAL_KEYWORDS.最大水深);
      setValue(allLegends[2].value);
      handleLayersChange(PHYSICAL_KEYWORDS.最大水深);
    }
  }, [hideAnimateRes]);

  return (
    <LegendComRightWrapper bottom={bottom}>
      <div className="legend-outer">
        <div className="color-select-outer">
          <Radio.Group onChange={handleValueChange} value={value}>
            <Space direction="vertical">
              {allCloudLayer.map((item, index) => {
                return (
                  <Radio key={index} disabled={item.disable} value={item.value}>
                    {item.key}
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        </div>
        <div className="divide-line"></div>
        {currType == PHYSICAL_KEYWORDS.历时 && dateType == 'week' ? (
          <ColorBar
            type={type}
            unit="天"
            numList={['>7', '7', '3', '1', '0.5', '0']}
            lineBgColor={color_map_render.bgColor[PHYSICAL_KEYWORDS.历时]}
            handleTypeChange={handleTypeChange}
            keyValList={allCloudLayer}
          />
        ) : (
          <ColorBar
            type={type}
            unit={color_map_render.unit[type]}
            numList={color_map_render.valList[type]}
            lineBgColor={color_map_render.bgColor[type]}
            handleTypeChange={handleTypeChange}
            keyValList={allCloudLayer}
          />
        )}
      </div>
    </LegendComRightWrapper>
  );
};

const LegendComRightWrapper = styled.div<{ bottom: string }>`
  .legend-outer {
    min-width: 120rem;
    background-image: linear-gradient(
      180deg,
      rgba(0, 5, 17, 0.5) 0%,
      #282c35 100%
    );
    border-radius: 8px;
    position: absolute;
    bottom: 120rem;
    right: 20rem;
    .color-select-outer {
      width: 100%;
      padding-top: 20rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15rem;
      .ant-radio-wrapper {
        margin: 0;
        font-family: AlibabaPuHuiTiM;
        font-size: 14rem;
        color: #ffffff;
      }
      .ant-radio-inner {
        background-color: rgba(1, 1, 1, 0);
      }
      .ant-radio-inner::after {
        background-color: #fff;
      }
      .ant-radio-checked .ant-radio-inner {
        border-color: #fff;
      }
      .ant-radio-disabled + span {
        color: #c3c3c3;
      }
    }
    .divide-line {
      width: 100%;
      border-bottom: 1rem dashed #fff;
    }
  }
`;

export { LegendComRight };
