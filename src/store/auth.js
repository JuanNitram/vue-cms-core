import axios from 'axios';

const auth = {
  state: {
    token: localStorage.getItem('token') || '',
    user : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
  },

  mutations: {
    AUTH_SUCCESS: function (state, data) {
      state.token = data.token;
      state.user = data.user
    },
    LOGOUT: function (state) {
      state.token = '';
      state.user = {}
    },
  },

  actions: {
    login: function ({commit}, user) {
      return new Promise((resolve, reject) => {
        axios({url: this.state.global.apiUrl + 'login', data: user, method: 'POST'}).then(resp => {
          if (resp.data.success) {
            const token = resp.data.data.token;
            const user = resp.data.data.admin;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = token;
            commit('AUTH_SUCCESS', {token: token, user: user});
            resolve(resp)
          } else {
            resolve(resp)
          }
        }).catch(err => {
          localStorage.clear();
          reject(err)
        })
      })
    },

    logout: function ({commit}) {
      return new Promise((resolve, reject) => {
        commit('LOGOUT');
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
        resolve()
      })
    }
  },

  getters : {
    user: state => state.user
  },
};

export default auth;
