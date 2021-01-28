import {
  LockTwoTone,
  UserOutlined,
  HomeFilled
} from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { history, FormattedMessage } from 'umi';
import { accountLogin, LoginParamsType } from '@/services/login';
import { getUserMenuList } from '@/services/login'

import styles from './index.less';


const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {

  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  window.location.href = redirect || '/';
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    console.log('values', values);
    try {
      // 登录
      const msg = await accountLogin({ ...values });

      sessionStorage.setItem('userInfo', JSON.stringify(msg.data))
      if (msg.code == '1200') {
        message.success('登录成功！');
        await getUserMenuList({
          userId: msg.data.adminId,
          account: msg.data.account,
          token: msg.data.token
        }).then(res => {
          if (res.code != 1200) {
            return message.error('获取菜单失败！')
          }
          sessionStorage.setItem('menuList', JSON.stringify(res.data))
        })
        goto();
        return;
      }else{
        message.error(msg.msg);
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      console.log(error);

      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '登录'
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            <div className={styles.topTitle}>
              <p>欢迎使用</p>
              {/* <span>数字营销商户管理平台</span> */}
            </div>
            {
              status == 'error' ? (
                <LoginMessage
                  content={'账户或密码错误'}
                />
              ) : <></>
            }
            <ProFormText
              name="merchantCode"
              fieldProps={{
                size: 'large',
                prefix: <HomeFilled className={styles.prefixIcon} />
              }}
              placeholder={'请输入机构号'}
              rules={[
                {
                  required: true,
                  message: "请输入机构号!",
                },
              ]}
            />
            <ProFormText
              name="userName"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'请输入账号'}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockTwoTone className={styles.prefixIcon} />,
              }}
              placeholder={'请输入密码'}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
          </ProForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
