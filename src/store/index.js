import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import store from './store';
import global from './global'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    store,
    auth,
    global
  }
})
