import axios from 'axios';
import router from '../router'
import { Message } from 'view-design';
import store from '../store/index'

// request拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token_) {
      config.headers['token'] = store.state.token_
    }
    return config
  }, error => {
    console.alert('error')
    Promise.reject(error)
  })

// response
axios.interceptors.response.use(
  res => {
    return res.data;
  }, error => {
    if (error.response.status == 504) {//	充当网关或代理的服务器，未及时从远端服务器获取请求
      Message['error']({ background: true, content: '找不到服务器' });
    } else if (error.response.status == 403) {	//服务器理解请求客户端的请求，但是拒绝执行此请求
      Message['error']({ background: true, content: '权限不足，请联系管理员' });
    } else if (error.response.status == 401) {//请求要求用户的身份认证
      Message['error']({ background: true, content: '尚未登录，请登录' });
      router.replace("/");//跳转到登陆页
    } else if (error.response.status == 404) {
      Message['error']({ background: true, content: '服务器无法根据客户端的请求找到资源' });
    } else if (error.response.status == 500) {
      Message['error']({ background: true, content: '服务器内部错误，无法完成请求' });
    } else {
      if (error.response.data) {
        Message['error']({ background: true, content: error.response.data.msg });
      }
      else {
        Message['error']({ background: true, content: '未知错误!' });
      }
    }
    return;
  }
)

let base = '';

/*
封装“增加”请求方法——post
 */
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  });
}
/*
封装“修改”请求方法——put
 */
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  });
}
/*
封装“查询”请求方法——get
 */
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    data: params
  });
}
/*
封装“删除”请求方法——get
 */
export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params
  });
}
