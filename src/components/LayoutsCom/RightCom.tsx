/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
import { IMG_PATH } from '@/utils/const';
import { useSafeState } from 'ahooks';
import React, { Fragment, useEffect } from 'react';
import GlobalStore from '@/store';
import { observer } from 'mobx-react-lite';

/**
 *
 * @param children 子组件
 * @param legendCom 图例组件
 * @param isHideAll 是否隐藏箭头和右侧组件？
 * @param isExpand 是否展开右侧内容？
 * @returns
 */
const RightCom: React.FC<{
  children: JSX.Element;
  legendCom?: JSX.Element | null;
  isHideAll?: boolean;
  isExpand?: boolean;
}> = observer(
  ({ children, legendCom = null, isHideAll = false, isExpand = false }) => {
    const [isOpen, setIsOpen] = useSafeState(true);
    useEffect(() => {
      setIsOpen(isExpand);
    }, [isExpand]);

    useEffect(() => {
      if (!GlobalStore.map) return;
    }, [GlobalStore.map]);

    return (
      <div className="outer outer_right">
        <div
          className={[
            'content-operation transform-x_time',
            isOpen ? 'transform_in' : 'right-transform_out_optBtn'
          ].join(' ')}>
          {/* 地图操作栏目 */}
          <div className="map-operator-outer" style={{ display: 'none' }}>
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
              <span style={{ fontSize: '12rem' }}>
                {GlobalStore.isShow3dTile ? '移除建筑' : '倾斜摄影'}
              </span>
            </div>
          </div>
          {/* 展开、关闭icon */}
          {!isHideAll && (
            <Fragment>
              <div className="sidebar-expand-operate-outer" style={{}}>
                <div
                  className="content-operation-btn"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}>
                  {isOpen ? (
                    <img src={IMG_PATH.layout.side.open} alt="" />
                  ) : (
                    <img src={IMG_PATH.layout.side.close} alt="" />
                  )}
                </div>
                <div className="content-decorator-line color-side-line"></div>
              </div>
              {legendCom && <Fragment>{legendCom}</Fragment>}
            </Fragment>
          )}
        </div>
        {!isHideAll && (
          <div
            className={[
              'content transform-x_time',
              isOpen ? 'transform_in' : 'right-transform_out'
            ].join(' ')}
            style={{ width: isOpen ? '400rem' : '0' }}>
            {children}
          </div>
        )}
      </div>
    );
  }
);

export { RightCom };
