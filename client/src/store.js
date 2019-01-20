import Vue from 'vue';
import Vuex from 'vuex';
import SocketCreator from './socket';

Vue.use(Vuex);

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
  },
  mutations: {
    CONNECT(state, data) {
      console.log('connected', data.roomname, data.nickname);
      state.roomname = data.roomname;
      state.nickname = data.nickname;
      state.socket = SocketCreator(
        `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
      );
      state.socket.$on('open', () => {
        console.log('Connection opened.');
      });
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
      let time =
        '<sub>' +
        new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }) +
        '</sub>';
      state.messages.push(
        '<b>' + state.nickname + '</b>' + ': ' + msg + ' ' + time,
      );
    },
    REFRESH_ROOMS(state, rooms) {
      rooms = rooms.map(el => el.slice(1, el.length)); // remove slash from room name ex: '/football' => 'football'
      state.rooms = rooms;
    },
  },
  actions: {
    connect({commit}, data) {
      commit('CONNECT', data);
    },
    close({commit}) {
      commit('CLOSE');
    },
    sendMessage({commit}, msg) {
      commit('SEND_MESSAGE', msg);
    },
    createRoom({commit, state}, roomname) {
      Vue.http
        .post(
          `http://${state.serverUrl}/create`,
          JSON.stringify({name: roomname}),
          {headers: {'content-type': 'application/x-www-form-urlencoded'}},
        )
        .then(response => {
          console.log(response.body);
        })
        .catch(e => {
          console.log(e);
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
          console.log(e);
        });
    },
  },
});
