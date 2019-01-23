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
      // console.log('connected', data.roomname, data.nickname);
      // state.roomname = data.roomname;
      // state.nickname = data.nickname;

      state.socket = VueSocket(
        `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
      );
      // state.socket.print();
      // const vm = new Vue();
      // vm.$connect(
      //   `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
      // );
      // console.log(vm.$socket);

      // this.$connect(
      //   `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
      // );
      // console.log(this.$socket);
      // state.socket = SocketCreator(
      //   `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
      // );
      // state.socket.$on('open', () => {
      //   console.log('Connection opened.');
      // });
      // state.socket.$on('message', msg => {
      //   state.messages.push(msg);
      // });
      // state.socket.$on('error', msg => {
      //   console.log('ERR: ', msg);
      // });
      // state.socket.$on('close', () => {
      //   console.log('Connection closed.');
      // });
    },
    CLOSE(state) {
      // state.roomname = '';
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
      rooms = rooms.map(el => el.slice(1, el.length)); // remove slash from room name ex: '/football' => 'football'
      state.rooms = rooms;
    },
    SET_ROOMNAME(state, newRoomname) {
      state.roomname = newRoomname;
    },
    SET_NICKNAME(state, newNickname) {
      state.nickname = newNickname;
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
    createRoom({state}, roomname) {
      Vue.http
        .post(
          `http://${state.serverUrl}/create`,
          JSON.stringify({name: roomname}),
          {headers: {'content-type': 'application/x-www-form-urlencoded'}},
        )
        .then(response => {
          // console.log(response.body);
        })
        .catch(e => {
          // console.log(e);
        });
    },
    getRooms({commit, state}) {
      Vue.http
        .get(`http://${state.serverUrl}/rooms`)
        .then(response => {
          // console.log(response.body)
          commit('REFRESH_ROOMS', response.body);
        })
        .catch(e => {
          // console.log(e);
        });
    },
  },
});
