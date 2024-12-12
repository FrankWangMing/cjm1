import ReactECharts from 'echarts-for-react';
import ReactEChartsRef from 'echarts-for-react';
import { useRef, useEffect } from 'react';
import GlobalStore from '@/store';

const RainLineChart = ({ handleSaveChart }) => {
  const chartRef = useRef<ReactEChartsRef>(null);

  useEffect(() => {
    // 组件挂载后，你可以获取 ECharts 实例
    const getChartInstance = async () => {
      if (chartRef.current) {
        // console.log('ECharts 实例：', chartRef.current.getEchartsInstance());
        const echartsInstance = chartRef.current.getEchartsInstance();
        if (echartsInstance && GlobalStore.briefDataStash) {
          // 调用 getDataURL 方法
          // console.log(echartsInstance.getDataURL());
          const dataUrl = echartsInstance.getDataURL();
          // 存储Base64编码的URL，用于后续保存图片的接口参数
          handleSaveChart(dataUrl);
        }
      }
    };
    getChartInstance();
  }, [chartRef]);
  return (
    <div className="water-rain">
      <ReactECharts
        ref={chartRef}
        style={{
          width: '100%',
          height: '100%'
        }}
        option={{
          animation: false, // 关闭动画
          grid: {
            containLabel: true,
            top: 30,
            left: 10,
            right: 10,
            bottom: 0
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [1, 2, 3, 4, 5, 6],
            axisLabel: {
              formatter: function (value) {
                return value + 'h';
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '流量（m³/s）',
            nameTextStyle: {
              align: 'center',
              lineHeight: 10
            }
          },
          series: [
            {
              data: [1000, 1932, 1901, 2934, 2090, 1530],
              type: 'line',
              smooth: true,
              symbol: 'none', // 去掉小圆点
              areaStyle: {}
            }
          ]
        }}
      />
    </div>
  );
};

export default RainLineChart;
