/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { Children } from 'react';
import { Redirect } from 'umi';

export default [
  {
    path: '/login',
    exact: true,
    component: '@/pages/Login/index',
    layout:false
  },
  {
    path: '/signin',
    component: '@/pages/Login/SignIn',
    layout:false
  },
  {
    path: '/updatePasswd',
    component: '@/pages/Login/UpdatePasswd',
    layout:false
  },
  {
    path: '/ptmanage',
    component: '@/pages/PTManage/index',
    menu: {
      flatMenu: true
    },
    routes: [
      {
        path: '/ptmanage',
        redirect: '/ptmanage/modal'
      },
      {
        path: '/ptmanage/modal',
        component: '@/pages/PTManage/Modal/index',
        menu: { name: 'modal', key: 'modal' } // 主页面的菜单key为 'main'
      },
      {
        path: '/ptmanage/modal/modalDetail',
        component: '@/pages/PTManage/Modal/modalDetail/index',
        menu: { name: 'modal', key: 'modal' } // 主页面的菜单key为 'main'
      },
      {
        path: '/ptmanage/knowledge',
        component: '@/pages/PTManage/Knowledge/index'
      }
    ]
  },
  {
    path: '/manage',
    component: '@/pages/Manage/index',
    menu: {
      flatMenu: true
    },
    routes: [
      {
        path: '/manage',
        redirect: '/manage/villageInfo'
      },
      {
        path: '/manage/villageInfo',
        component: '@/pages/Manage/VillageInfo/index'
      },
      {
        path: '/manage/userInfo',
        component: '@/pages/Manage/UserInfo/index'
      },
      {
        path: '/manage/device',
        routes: [
          {
            path: '/manage/device/camera',
            component: '@/pages/Manage/Devices/Camera/index'
          },
          {
            path: '/manage/device/waterGage',
            component: '@/pages/Manage/Devices/WaterGage/index'
          }
        ]
      },
      {
        path: '/manage/defenseList',
        component: '@/pages/Manage/DefenseList/index'
      },
      {
        path: '/manage/responsible',
        component: '@/pages/Manage/Responsible/index'
      },
      {
        path: '/manage/briefUserManage',
        component: '@/pages/Manage/BriefManage/index'
      }
    ]
  },
  //bimDemo BIMDemo
  {
    path: '/bimDemo',
    component: '@/pages/BIMDemo/index'
  },
  {
    path: '/',
    component: '@/layouts/index',
    layout:false,
    menu: {
      flatMenu: true
    },
    routes: [
      // {
      //   path: '/',
      //   redirect: '/verifyLogin'
      // },
      // {
      //   path: '/verifyLogin',
      //   component: '@/pages/Login/VerifyLogin'
      // },
      {
        path: '/',
        component: '@/pages/HLYB/index',
        redirect: '/hlyb'
      },
      // {
      //   path: '/slyzt',
      //   component: '@/pages/SLYZT/index'
      // },
      {
        path: '/hlyb',
        component: '@/pages/HLYB/index'
      },
      {
        path: '/yyfp',
        component: '@/pages/YYFP/index'
      },
      {
        path: '/fxyj',
        component: '@/pages/FXYJ/index'
      },
      {
        path: '/ldya',
        component: '@/pages/LDYA/index'
      },
      {
        path: '/dingding',
        component: '@/pages/DingDing/index'
      },
      {
        path: '/pdfpreview',
        component: '@/pages/DingDing/PDFPreview'
      },
      {
        path: '/dealbrief',
        component: '@/pages/DingDing/DealBrief'
      },
      {
        path: '/unitTest',
        component: '@/pages/UnitTest/index'
      }
    ]
  },
  {
    component: './404'
  }
];
