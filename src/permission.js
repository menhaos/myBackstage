import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

//路由守卫相关的模块

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

//路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 进图条开始
  NProgress.start();
  // 设置页面标题
  document.title = getPageTitle(to.meta.title);
  // 判断是否有token信息
  const hasToken = getToken();
  //有token的逻辑判断
  if (hasToken) {
    //1.有token，不能跳转到/login页面，跳转到/页面
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      //2.有token,跳转页面不为/login,有用户信息则跳转
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        //3.有token,跳转页面不为/login，没有用户信息获取用户信息，获取完成跳转
        try {
          await store.dispatch('user/getInfo');
          next();
        } catch (error) {
          //4.有token,跳转页面不为/login，没有用户信息获取用户信息，获取信息失败则移除失效token，返回登录页面,凭借上query参数
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    //没有token时逻辑判断
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

//路由后置守卫
router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
