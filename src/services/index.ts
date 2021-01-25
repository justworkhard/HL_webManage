// import { request } from 'umi';
import request from 'umi-request';
const baseUrl = ''
const appCode = 'm-ms'

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
