import { observer } from 'mobx-react-lite';
import ReactECharts from 'echarts-for-react';
import { graph } from './const';

const Component = observer(() => {
  return (
    <ReactECharts
      option={{
        title: {
          text: '知识图谱',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            // console.log(params);
            if (params.dataType === 'node') {
              let text = `<div>
                <span style="
                  display: inline-block;
                  width: 12rem;
                  height: 12rem;
                  background: ${params.color};
                  border-radius: 50%">
                </span>

                <span style="display: inline-block;margin-right: 10px;">
                  ${params.name}
                </span>

                <span style="font-weight: 900;">
                  ${params.value}
                </span>
              </div>`;
              return text;
            }
            if (params.dataType === 'edge') {
              return '属于';
            }
          }
        },
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        legend: [
          {
            // selectedMode: 'single',
            data: graph.categories.map(function (a) {
              return a.name;
            }),
            top: 30
          }
        ],
        series: [
          {
            type: 'graph',
            data: graph.nodes.map(node => {
              return {
                ...node,
                label: {
                  show: true
                }
              };
            }),
            links: graph.links,
            categories: graph.categories,
            label: {
              position: 'right'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            //高亮状态的图形样式。
            emphasis: {
              // adjacency 聚焦关系图中的邻接点和边的图形
              focus: 'adjacency',
              // 聚焦线条样式
              lineStyle: {
                width: 5
              }
            }
          }
        ]
      }}
      style={{
        width: '100%',
        height: '100%'
      }}
    />
  );
});
export default function Knowledge() {
  return <Component />;
}
