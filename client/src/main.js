import Vue from 'vue';
import VueResource from 'vue-resource';
import VueNativeSock from 'vue-native-websocket';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import router from './router';
import store from './store/store';
import './CustomDirectives';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueNativeSock, 'ws://localhost:80', {
  connectManually: true,
});
Vue.use(BootstrapVue);

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
