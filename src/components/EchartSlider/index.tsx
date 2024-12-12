/**
 * Author: jamie
 * Date: 2024-10-12
 * componentsName:EchartSlider
 * Description: echart组件dataZoom封装，用于实现自定义左右滑动条
 * rangeToUse:1.精准预报/气象降雨预报模块
 */
import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from './style';
interface IProps {
  data: any;
  chartRef: any;
  start: number;
  end?: number;
  onReady: boolean;
  visibleCount: number;
  background: string;
  width?: number;
}
const EchartSlider: React.FC<IProps> = ({
  data,
  chartRef,
  start,
  end,
  onReady,
  visibleCount,
  width,
  background
}) => {
  const [isDragging, setIsDragging] = useState(false);
  // 定义初始的显示范围
  const [startIndex, setStartIndex] = useState(start);
  useEffect(() => {
    if (data.length > 0) {
      if (chartRef.current) {
        if (onReady) {
          // 调用 ECharts 实例的方法，确保不会报错
          chartRef.current.getEchartsInstance().dispatchAction({
            type: 'dataZoom',
            startValue: startIndex, // 以标签为起点
            endValue: startIndex + visibleCount - 1 // 限制显示范围为可见数据
          });
        }
      }
    }
  }, [isDragging, startIndex, onReady]); // 依赖于 visibleData 变化
  // useEffect(() => {
  //   if (data.length > 0) {
  //     if (chartRef.current) {
  //       if (onReady) {
  //         // 调用 ECharts 实例的方法，确保不会报错
  //         chartRef.current.getEchartsInstance().dispatchAction({
  //           type: 'dataZoom',
  //           startValue: startIndex, // 以标签为起点
  //           endValue: startIndex + visibleCount - 1 // 限制显示范围为可见数据
  //         });
  //       }
  //     }
  //   }

  //   // return () => {
  //   //   chartRef.current.dispose();
  //   // };
  // }, [isDragging, startIndex, endIndex, onReady]); // 依赖于 visibleData 变化

  const handleStartChange = e => {
    const newStart = Math.min(e.target.value, data.length - visibleCount); // 确保 start 不大于 end
    setIsDragging(!isDragging);
    setStartIndex(newStart);
  };
  return (
    <Wrapper background={background} width={width}>
      <div className="sliderContainer">
        <input
          className="custom-range"
          type="range"
          min="0"
          max={data.length - visibleCount} // 最大值为数据长度 - 1
          value={startIndex}
          onChange={handleStartChange}
        />
      </div>
    </Wrapper>
  );
};

export default EchartSlider;
