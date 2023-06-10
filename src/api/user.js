import request from '@/utils/request';

//登录  /admin/acl/index/login  post  data:{username,password}
export function login (userInfo) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data: userInfo
  });
}

//获取用户信息   /admin/acl/index/info  head:token  
export function getInfo () {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
  });
}

//退出  /admin/acl/index/logout  post  head:token
export function logout () {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  });
}
