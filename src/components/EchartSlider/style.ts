/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-09-29 18:30:18
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-12 14:31:43
 * @FilePath: \cae01\qs-watershed\frontend\src\components\EchartSlider\style.ts
 */
import styled from 'styled-components';
export const Wrapper = styled.div`
  padding-bottom: 10rem;
  .sliderContainer {
    width: ${props=>props.width?props.width+'rem':400+'rem'};
    padding: 0rem 30rem 10rem 30rem;
    height: 40rem;
    background-image: url(${props =>
      props.background ? props.background : null});
    background-size: contain; /* 背景图片保持比例，完整展示 */
    background-position: center; /* 背景图片居中显示 */
    background-repeat: no-repeat; /* 不重复背景图片 */
  }
  .custom-range {
    -webkit-appearance: none; /* 隐藏默认样式 */
    width: 100%; /* 设置宽度 */
    background: #ffffff; /* 滑道的背景颜色 */
    border-radius: 1px; /* 滑道的圆角 */
    height: 4rem;
    opacity: 0.42;
  }

  /* 滑块样式 - WebKit 浏览器 */
  .custom-range::-webkit-slider-thumb {
    -webkit-appearance: none; /* 隐藏默认样式 */
    width: 25rem; /* 滑块宽度 */
    height: 10rem; /* 滑块高度 */
    cursor: pointer; /* 鼠标*/
    background: #50fdff;
    border-radius: 1px;
  }
`;
