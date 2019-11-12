const store = {
  state: {
    items: [],
  },

  mutations: {
    SET_ITEMS: function(state, data){
      state.items = data;
    }
  },

  actions: {

  },

  getters: {
    items: state => state.items
  }
};

export default store;