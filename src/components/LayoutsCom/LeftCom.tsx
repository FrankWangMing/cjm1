import { IMG_PATH } from '@/utils/const';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';
import GlobalStore from '@/store';
import { observer } from 'mobx-react-lite';
import { history } from 'umi';
interface LeftComProps {
  children: JSX.Element;
  isHiddenSideBar?: boolean;
  legendCom?: JSX.Element | null;
  legendComWidth?: number;
  isHideLeft?: boolean;
}
// 左侧样式框架
const LeftCom: React.FC<LeftComProps> = observer(
  ({
    children,
    isHiddenSideBar = false,
    legendCom = null,
    legendComWidth,
    isHideLeft
  }) => {
    {
      const [isOpen, setIsOpen] = useSafeState(true);
      useEffect(() => {
        setIsOpen(!isHideLeft);
      }, [isHideLeft]);

      useEffect(() => {
        if (!GlobalStore.map) return;
      }, [GlobalStore.map]);

      return (
        <div className="outer outer_left">
          <div
            className={[
              'content content_left transform-x_time',
              isOpen ? 'transform_in' : 'left-transform_out'
            ].join(' ')}
            style={{
              width: isOpen ? '420rem' : '0'
            }}>
            {/* 地图操作栏目 */}
            <div className="map-operator-outer">
              {/* 指北针 */}
              <div
                className="map-operator-item"
                onClick={() => {
                  GlobalStore.map?.flyTo({ bearing: 0 });
                }}>
                <img
                  style={{
                    transform: `rotateZ(${GlobalStore.angle}deg)`
                  }}
                  className="pointer-to-the-north"
                  src={IMG_PATH.icon.compass}
                />
                <span>指北针</span>
              </div>
              {/* 默认视角 */}
              <div
                className="map-operator-item"
                onClick={() => {
                  GlobalStore.map_resetDefaultView();
                }}>
                <img className="compass" src={IMG_PATH.icon.defaultView} />
                <span>默认视角</span>
              </div>
              {/* 切换2D 3D */}
              <div
                className="map-operator-item"
                onClick={() => {
                  console.log('GlobalStore.map_view', GlobalStore.map_view);
                  GlobalStore.map_view =
                    GlobalStore.map_view == '2D' ? '3D' : '2D';
                  GlobalStore.setDefaultMapView();
                }}>
                <img
                  className="compass"
                  src={
                    GlobalStore.map_view == '3D'
                      ? IMG_PATH.icon.switch2D
                      : IMG_PATH.icon.switch3D
                  }
                />
                <span>切换{GlobalStore.map_view == '2D' ? '3D' : '2D'}</span>
              </div>
              {/* 开启/关闭倾斜摄影 */}
              <div
                className="map-operator-item"
                onClick={() => {
                  GlobalStore.setIsShow3DTile(!GlobalStore.isShow3dTile);
                }}>
                <img
                  className="compass"
                  src={
                    !GlobalStore.isShow3dTile
                      ? IMG_PATH.icon.open3DTile
                      : IMG_PATH.icon.close3DTile
                  }
                />
                <span style={{ fontSize: '12rem' }}>{'倾斜摄影'}</span>
              </div>
              {/* 跳转bim */}
              <div
                className="map-operator-item"
                onClick={() => {
                  history.push('/bimDemo');
                }}>
                <img className="compass" src={IMG_PATH.icon.defaultView} />
                <span>BIM</span>
              </div>
            </div>
            {children}
          </div>
          {!isHiddenSideBar && (
            <div
              className={[
                'content-operation transform-x_time',
                isOpen ? 'transform_in' : 'left-transform_out_optBtn'
              ].join(' ')}>
              <div className="content-decorator-line color-side-line" />
              <div
                className="content-operation-btn"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}>
                {!isOpen ? (
                  <img src={IMG_PATH.layout.side.open} alt="" />
                ) : (
                  <img src={IMG_PATH.layout.side.close} alt="" />
                )}
              </div>
            </div>
          )}
          {legendCom && (
            <div
              className={[
                'content_left_legend transform-x_time',
                isOpen ? 'transform_in' : ''
              ].join(' ')}
              style={{
                width: `${legendComWidth}rem`
                // right: '-230rem'
              }}>
              {legendCom}
            </div>
          )}
        </div>
      );
    }
  }
);

export { LeftCom };
