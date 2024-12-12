import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import GlobalStore from '@/store';
import { EnvironmentOutlined } from '@ant-design/icons';
import { WaterLevelForecastWapper } from './style';

/**
 * 右边的组件 - 水位预报
 */
const WaterLevelForecast = observer(() => {
  const YYFPStore = useStore();

  const handleClickSection = (data: any) => {
    if (YYFPStore.currModalObj.id == data.id) return;
    YYFPStore.currModalObj.type = 'section';
    YYFPStore.currModalObj.id = data?.id;
    GlobalStore.map?.flyTo({
      center: [data?.lng, data?.lat],
      zoom: 16,
      pitch: 0
    });
  };

  return (
    <WaterLevelForecastWapper>
      <table>
        <thead>
          <tr>
            <th>断面名称</th>
            <th>水位等级</th>
            <th>位置</th>
          </tr>
        </thead>
      </table>
      <div className={'table-container'}>
        <table>
          <tbody>
            {YYFPStore?.allSectionsInfo.map((v, i) => {
              return (
                <tr key={i} onClick={() => handleClickSection(v)}>
                  <td>{v.name}</td>
                  <td>{v.riskLevel ? '危险' : '安全'}</td>
                  <td>
                    <EnvironmentOutlined />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WaterLevelForecastWapper>
  );
});

export default WaterLevelForecast;
