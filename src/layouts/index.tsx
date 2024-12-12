/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { Header } from './component/Header';
import { LayoutWrapper } from './component/style';
import { history } from '@/utils/history';
import { useEffect } from 'react';
import { addBorder, getMapInstance } from '@/components/Map';
import GlobalStore from '@/store';
import { DingDingPageRouter } from '@/utils/const';
import { RoleService } from '@/service';

export default props => {
  /**
   * 初始化地图
   */
  const initMap = async () => {
    // 校验角色;
    // const { result } = await RoleService.judge();
    // GlobalStore.isHaveRoleToEdit = result;
    getMapInstance('map').then(tempMap => {
      console.log('加载地图卡在这里1');
      tempMap.on('load', () => {
        console.log('加载地图卡在这里2');
        // tempMap?.addSource('mapbox-dem', {
        //   type: 'raster-dem',
        //   url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        //   // url: './dem.json',
        //   tileSize: 512,
        //   maxzoom: 14
        // });
        // tempMap?.setTerrain({
        //   source: 'mapbox-dem',
        //   exaggeration: 1
        // });
        GlobalStore.setMap(tempMap); // 赋值给全局变量
        GlobalStore.map_resetDefaultView(); // 重置地图的视角
        // addBorder(tempMap);
      });
    });
  };

  useEffect(() => {
    let asd = history.location.pathname;
    //todo920 干掉登录
    // if (
    //   !DingDingPageRouter.concat(['/verifyLogin']).includes(asd) &&
    //   !GlobalStore.map
    // ) {
    //   initMap();
    // }
    if (!GlobalStore.map) {
      console.log('加载地图');
      initMap();
    }
  }, [history.location.pathname]);

  return (
    <div style={{ userSelect: 'none' }}>
      {/* {!DingDingPageRouter.concat(['/verifyLogin']).includes(
        history.location.pathname
      ) ? (
        <LayoutWrapper className="layout-outer">
          <Header />
          <div
            style={{
              width: '100vw',
              height: '100vh',
              position: 'absolute',
              zIndex: '1'
            }}
            id="map"></div>
          <div className="layout-content_outer">{props.children}</div>
        </LayoutWrapper>
      ) : (
        <>{props.children}</>
      )} */}
      <LayoutWrapper className="layout-outer">
        <Header />
        <div
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            zIndex: '1'
          }}
          id="map"></div>
        <div className="layout-content_outer">{props.children}</div>
      </LayoutWrapper>
    </div>
  );
};
