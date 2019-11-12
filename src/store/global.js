const global = {
  state: {
    apiUrl: process.env.VUE_APP_API_URL,
    appUrl: process.env.VUE_APP_URL,

    loading: false,
  },

  mutations: {
    SET_LOADING: function (state, val) {
      state.loading = val
    },
  },

  getters : {
    loading: state => state.loading,
    apiUrl: state => state.apiUrl,
  },
};

export default global;
