import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

/* eslint no-param-reassign: 0 */

export default new Vuex.Store({
  state: {
    serverUrl: `${process.env.VUE_APP_SERVER_IP}:${
      process.env.VUE_APP_SERVER_PORT
    }`,
    roomname: '',
    nickname: '',
    socket: null,
    messages: [],
    rooms: [],
  },
  getters,
  mutations,
  actions,
});
