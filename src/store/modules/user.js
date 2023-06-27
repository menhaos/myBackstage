import { login, logout, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter, asyncRoutes, constantRoutes } from '@/router';
import cloneDeep from 'lodash/cloneDeep';
// console.log(asyncRoutes);
//1.初始化state仓库
const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
    asyncRoutes: [],
    resultRoutes: [],
    constantRoutes: constantRoutes,
  };
};
//2.匹配拥有权限的异步路由
const matchRoutes = (targetArray) => {
  return targetArray.filter(item => {
    if (state.userInfo.routes.indexOf(item.name) != -1) {
      if (item.children && item.children.length > 0) {
        matchRoutes(item.children);
      }
      return true;
    }
  });
};
//3.合并数组
const concatRoutes = (array1, array2) => {
  return [...array1, ...array2];
};


const state = getDefaultState();

const mutations = {
  //1.存储token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  //2.重置state信息
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  //3.存储用户名
  SET_USERINFO: (state, userInfo) => {
    //存储用户信息
    state.userInfo = userInfo;
    //将匹配到的路由组件返回储存
    state.asyncRoutes = matchRoutes(asyncRoutes);
    //存储最终展示的路由
    state.resultRoutes = concatRoutes(state.constantRoutes, state.asyncRoutes);
  },
};

const actions = {
  //1.用户登录
  async login ({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    //成功后的回调
    if (result.code == 20000) {
      //结构出data
      const { data } = result;
      //提交给mutations处理数据
      commit('SET_TOKEN', data.token);
      //给本地Cookies存储信息
      setToken(data.token);
      return 'ok';
    } else {
      //失败的回调
      return Promise.reject(new Error(data.message || 'fail'));
    }
  },
  /* 原生写法：因为这个模板创建时没有async和await
  login ({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response;
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }, */

  //2.获取用户信息
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response;
        if (!data) {
          return reject('Verification failed, please Login again.');
        }
        commit('SET_USERINFO', data);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },

  //3.用户退出
  async logout ({ commit }) {
    let result = await logout();
    if (result.code == 20000) {
      //清除token
      removeToken();
      //重置路由信息
      resetRouter();
      //提交mutations
      commit('RESET_STATE');
      return 'ok';
    } else {
      return Promise.reject(new Error(result.message || 'fail'));
    }
  },
  //退出登录 移除token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

