import api from '@/api/api';

/* eslint no-return-assign: 0 */
const user = {
  state: {
    roles: ['init'],
    userInfo: {},
    token: '',
  },
  mutations: {
    SETROLES: (state, roles) => {
      state.roles = roles;
      localStorage.setItem('template_roles', JSON.stringify(roles));
    },
    SETUSERINFO: (state, info) => {
      state.userInfo = info;
      localStorage.setItem('template_userinfo', JSON.stringify(info));
    },
    SETTOKEN: (state, token) => {
      state.token = token;
      localStorage.setItem('template_token', token);
    },
  },
  actions: {
    // 登录获取用户信息
    Login({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.getInfo(params).then((data) => {
          const roles = data.role;
          const defaultRoles = ['403', '404', '500', 'except', 'login'];
          commit('SETROLES', roles.concat(defaultRoles));
          commit('SETUSERINFO', data);
          commit('SETTOKEN', 'test');
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.logout(state.token).then(() => {
          commit('SETTOKEN', '');
          commit('SETROLES', []);
          commit('SETUSERINFO', {});
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
};

export default user;
