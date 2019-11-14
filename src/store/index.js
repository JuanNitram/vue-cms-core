import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import store from './store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    store,
    auth,
  },

  state: {
    global: {
      apiUrl: process.env.VUE_APP_API_URL,
      appUrl: process.env.VUE_APP_URL,
      loading: false,
    }
  },

  mutations: {
    SET_LOADING: function (state, val) {
      state.global.loading = val
    },
  },

  getters : {
    loading: state => state.global.loading,
    apiUrl: state => state.global.apiUrl,
  },
})
