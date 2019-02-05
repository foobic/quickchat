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
Vue.use(BootstrapVue);

Vue.use(VueNativeSock, 'ws://192.168.0.103', {
  connectManually: true,
  reconnection: true,
});

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('initState');
    window.addEventListener('beforeunload', () => {
      this.$store.dispatch('disconnectFromRoom');
      this.$store.dispatch('disconnectFromRoomlist');
      return true;
    });
  },
}).$mount('#app');
