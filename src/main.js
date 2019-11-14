import Vue from "vue"
import Axios from "axios"
import Vuetify from "vuetify"
import Toasted from 'vue-toasted';
import VueQuillEditor from 'vue-quill-editor'

import App from "./App.vue"
import store from "./store/index"
import filters from "./filters"
import router from "./routes/index"


for (let name in filters) {
  Vue.filter(name, filters[name]);
}

Vue.use(Toasted, {
  theme: "bubble",
  type: 'error',
  fitToScreen: true,
  position: "top-right",
  duration : 3000
});
Vue.use(VueQuillEditor);
Vue.use(Vuetify, { theme: { primary: "#2c3e50" } });
Vue.prototype.$http = Axios;
Vue.config.productionTip = false;

const token = localStorage.getItem("token");
if(token) Vue.prototype.$http.defaults.headers.common["Authorization"] = token;

new Vue({
  vuetify: new Vuetify(),
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";
