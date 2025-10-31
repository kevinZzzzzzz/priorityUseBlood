import { store } from "@/store";
import RequestHttp from '@repo/http/lib'
import { formatQueryParam } from "@/utils";

const config = {
	// 默认地址请求地址，可在 .env 开头文件中修改
	baseURL: '',
	// 设置超时时间（10s）
	timeout: 10000,
	// 跨域时候允许携带凭证
	withCredentials: true,
  // @ts-ignore
  token:  'aec4b488b95db81ca2677db229dd96bc',
};
const base_uri = ''
// 设置代理
export const setProxy = (url: string): string => {
  return !import.meta.env.PROD ? '/api/' + url : url
}
// * 补全url
const completePrefixUrl = (url: string) => {
  // const hosToStaPath = localStorage.getItem('hosToStaPath') || '/station/'
  const prefix = window.location.origin
  return `${prefix}${setProxy(base_uri + url)}`
};

const http = new RequestHttp(config);
// * 本地获取数据
http.localGet = (url: string, params?: object, _object = {}) => {
  return http.get(url, params, _object)
}
// * 格式化GET请求的参数
http._get = (url: string, params?: object, _object = {}) => {
  const _url = params ? `${url}${formatQueryParam(params)}` : url;
  console.log(_url, 'completePrefixUrl(_url)');
  return http.get(completePrefixUrl(_url), null, _object)
}
// * 格式化POST请求的参数
http._post = (url: string, params?: object, _object = {}) => {
  return http.post(completePrefixUrl(url), params, _object)
}

http._put = (url: string, params?: object, _object = {}) => {
  return http.put(completePrefixUrl(url), params, _object)
}
http._delete = (url: string, params?: object, _object = {}) => {
  return http.delete(completePrefixUrl(url), params, _object)
}



export default http;
