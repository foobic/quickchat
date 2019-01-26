import Vue from 'vue';

export default {
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
};
