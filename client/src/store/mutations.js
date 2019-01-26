/* eslint no-param-reassign: 0 */
import VueSocket from '../socket';

export default {
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
};
