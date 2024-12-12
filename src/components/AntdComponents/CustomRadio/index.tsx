/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-12 15:58:26
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-15 14:48:43
 * use :精准预报洪水预见期/智能预警-雨量站-水位站-河道流量站有用到
 * tip：不要修改这里面的样式，icon和width从外面传入
 */
// 自定义的button
import { RadioGroupProps, RadioProps } from 'antd';
import styled from 'styled-components';
import { Radio } from 'antd';
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  .radio-list {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
type CustomRadioGroupProps = RadioGroupProps;

export const CustomRadioGroup: React.FC<
  CustomRadioGroupProps & {
    className?: string;
  }
> = radioGroupProps => {
  return (
    <Wrapper>
      <Radio.Group {...radioGroupProps}></Radio.Group>
    </Wrapper>
  );
};

const RadioWrapper = styled.div`
  /* 隐藏未选中时的默认圆点 */
  .ant-radio-inner::after {
    display: none;
  }
  /* 选中状态下隐藏自定义图标 */
  .ant-radio-checked .ant-radio-inner::before {
    content: none;
  }

  /* 在未选中状态下插入自定义图标 */
  .ant-radio-inner {
    width: ${props => props.width + 'rem'}; /* 自定义图标大小 */
    height: ${props => props.width + 'rem'}; /* 自定义图标大小 */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent; /* 移除背景色 */
    border: none;
    background-image: url(${props =>
      props.innerIcon ? props.innerIcon : null});
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .ant-radio-checked .ant-radio-inner {
    width: ${props => props.width + 'rem'}; /* 自定义图标大小 */
    height: ${props => props.width + 'rem'}; /* 自定义图标大小 */
    background-image: url(${props =>
      props.checkedInnerIcon ? props.checkedInnerIcon : null});
  }
  .ant-radio-group {
    display: flex;
    /* height: ${props => props.width + 'rem'}; */
  }
  .ant-radio-wrapper {
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: DIN-BlackItalic, AlibabaPuHuiTiR;
    color: #fff;
    span.ant-radio + * {
      margin-top: 8rem;
    }
  }
  .ant-radio-wrapper::after {
    display: none;
  }
  .ant-radio-disabled .ant-radio-inner {
    background-color: transparent;
  }
  .splice-line {
    background: rgba(255, 255, 255, 0.24);
    border-radius: 2rem;
    width: 48rem;
    height: 2rem;
    margin: 0 6rem;
  }
`;
type CustomRadioProps = RadioProps;

export const CustomRadio: React.FC<
  CustomRadioProps & {
    innerIcon?: string; //未选中状态icon
    checkedInnerIcon?: string; //选中状态icon
    width: number;
  }
> = radioProps => {
  return (
    <RadioWrapper
      width={radioProps.width}
      innerIcon={radioProps.innerIcon}
      checkedInnerIcon={radioProps.checkedInnerIcon}>
      <Radio {...radioProps}></Radio>
    </RadioWrapper>
  );
};
