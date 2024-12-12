import { ISection } from '@/domain/section';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';
import { YYFPSectionChart } from '../YYFPSectionChart';

interface YYFPSectionModalContentProps {
  data1: ISection;
  data2: ISection;
  waterLine: string[];
}

const YYFPSectionModalContent = ({
  data1,
  data2,
  waterLine
}: YYFPSectionModalContentProps) => {
  const [rainValue, setRainValue] = useSafeState<
    {
      time: string;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    if (data1?.data.length == 0) {
      return;
    } else {
      let tempRainValue: {
        time: string;
        value: number;
      }[] = [];
      data1.data.map((item, index) => {
        tempRainValue.push({ time: item.time, value: item.rainfall });
      });
      setRainValue(tempRainValue);
    }
  }, [data1]);
  return (
    <YYFPSectionChart
      waterLine={waterLine}
      rainValue={rainValue}
      data2={data2}
      data1={data1}
    />
  );
};
export { YYFPSectionModalContent };
