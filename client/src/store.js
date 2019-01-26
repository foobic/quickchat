import Vue from 'vue';
import Vuex from 'vuex';
import VueSocket from './socket';

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
  getters: {
    messages(state) {
      return state.messages;
    },
    rooms(state) {
      return state.rooms;
    },
    roomname(state) {
      return state.roomname;
    },
  },
  mutations: {
    CONNECT(state) {
      state.socket = VueSocket(
        `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
      );
    },
    CLOSE(state) {
      state.socket.close();
      state.socket = null;
      state.messages = [];
    },
    SEND_MESSAGE(state, msg) {
      state.socket.send(msg);
      const time = `<sub>${new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })}</sub>`;
      state.messages.push(`<b>${state.nickname}</b> : ${msg} ${time}`);
    },
    REFRESH_ROOMS(state, rooms) {
      rooms = rooms.map(el => el.slice(1, el.length)); // remove slash from roomname ex: '/football' => 'football'
      state.rooms = rooms;
    },
    SET_ROOMNAME(state, newRoomname) {
      state.roomname = newRoomname;
    },
    SET_NICKNAME(state, newNickname) {
      state.nickname = newNickname;
    },
    RESET_ROOMNAME(state) {
      state.roomname = '';
    },
    RESET_NICKNAME(state) {
      state.nickname = '';
    },
  },
  actions: {
    connect({commit}) {
      commit('CONNECT');
    },
    close({commit}) {
      commit('CLOSE');
    },
    sendMessage({commit}, msg) {
      commit('SEND_MESSAGE', msg);
    },
    setNickname({commit}, newNickname) {
      commit('SET_NICKNAME', newNickname);
    },
    setRoomname({commit}, newRoomname) {
      commit('SET_ROOMNAME', newRoomname);
    },
    resetRoomname({commit}) {
      commit('RESET_ROOMNAME');
    },
    resetNickname({commit}) {
      commit('RESET_NICKNAME');
    },
    createRoom({state}, roomname) {
      Vue.http.post(
        `http://${state.serverUrl}/create`,
        JSON.stringify({name: roomname}),
        {headers: {'content-type': 'application/x-www-form-urlencoded'}},
      );
    },
    getRooms({commit, state}) {
      Vue.http.get(`http://${state.serverUrl}/rooms`).then(response => {
        commit('REFRESH_ROOMS', response.body);
      });
    },
  },
});
