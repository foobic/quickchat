import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverUrl: `${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_SERVER_PORT}`
  },
  mutations: {

  },
  actions: {

  }
})
