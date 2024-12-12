/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */

import { Form, Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from '@/utils/history';
import { LoginWrapper } from './style';
import { LoginService, RoleService } from '@/service';
import { JWT_TOKEN_KEY, MomentFormatStr } from '@/utils/const';
import { encryptAES_CBC } from './util';
import { useMount, useSafeState } from 'ahooks';
import { useEffect } from 'react';
import moment from 'moment';

export default observer(() => {
  const [form] = Form.useForm();

  /**
   * 点击登录
   */
  const onFinish = async () => {
    form.validateFields().then(async formData => {
      let encryptAEStr = encryptAES_CBC(formData.passwd);
      const res = await LoginService.login(
        formData.username,
        encryptAEStr,
        formData.validCode
      );
      localStorage.setItem(JWT_TOKEN_KEY, res);
      message.success('登录成功');
      history.push('/slyzt');
    });
  };

  const [lessValidTime, setLessValidTime] = useSafeState<number>(0);

  const WAIT_TIME = 20;

  useEffect(() => {
    let interval = setInterval(() => {
      let lastTime: string | null = localStorage.getItem('lastValidTime');
      if (lastTime) {
        let less = moment().diff(
          lastTime ? moment(lastTime) : moment(),
          'seconds'
        );
        if (less < WAIT_TIME) {
          setLessValidTime(less);
        } else {
          setLessValidTime(0);
          localStorage.removeItem('lastValidTime');
        }
      }
    }, 20);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <LoginWrapper>
      <div className="login-top">
        <img
          style={{ height: '60px' }}
          src="/images/login/login-header.svg"></img>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
        <img
          src="/images/login/bg.png"
          style={{ width: '284px', marginBottom: '40px' }}
        />
        <div className="login-content">
          <div className="login-form">
            <div className="login-title">欢迎登录</div>
            <Form
              form={form}
              className="form-box"
              name="basic"
              style={{ height: '100%', width: '100%' }}
              onFinish={onFinish}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '用户名不能为空' }]}>
                <Input
                  style={{ height: '48px' }}
                  placeholder="请输入用户名"
                  prefix={<UserOutlined />}
                  autoComplete={'new-password'}
                />
              </Form.Item>
              <Form.Item
                name="passwd"
                rules={[{ required: true, message: '密码不能为空' }]}>
                <Input.Password
                  style={{ height: '48px' }}
                  placeholder="请输入密码"
                  autoComplete={'new-password'}
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <div
                className="flex-between"
                style={{ alignItems: 'center', width: '100%' }}>
                <Form.Item
                  name="validCode"
                  rules={[{ required: true, message: '验证码不能为空' }]}>
                  <Input
                    style={{ height: '48px', width: '240px', borderRight: '0' }}
                    placeholder="请输入验证码"
                  />
                </Form.Item>
                <Button
                  onClick={async () => {
                    if (lessValidTime == 0) {
                      setLessValidTime(WAIT_TIME);
                      localStorage.setItem(
                        'lastValidTime',
                        moment().format(MomentFormatStr)
                      );
                      let tempUsername = form.getFieldValue('username');
                      if (tempUsername) {
                        try {
                          await RoleService.sendCode({ name: tempUsername });
                          message.success('已经发送');
                        } catch (e) {
                          console.error('短信服务出现异常');
                        }
                      } else {
                        message.warn('请输入用户名');
                      }
                    }
                  }}
                  disabled={lessValidTime != 0}
                  style={{
                    marginBottom: '24px',
                    height: '48px',
                    width: 'calc(100% - 239px)'
                  }}>
                  {lessValidTime == 0
                    ? '发送验证码'
                    : `${WAIT_TIME - lessValidTime}秒后重试`}
                </Button>
              </div>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '2px'
                }}
                htmlType="submit">
                登录
              </Button>
            </Form>
            <div
              style={{
                textAlign: 'center',
                fontFamily: 'PingFangSC-Regular',
                fontSize: '10px',
                color: '#666',
                letterSpacing: 0,
                fontWeight: 400
              }}>
              {/* 推荐使用最新Chrome谷歌浏览器 */}
            </div>
          </div>
        </div>
      </div>
    </LoginWrapper>
  );
});
