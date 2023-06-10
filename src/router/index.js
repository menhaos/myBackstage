import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  //一级路由 登录页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  //一级路由 404页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  //一级路由 主页/ 重定向到/dashboard
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  //一级路由  商品管理
  {
    name: 'Product',
    path: '/product',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-s-help' },
    //二级路由  商品管理下的分支
    children: [{
      name: 'Trademark',
      path: 'trademark',
      component: () => import('@/views/product/Trademark'),
      meta: { title: '品牌管理' }
    },
    {
      name: 'Attr',
      path: 'attr',
      component: () => import('@/views/product/Attr'),
      meta: { title: '平台属性管理' }
    },
    {
      name: 'Spu',
      path: 'spu',
      component: () => import('@/views/product/Spu'),
      meta: { title: 'Spu管理' }
    },
    {
      name: 'Sku',
      path: 'sku',
      component: () => import('@/views/product/Sku'),
      meta: { title: 'Sku管理' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
