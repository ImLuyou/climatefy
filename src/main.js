import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

import VueGeolocation from 'vue-browser-geolocation';

Vue.use(VueGeolocation);

Vue.config.productionTip = false

new Vue({
  data(){
    return {
      bgTheme: null
    }
  },
  router,
  render: h => h(App)
}).$mount('#app')
