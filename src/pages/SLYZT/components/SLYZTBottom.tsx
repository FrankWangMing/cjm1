import { useSafeState } from 'ahooks';

interface Props {
  handleLayerTypeChange: Function;
}

const SLYZTBottom: React.FC<Props> = ({ handleLayerTypeChange }: Props) => {
  let layerList = [
    {
      key: 'yuliang',
      title: '雨量站'
    },
    {
      key: 'shuiwei',
      title: '水位站'
    },
    {
      key: 'jiankong',
      title: '视频监控'
    },
    {
      key: 'shuiku',
      title: '水库'
    },
    {
      key: 'difang',
      title: '堤防'
    },
    {
      key: 'shantang',
      title: '山塘'
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

  return (
    <div className="center-bottom-outer">
      {layerList.map(item => {
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
export { SLYZTBottom };
