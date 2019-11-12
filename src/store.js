import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		apiUrl: process.env.VUE_APP_API_URL,
		appUrl: process.env.VUE_APP_URL,

		token: localStorage.getItem('token') || '',
		user : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},

		loading: false,
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
		SET_LOADING: function (state, val) {
			state.loading = val
		},
	},

	actions: {
		login: function ({commit}, user) {
			return new Promise((resolve, reject) => {
				axios({url: this.state.apiUrl + 'login', data: user, method: 'POST'}).then(resp => {
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
		loading: state => state.loading,
		apiUrl: state => state.apiUrl,
		user: state => state.user
	}
})
