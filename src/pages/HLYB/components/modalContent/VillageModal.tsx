import { VillageMarkerModal } from '@/components/MarkerModal';
import { IVillageDetailRes } from '@/service/village';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';
import { MaxFlowSpeed } from './MaxFlowSpeed';
import { RiskChart } from './RiskChart';

/**
 * 洪涝预报村庄弹窗
 */
interface HLYBVillageModalProps {
  data: IVillageDetailRes;
  villageId: number;
  type?: string;
}
const HLYBVillageModalContent = ({
  data,
  villageId,
  type = 'hlyb'
}: HLYBVillageModalProps) => {
  const [tabList, setTabList] = useSafeState<
    {
      title: string;
      width: string;
      key: string;
      JsxContent: JSX.Element;
    }[]
  >([]);
  useEffect(() => {
    if (data?.riskLevel?.length > 0) {
      setTabList([
        {
          title: '风险',
          width: '120rem',
          key: 'risk',
          JsxContent: (
            <RiskChart
              data={data.riskLevel}
              xName={type != 'yyfp' ? '' : '历时（分钟/min）'}
            />
          )
        },
        {
          title: '最大淹没深度',
          width: '120rem',
          key: 'depth',
          JsxContent: (
            <MaxFlowSpeed
              // legendData={['最大水深', '平均水深']}
              legendData={['水深']}
              xName={type != 'yyfp' ? '' : '历时（分钟/min）'}
              yName={'水深（cm）'}
              unit="cm"
              fixedNum={1}
              // colorOfLine={['#79F9FF', '#3D6AC0']}
              colorOfLine={['#00CAFD']}
              data={data.deep}
            />
          )
        },
        {
          title: '最大流速',
          width: '120rem',
          key: 'flow',
          JsxContent: (
            <MaxFlowSpeed
              // legendData={['最大流速', '平均流速']}
              legendData={['最大流速']}
              xName={type != 'yyfp' ? '' : '历时（分钟/min）'}
              yName={'流速（m/s）'}
              unit="m/s"
              fixedNum={3}
              // colorOfLine={['#FFFC6D', '#3D6AC0']}
              colorOfLine={['#00CAFD']}
              data={data.velocity}
            />
          )
        }
      ]);
    } else {
      return;
    }
  }, [data]);
  return (
    <VillageMarkerModal
      villageInfo={data.info}
      tabList={tabList}
      villageId={villageId}
    />
  );
};

export { HLYBVillageModalContent };
