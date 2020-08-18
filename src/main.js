import Vue from 'vue';
import App from './App.vue';
import * as fcl from "@onflow/fcl";
import store from "./store";
import router from './router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

fcl.config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate")

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
