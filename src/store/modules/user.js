import { login, logout, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';

//初始化state仓库
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  };
};
const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  //1.存储token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
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

  //获取用户信息
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response;

        if (!data) {
          return reject('Verification failed, please Login again.');
        }

        const { name, avatar } = data;

        commit('SET_NAME', name);
        commit('SET_AVATAR', avatar);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },

  //用户退出
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken(); // must remove  token  first
        resetRouter();
        commit('RESET_STATE');
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
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

