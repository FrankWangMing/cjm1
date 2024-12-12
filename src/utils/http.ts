/*
 * @Author: guoyue
 * @since: 2022-01-19 13:43:47
 * @LastAuthor: Please set LastEditors
 * @lastTime: 2022-03-18 11:00:29
 * @文件相对于项目的路径: /frontend/src/utils/http.ts
 * @message:
 */
/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 */

import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { DingDingPageRouter, JWT_TOKEN_KEY } from './const';
import { getParamObj } from '.';
import { history } from 'umi';
import GlobalStore from '@/store';
import { LoginService } from '@/service';

export const url = window.location.origin; //'http://10.0.201.191:7788'; //location.origin; // ;
axios.defaults.timeout = 1000 * 60 * 10; //380000;
const http = axios.create({
  baseURL: `${url}/api/`
});
const httpPdf = axios.create({
  baseURL: `${url}/api/`
});
message.config({
  maxCount: 1
});

//todo920 干掉登录
const getToken = async () => {
  // if (GlobalStore.isVerifyLogin) {
  //   return localStorage.getItem(JWT_TOKEN_KEY);
  // } else {
  //   return 'yskj2407';
  // }
};

// 需要登录的状态码
//key:后端返回状态码
//value:是否使用后端返回message信息
const needLoginStatus = new Map([
  [11002, true],
  [11003, true], //ip变化，使用后端返回mes信息
  [11009, true], //登录失效
  [10003, true],
  [10002, true] // token校验失败
]);

httpPdf.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (DingDingPageRouter.includes(history.location.pathname)) {
    return config;
  } else {
    // const token = getToken();
    const token =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjg3ODg0NTIsImlhdCI6MTcyNjE5NjQ1Miwicm9sZSI6InJvb3QiLCJ1c2VyaWQiOjAsInVzZXJuYW1lIjoieXNral9kZW1vIn0.keZ_xMIfa_-3Sq17KbyFjQAaIX-iM5ptGzORb6_hF-8';
    if (token) {
      config.headers!['Authorization'] = `${token}`;
    } else {
      let paramObj = getParamObj(window.location.href);
      let path = '/?';
      for (let i in paramObj) {
        path = path + i + '=' + paramObj[i] + '&';
      }
      history.push(path);
    }
    return config;
  }
});

http.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (DingDingPageRouter.includes(history.location.pathname)) {
    return config;
  } else {
    // const token = getToken();
    const token =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjg3ODg0NTIsImlhdCI6MTcyNjE5NjQ1Miwicm9sZSI6InJvb3QiLCJ1c2VyaWQiOjAsInVzZXJuYW1lIjoieXNral9kZW1vIn0.keZ_xMIfa_-3Sq17KbyFjQAaIX-iM5ptGzORb6_hF-8';
    if (token) {
      config.headers!['Authorization'] = `${token}`;
    } else {
      let paramObj = getParamObj(window.location.href);
      let path = '/?';
      for (let i in paramObj) {
        path = path + i + '=' + paramObj[i] + '&';
      }
      history.push(path);
    }
    return config;
  }
});

http.interceptors.response.use(
  res => {
    if (res.data.code == 0) {
      return res.data;
    }
    // 判断用户登录是否失效  todo920 干掉登录
    // if (needLoginStatus.has(res.data.code)) {
    //   message.error(res.data.msg || '需要重新登录');
    //   localStorage.removeItem(JWT_TOKEN_KEY);
    //   setTimeout(() => {
    //     window.open('https://sgpt.zjwater.com/#/qrLogin', '_self');
    //   }, 2000);
    //   return Promise.reject(res.data.msg);
    // }
    console.log('接口调用失败', res.data.msg);
    message.error(res.data.msg);
    return Promise.reject(res.data.msg);
  },
  err => {
    if (err.response && err.response.status) {
      //todo920 干掉登录
      // if (err.response.status === 401) {
      //   message.error('登录失效，需要重新登录');
      //   localStorage.removeItem(JWT_TOKEN_KEY);
      //   setTimeout(() => {
      //     window.open('https://sgpt.zjwater.com/#/qrLogin', '_self');
      //   }, 2000);
      // }
      if (err.response.status === 500) {
        message.error('服务器异常');
      }
    }
    return Promise.reject(err);
  }
);

export default http;
export { httpPdf };
