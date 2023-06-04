import request from '@/utils/request';

//登录
export function login (userInfo) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data: userInfo
  });
}

//获取用户信息
export function getInfo (token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  });
}

//退出
export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  });
}
