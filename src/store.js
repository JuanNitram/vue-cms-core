import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		baseUrl: process.env.VUE_APP_API_URL,
		appUrl: process.env.VUE_APP_URL,
		storageUrl: process.env.VUE_APP_STORAGE_URL,

		token: localStorage.getItem('token') || '',
		user : localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},

		loading: false,
	},
	mutations: {
		AUTH_SUCCESS(state, data){
			state.token = data.token
			state.user = data.user
		},
		LOGOUT(state){
			state.token = ''
			state.user = {}
		},
		SET_LOADING(state, val){
			state.loading = val
		},
	},
	actions: {
		login({commit}, user){
			return new Promise((resolve, reject) => {
				axios({url: this.state.baseUrl + 'login', data: user, method: 'POST' })
				.then(resp => {
					if(resp.data.success){
						const token = resp.data.data.token
						const user = resp.data.data.admin
						localStorage.setItem('token', token)
						localStorage.setItem('user', JSON.stringify(user))
						axios.defaults.headers.common['Authorization'] = token
						commit('AUTH_SUCCESS', {token: token, user:user})
						resolve(resp)
					} else {
						resolve(resp)
					}
				})
				.catch(err => {
					localStorage.clear()
					reject(err)
				})
			})
		},
		logout({commit}){
			return new Promise((resolve, reject) => {
				commit('LOGOUT')
				localStorage.clear()
				delete axios.defaults.headers.common['Authorization']
				resolve()
			})
		}
	},
	getters : {
		loading: state => state.loading,
		baseUrl: state => state.baseUrl,
		storageUrl: state => state.storageUrl,
		appUrl: state => state.appUrl,
		user: state => state.user
	}
})
