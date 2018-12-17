import Vue from 'vue'
import Vuex from 'vuex'
import SocketCreator from './socket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverUrl: `${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_SERVER_PORT}`,
    roomName: '',
    nickName: '',
    socket: null,
    messages: [],
    rooms: []
  },
  getters: {
    messages (state) {
      return state.messages
    },
    rooms (state) {
      return state.rooms
    }
  },
  mutations: {
    CONNECT (state, data) {
      console.log('connected', data.roomName, data.nickName)
      state.roomName = data.roomName
      state.nickName = data.nickName
      state.socket = SocketCreator(`ws://${state.serverUrl}/${state.roomName}?nickname=${state.nickName}`)
      state.socket.$on('message', (msg) => {
        state.messages.push(msg)
      })
      state.socket.$on('error', (msg) => {
        console.log('ERR: ', msg)
      })
    },
    SEND_MESSAGE (state, msg) {
      state.socket.send(msg)
      let time = '<sub>' + (new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + '</sub>'
      state.messages.push('<b>' + state.nickName + '</b>' + ': ' + msg + ' ' + time)
    },
    REFRESH_ROOMS (state, rooms) {
      rooms = rooms.map(el => el.slice(1, el.length)) // remove slash from room name ex: '/football' => 'football'
      state.rooms = rooms
    }
  },
  actions: {
    connect ({ commit }, data) {
      console.log('test', data.roomName, data.nickName)
      commit('CONNECT', data)
    },
    sendMessage ({ commit }, msg) {
      commit('SEND_MESSAGE', msg)
    },
    createRoom ({ commit, state }, roomName) {
      Vue.http.post(`http://${state.serverUrl}/create`,
        JSON.stringify({ 'name': roomName }),
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }).then(response => {
        console.log(response.body)
      }).catch(e => {
        console.log(e)
      })
    },
    getRooms ({ commit, state }) {
      Vue.http.get(`http://${state.serverUrl}/rooms`).then(response => {
        // console.log(response.body)
        commit('REFRESH_ROOMS', response.body)
      }).catch(e => {
        console.log(e)
      })
    }
  }
})
