/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 界面布局中的菜单栏目头部
 */
import { IMG_PATH, MENU_LIST } from '@/utils/const';
import React, { useEffect, useState } from 'react';
import { HeaderWrapper } from './style';
import { history, historys } from '@/utils/history';
import { useSafeState } from 'ahooks';
import moment, { Moment } from 'moment';
import { MenuListProp } from '@/domain/menu';
import GlobalStore from '@/store';
import { observer } from 'mobx-react-lite';

const Header: React.FC = observer(() => {
  const [leftMenu, setLeftMenu] = useSafeState<Array<MenuListProp>>([]);
  const [rightMenu, setRightMenu] = useSafeState<Array<MenuListProp>>([]);
  /**
   * 点击菜单响应事件
   * @param item 菜单携带数据 标题 + 路由路径
   */
  const handleClickMenu = (routerPath: string) => {
    history.push(routerPath);
  };

  /**
   * 时间刷新机制
   */
  const [momentNow, setMomentNow] = useSafeState<Moment>(moment());
  function updateTime() {
    setMomentNow(moment());
    requestAnimationFrame(updateTime);
  }
  useEffect(() => {
    requestAnimationFrame(updateTime);
  }, []);
  //   useEffect(() => {
  //   let interval = setInterval(() => {
  //     setMomentNow(moment());
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  /**
   * 刷新界面 | 路由跳转 设置当前选中菜单;
   */
  const [activeMenu, setActiveMenu] = useState<string>();
  useEffect(() => {
    let tempLeftMenuList: MenuListProp[] = [];
    let tempRightMenuList: MenuListProp[] = [];
    MENU_LIST.map(item => {
      item.position === 'left'
        ? tempLeftMenuList.push(item)
        : tempRightMenuList.push(item);
    });
    setLeftMenu(tempLeftMenuList);
    setRightMenu(tempRightMenuList);
    setActiveMenu(history.location.pathname);
  }, [history.location]);

  return (
    <HeaderWrapper>
      <div className="menu-outer menu-outer_left">
        <div className="left-avatar-outer">
          <div className="flex-center column" style={{ zIndex: 10 }}>
            <img
              className="avatar"
              onClick={() => {
                //todo920-after 返回的方法
              }}
              style={{ width: '100%' }}
              src={IMG_PATH.icon.fanhui}
              alt="返回"
            />
            <h1 style={{ color: '#fff', fontSize: '10rem' }}>返回</h1>
          </div>
          <div className="timer">
            <p>
              {momentNow.format('YYYY/MM/DD')} {momentNow.format('HH:mm:ss')}
            </p>
          </div>
        </div>
        {leftMenu.map(item => {
          return (
            <div
              key={item.routerPath}
              className={[
                'menu-item',
                item.routerPath === activeMenu ? 'menu-item_active' : ''
              ].join(' ')}
              onClick={() => {
                handleClickMenu(item.routerPath);
              }}>
              {item.title}
            </div>
          );
        })}
      </div>
      <div className="title-outer">
        {/* <div className="place-name">
          淳安县小流域
          <br />
          <div>（武强溪）</div>
        </div> */}
        <div className="main-title">沁水县水利数字孪生平台</div>
      </div>
      <div
        className="menu-outer menu-outer_right"
        style={{ width: GlobalStore.isHaveRoleToEdit ? '700rem' : 'unset' }}>
        {rightMenu.map(item => {
          return (
            <div
              key={item.routerPath}
              className={[
                'menu-item-right',
                item.routerPath === activeMenu ? 'menu-item-right_active' : ''
              ].join(' ')}
              onClick={() => {
                handleClickMenu(item.routerPath);
              }}>
              {item.title}
            </div>
          );
        })}
        <div
          key="/ptmanage"
          className={[
            'menu-item-right',
            '/ptmanage' === activeMenu ? 'menu-item-right_active' : ''
          ].join(' ')}
          onClick={() => {
            // GlobalStore.mapboxLayer?.dispose();
            // GlobalStore.disposeMapboxLayer();
            // GlobalStore.map?.remove();
            // GlobalStore.map = undefined;
            historys.push('/ptmanage', true);
          }}>
          平台管理
        </div>

        {/* {GlobalStore.isHaveRoleToEdit && (
          <div
            key="/manage"
            className={[
              'menu-item',
              '/manage' === activeMenu ? 'menu-item_active' : ''
            ].join(' ')}
            onClick={() => {
              // GlobalStore.mapboxLayer?.dispose();
              // GlobalStore.disposeMapboxLayer();
              // GlobalStore.map?.remove();
              // GlobalStore.map = undefined;
              historys.push('/manage', true);
            }}>
            后台管理
          </div>
        )} */}
        <div className="avatar-outer">
          <div className="flex-center column" style={{ zIndex: 10 }}>
            <img
              className="avatar"
              onClick={() => {
                GlobalStore.setIsShowMode(!GlobalStore.isShowMode);
              }}
              style={{ width: '100%' }}
              src={
                GlobalStore.isShowMode
                  ? IMG_PATH.icon.exitYanshi
                  : IMG_PATH.icon.inYanshi
              }
              alt=""
            />
            <h1 style={{ color: '#fff', fontSize: '10rem' }}>
              {GlobalStore.isShowMode ? '退出演示' : '进入演示'}
            </h1>
          </div>
        </div>
      </div>
    </HeaderWrapper>
  );
});

export { Header };
