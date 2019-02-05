/* eslint-disable no-console */
/* eslint no-param-reassign: 0 */
import newSocket from '../socket';

export default {
  INIT_STATE(state) {
    // init room list socket
    const roomListSocketParams = {
      onopen() {
        console.log('RoomListSocket opened');
      },
      onerror(e) {
        console.log('RoomListSocket error', e);
      },
      onclose(msg) {
        console.log(msg);
      },
      onmessage: e => {
        const rooms = JSON.parse(e.data);
        state.rooms = rooms.map(el => el.slice(1, el.length));
      },
    };
    state.roomListSocket = newSocket(roomListSocketParams);
    // init socket for chatting
    const socketParams = {
      onopen() {
        console.log('Socket opened');
      },
      onerror(e) {
        console.log('Socket error', e);
      },
      onclose(msg) {
        console.log(msg);
      },
      onmessage: e => {
        state.messages.push(JSON.parse(e.data));
      },
    };
    state.socket = newSocket(socketParams);
  },
  CONNECT_TO_ROOMLIST(state) {
    state.roomListSocket.connect(`ws://${state.serverUrl}/roomList`);
  },
  CONNECT_TO_ROOM(state, data) {
    if (data && data.nickname) state.nickname = data.nickname;
    if (data && data.roomname) state.roomname = data.roomname;
    state.socket.connect(
      `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
    );
  },
  DISCONNECT_FROM_ROOMLIST(state) {
    if (state.roomListSocket !== null && state.roomListSocket.socket !== null) {
      state.roomListSocket.close();
    }
  },
  DISCONNECT_FROM_ROOM(state) {
    if (state.socket !== null && state.socket.socket !== null) {
      state.nickname = '';
      state.roomname = '';
      state.socket.close();
      state.messages = [];
    }
  },
  SEND_MESSAGE(state, msgBody) {
    state.socket.send(msgBody);
    state.messages.push({
      nickname: state.nickname,
      body: msgBody,
      time: new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
    });
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
