/*
 * @Author: Even
 * @Date: 2022-03-28 14:13:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-20 15:11:58
 * @FilePath: /cae/SX/frontend/src/app.tsx
 */
import '@/utils/flexible';
import 'animate.css';
import '../public/mapbox-gl.css';
// import 'mapbox-gl/dist/mapbox-gl.css';
import { LoginService, SectionServer, VillageServer } from '@/service';
import GlobalStore from '@/store';
import {
  DingDingPageRouter,
  IMG_PATH,
  JWT_TOKEN_KEY,
  TITLE
} from './utils/const';
import {
  BasicLayoutProps,
  Settings as LayoutSettings
} from '@ant-design/pro-layout';
import { IMarker } from './domain/marker';
import { ShowServer } from './service/show';

import { history } from '@umijs/max';
import { getParamObj } from './utils';
import { message } from 'antd';
export const layout = ({
  initialState
}: {
  initialState: { settings?: LayoutSettings; currentUser?: null };
}): BasicLayoutProps => {
  const isLogin = async () => {
    if (GlobalStore.isVerifyLogin) {
      // 启动浙水安澜单点登录
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      if (token && token != 'undefined') {
        let pathname = history.location.pathname;
        await getVillageBaseList();
        await getSectionBaseList();
        await setVideoPlatformUrl();
        history.push(pathname.length == 1 ? '/slyzt' : pathname);
      } else {
        // url ticket
        let paramObj = getParamObj(window.location.href);
        try {
          if (paramObj['ticket']) {
            let paramTicket = paramObj['ticket'];
            const res = await LoginService.ticket(paramTicket);
            if (res.code != 0) throw new Error();
            localStorage.setItem(JWT_TOKEN_KEY, res.data.token);
            localStorage.setItem('userMobile', res.data.userMobile); // 登录用户的手机号码
            localStorage.setItem('userCode', res.data.userCode); // 登录用户code
            localStorage.setItem('userName', res.data.userName); // 登录用户姓名
            await getVillageBaseList();
            await getSectionBaseList();
            await setVideoPlatformUrl();
            history.push('/slyzt');
          } else {
            throw new Error();
          }
        } catch (e) {
          message.error('登录失效，请重新登录');
          setTimeout(() => {
            window.open('https://sgpt.zjwater.com/#/qrLogin', '_self');
          }, 3000);
        }
      }
    } else {
      await getVillageBaseList();
      await getSectionBaseList();
      await setVideoPlatformUrl();
      history.push('/slyzt'); // 浙水安澜登录验证的时候，去掉此行，并打开下面注释
    }
  };
  /**
   * 获取村庄相关数据
   */
  const getVillageBaseList = async () => {
    let villageBaseInfoList = await VillageServer.allBaseList();
    // 获取村庄的数据存入到全局的Store(GlobalStore)里面
    GlobalStore.villageList = villageBaseInfoList;
  };

  /**
   * 获取所有断面基础信息
   */
  const getSectionBaseList = async () => {
    let sectionBaseInfoList = await SectionServer.listOfLngLat();
    let resList: IMarker[] = [];
    sectionBaseInfoList.map(item => {
      resList.push({
        id: item.id,
        longitude: item.lng,
        latitude: item.lat,
        type: 'section',
        icon: IMG_PATH.overview.blockFace,
        risk: 0, //todo 不确定是否有风险
        name: item.name,
        // hoverStyle:{
        //   backgroundImage:linear-gradient(180deg, rgba(0,5,17,0.50) 0%, #282C35 100%);
        // }
        width: 120,
        nameShowCss: { marginTop: -80 + 'rem' }
        // risk: item.riskLevel
      });
    });
    GlobalStore.sectionBaseList = sectionBaseInfoList;
    GlobalStore.sectionMarkerList = resList;
  };

  /**
   * 获取视频的静态链接
   */
  const setVideoPlatformUrl = async () => {
    const data = await ShowServer.getStaticLink(2);
    GlobalStore.videoPlatformUrl = data.link;
  };

  // 演示模式控制
  let tempIsShowMode = localStorage.getItem('isShowMode');
  if (tempIsShowMode) {
    GlobalStore.isShowMode = true;
  } else {
    GlobalStore.isShowMode = false;
  }
  getVillageBaseList();
  getSectionBaseList();
  setVideoPlatformUrl();
  //todo920 干掉登录
  // if (!DingDingPageRouter.includes(history.location.pathname)) {
  //   isLogin();
  // }

  return {
    title: TITLE.title,
    layout: 'mix',
    navTheme: 'light',
    headerTheme: 'light',
    headerHeight: 0, //58,
    disableMobile: true,
    siderWidth: 0,
    onPageChange: () => {},
    collapsed: false,
    ...initialState?.settings
  };
};
// export function onRouteChange({ location, routes, action }) {
//   if (action === 'PUSH') {
//     debugger;
//     window.location.reload();
//   }
// }
