import Vue from 'vue';

export default {
  initState({commit}) {
    commit('INIT_STATE');
  },
  connectToRoomlist({commit}) {
    commit('CONNECT_TO_ROOMLIST');
  },
  connectToRoom({commit}, data) {
    commit('CONNECT_TO_ROOM', data);
  },
  disconnectFromRoom({commit}) {
    commit('DISCONNECT_FROM_ROOM');
  },
  disconnectFromRoomlist({commit}) {
    commit('DISCONNECT_FROM_ROOMLIST');
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
};
