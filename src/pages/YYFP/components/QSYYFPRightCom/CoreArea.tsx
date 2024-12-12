import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { CoreAreaWapper } from './style';
import { Fragment } from 'react';
import { IMG_PATH } from '@/utils/const';

/**
 * 右边的组件 - 全域淹没情况概览
 */
const CoreArea = observer(() => {
  const YYFPStore = useStore();

  return (
    <CoreAreaWapper>
      <img src={IMG_PATH.icon.floodArea} alt="" />
      <div className="core-area-desc">
        {!YYFPStore.floodAreaLoading && (
          <Fragment>
            <h1>
              最大淹没面积:
              <br />
              <span>{Math.round(YYFPStore.floodArea.max * 10) / 10} </span>
              k㎡
            </h1>
            <h1>
              最小淹没面积: <br />
              <span>{Math.round(YYFPStore.floodArea.min * 10) / 10} </span>
              k㎡
            </h1>
          </Fragment>
        )}
      </div>
    </CoreAreaWapper>
  );
});

export default CoreArea;
