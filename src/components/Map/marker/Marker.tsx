import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import GStore from '@/store';
import { useSafeState } from 'ahooks';

export const MAP_HOVER_DIS_LEVEL = 11;
export const Max_MAP_LEVEL = 14;

/**
 * imgUrl:icon的图片
 * width：icon宽度
 * height：icon高度
 * titleJsx：icon小黑框介绍
 * isAlwaysShowTitle：是否一直展示小黑框
 * isJump：
 * zoomIndex:
 */
interface Marker_IMGProp {
  imgUrl: string;
  width?: number;
  height?: number;
  titleJsx?: JSX.Element;
  isAlwaysShowTitle?: boolean;
  isJump?: boolean;
  zoomIndex?: number;
}
const Marker_IMG: React.FC<Marker_IMGProp> = observer(
  ({
    imgUrl,
    width = 30,
    height = 30,
    isAlwaysShowTitle = false,
    titleJsx = undefined,
    zoomIndex
  }) => {
    function util_getMarkerScale(): number {
      if (currZoom <= Max_MAP_LEVEL) {
        return 1 + (currZoom - 9) * 0.3; // Adjust this formula as needed
      }
      return 2.5;
    }

    const [currZoom, setCurrZoom] = useSafeState<number>(12);
    useEffect(() => {
      if (zoomIndex) {
        setCurrZoom(zoomIndex);
      }
    }, []);
    useEffect(() => {
      if (!GStore.map) return;
      GStore.map.on('zoomend', e => {
        setCurrZoom(e.target.getZoom());
      });
    }, [GStore.map]);
    return (
      <div className={['cus-map-marker-outer'].join(' ')}>
        {(currZoom > MAP_HOVER_DIS_LEVEL || isAlwaysShowTitle) && titleJsx}
        <img
          src={imgUrl}
          style={{
            width: `${width * util_getMarkerScale()}px`,
            height: `${height * util_getMarkerScale()}px`,
            transform: `translateZ(${util_getMarkerScale() - 1})`,
            transition: 'all 200ms'
          }}
        />
      </div>
    );
  }
);

export { Marker_IMG };
