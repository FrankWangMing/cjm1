/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import http from '@/utils/http';
import axios from 'axios';

export * from './weather';
export * from './village';
export * from './section';
export * from './forecast';
export * from './solution';
export * from './preview';
export * from './alarm';
export * from './user';
export * from './monitor';
export * from './pdf';

const httpWithTokenValid = axios.create();
export const LoginService = {
  login: async (
    userName: string,
    password: string,
    code: string
  ): Promise<string> => {
    let { data: data } = await http.post('/login', {
      name: userName,
      passwd: password,
      code
    });
    return data;
  },
  ticket: async (ticket: string) => {
    let { data: data } = await httpWithTokenValid.post('/api/verifyticket', {
      ticket
    });
    return data;
  },
  dingtalklogin: async (authCode: string): Promise<DingTalkLoginRes> => {
    let { data: data } = await httpWithTokenValid.post('/api/dingtalklogin', {
      authCode
    });
    return data['data'];
  },
  /**
   * 注册用户
   * @param signInObj
   */
  signIn: async (signInObj: {
    email?: string;
    passwd: string;
    phone?: string;
    real_name: string;
    role: string;
    user_name: string;
  }) => {
    let { data: data } = await http.post('/user/add', signInObj);
    return data;
  },
  /**
   * 修改用户密码
   */
  pwdChange: async (new_passwd: string, old_passwd: string) => {
    let { data: data } = await http.post('/pwd/change', {
      new_passwd,
      old_passwd
    });
    return data;
  }
};

export const ShenjiServer = {
  // 发送审计日志
  sendAuditLog: async (pageName: string) => {
    const data = await http.post('/audit/sendAuditLog', {
      msg: `Open ${pageName}`
    });
    return data;
  }
};

export interface DingTalkLoginRes {
  accountId: number;
  employeeCode: string;
  name: string;
  openId: string;
  orgName: string;
}
