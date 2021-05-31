// import { request } from 'umi';
import request from 'umi-request';
import { baseUrl, appCode } from './config'

export async function getMenuList(params: any) {
    params = {
        ...params,
        appCode
    }
    return request<any>(baseUrl + '/', {
        method: 'get',
        params,
    });
}
