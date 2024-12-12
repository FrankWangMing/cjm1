/*!
 * Copyright (C) 2016-present, Yuansuan.cn
 * @Author bin_wang
 */
/**
 * 账号注册界面
 */
import { Form, Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from '@/utils/history';
import { LoginWrapper } from './style';
import { LoginService } from '@/service';
import { encryptAES_CBC } from './util';
import { JWT_TOKEN_KEY } from '@/utils/const';

export default observer(() => {
  const [form] = Form.useForm();
  /**
   * 点击注册
   */
  const onFinish = async () => {
    form.validateFields().then(async formData => {
      let res = localStorage.getItem(JWT_TOKEN_KEY);
      if (localStorage.getItem(JWT_TOKEN_KEY)) {
        const res = await LoginService.pwdChange(
          encryptAES_CBC(formData.passwd),
          encryptAES_CBC(formData.passwd_new)
        );
        message.success('密码更新成功，即将跳转到登录界面');
        setTimeout(() => {
          history.push('/login');
        }, 1000);
      } else {
        setTimeout(() => {
          history.push('/login');
        }, 1000);
      }
    });
  };

  const passwdRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,32}$/;

  const validPasswd = (rule, value, fn) => {
    if (passwdRegex.test(value)) {
      fn();
    } else {
      fn('长度8位至32位，且包含数字、大小写字母、特殊字符');
    }
  };

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
          <div className="login-form" style={{ paddingTop: '20px' }}>
            <div className="login-title" style={{ padding: '40px 0' }}>
              密码更新
            </div>
            <Form
              form={form}
              className="form-box"
              name="basic"
              style={{ height: '100%', width: '100%' }}
              onFinish={onFinish}>
              {/* 旧密码 */}
              <Form.Item
                name="passwd"
                rules={[{ required: true, message: '请输入旧密码' }]}>
                <Input.Password
                  size="middle"
                  placeholder="请输入旧密码"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              {/* 新密码 */}
              <Form.Item
                name="passwd_new"
                rules={[
                  {
                    validator: validPasswd
                  }
                ]}>
                <Input.Password
                  size="middle"
                  placeholder="请输入新密码"
                  autoComplete={'new-password'}
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Button
                type="primary"
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '2px'
                }}
                htmlType="submit">
                更新
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
