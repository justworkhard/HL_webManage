import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings, PageLoading, MenuDataItem } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { extend, ResponseError } from 'umi-request';
import defaultSettings from '../config/defaultSettings';
import { SmileOutlined } from '@ant-design/icons';
/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  menuData?: any;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchMenuList?: () => Promise<any>;
}> {

  const fetchUserInfo = async () => {
    try {
      const currentUser = JSON.parse(sessionStorage.getItem('userInfo') || '');
      return currentUser;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  const fetchMenuList = async () => {
    try {
      const menuList = JSON.parse(sessionStorage.getItem('menuList') || '');
      return menuList;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  }
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    const menuData = await fetchMenuList();
    // const currentUser = {};
    return {
      fetchUserInfo,
      fetchMenuList,
      currentUser,
      menuData,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    fetchMenuList,
    menuData: [],
    settings: defaultSettings,
  };
}
const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => (
  menus.map(({ icon, routes, ...item }) => {
    return {
      name: item.name,
      icon: <SmileOutlined />,
      children: routes && loopMenuItem(routes),
      path: item.path,
      hideInMenu: item.hideInMenu == 'false' ? false : true
    }
  })
);

export const layout = ({
  initialState,
}: {
  initialState: {
    settings?: LayoutSettings;
    menuData: Promise<BasicLayoutProps>;
    currentUser?: API.CurrentUser
  };
}): BasicLayoutProps => {
  let menuList = loopMenuItem(initialState.menuData || [])
  console.log(menuList);

  return {
    // 配置菜单
    // menuDataRender: () => menuList,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { currentUser } = initialState;

      const { location } = history;
      console.log(location);

      // 如果没有登录，重定向到 login
      if (!currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
      // 如果没有权限


    },
    // menuDataRender: (menuData) => initialState.menuData || menuData,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};
/**
 * 配置request请求时的默认参数
 */
export const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  headers: {
    // Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('userInfo')).token}`
  }
});
