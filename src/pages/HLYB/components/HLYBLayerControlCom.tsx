import { useSafeState } from 'ahooks';
import { useEffect } from 'react';

/**
 * 洪涝预报图层控制组件
 * @param param0
 * @returns
 */
interface IProps {
  handleLayerTypeChange: Function;
  currLayers: string[];
}
const HLYBLayerControlCom = ({ handleLayerTypeChange, currLayers }: IProps) => {
  let layerList = [
    {
      key: 'village',
      title: '重要防灾村落'
    },
    {
      key: 'section',
      title: '防洪控制断面'
    },
    {
      key: 'risk',
      title: '洪水风险图'
    }
  ];
  const [selected, setSelected] = useSafeState<string[]>([]);
  const handleClick = e => {
    let resultList = [...selected];
    if (resultList.includes(e)) {
      resultList = resultList.filter(item => {
        return item != e;
      });
    } else {
      resultList.push(e);
    }
    setSelected(resultList);
    handleLayerTypeChange(resultList);
  };

  useEffect(() => {
    setSelected(currLayers);
  }, [currLayers]);

  return (
    <div className="center-bottom-outer">
      {layerList?.map(item => {
        return (
          <div
            key={item.key}
            className={[
              'center-bottom-item',
              selected.indexOf(item.key) != -1
                ? 'center-bottom-item_active'
                : ''
            ].join(' ')}
            onClick={() => {
              handleClick(item.key);
            }}>
            {item.title}
          </div>
        );
      })}
    </div>
  );
};

export { HLYBLayerControlCom };
