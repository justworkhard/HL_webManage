import request from 'umi-request';
import { baseUrl, appCode } from './config'

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request<any>(baseUrl + '/**', {
    method: 'POST',
    data: params,
  });
}
export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser');
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/**`);
}

export async function outLogin() {
  return request('/**');
}
/**
 * 根据appCode 和用户id 和 用户 account 查询菜单树
 */
export function getUserMenuList(params: any) {
  const token = params.token
  params = {
    appCode: appCode,
    userId: params.userId,
    account: params.account,
  }
  return request<any>(baseUrl + `/**`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  },

  );
}
export async function changePassword(params: any) {
  const token = params.token
  return request<any>(baseUrl + `/**`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        ...params,
        token: undefined
      },
  });
}