/* eslint no-param-reassign: 0 */
import newSocket from '../socket';

export default {
  INIT_STATE(state) {
    // init room list socket
    const roomListSocketParams = {
      onopen() {
        console.log('opened');
      },
      onerror(e) {
        console.log('Erorr', e);
      },
      onmessage: e => {
        const rooms = JSON.parse(e.data);
        // console.log(rooms);
        state.rooms = rooms.map(el => el.slice(1, el.length));
      },
    };
    state.roomListSocket = newSocket(roomListSocketParams);
    // init socket for chatting
    const socketParams = {
      onopen() {
        console.log('opened');
      },
      onerror(e) {
        console.log('Erorr', e);
      },
      onmessage: e => {
        // console.log(e);
        state.messages.push(JSON.parse(e.data));
        // state.messages.push(JSON.parse(msg));
      },
    };
    state.socket = newSocket(socketParams);
  },
  CONNECT_TO_ROOMLIST(state) {
    // state.socket = newSocket(data => {
    //   console.log(data);
    //   state.messages.push(JSON.parse(data));
    // });
    // state.socket.connect(`ws://${state.serverUrl}/roomList`)
    // state.messages = [];
    // state.socket.close();
    state.roomListSocket.connect(`ws://${state.serverUrl}/roomList`);
    // console.log(state.socket);
    // console.log(state.roomListSocket);
    // console.log(state.roomListSocket === state.socket);
  },
  CONNECT_TO_ROOM(state, data) {
    if (data && data.nickname) state.nickname = data.nickname;
    if (data && data.roomname) state.roomname = data.roomname;
    // state.roomListSocket.close();
    state.socket.connect(
      `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
    );
    // state.socket = VueSocket(
    //   `ws://${state.serverUrl}/${state.roomname}?nickname=${state.nickname}`,
    //   msg => {
    //     console.log(msg);
    //     state.messages.push(JSON.parse(msg));
    //   },
    // );
  },
  DISCONNECT_FROM_ROOMLIST(state) {
    state.roomListSocket.close();
  },
  DISCONNECT_FROM_ROOM(state) {
    state.socket.close();
    state.messages = [];
  },
  SEND_MESSAGE(state, msgBody) {
    // console.log(state);
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
  // REFRESH_ROOMS(state, rooms) {
  //   rooms = rooms.map(el => el.slice(1, el.length)); // remove slash from roomname ex: '/123' => '123'
  //   state.rooms = rooms;
  // },
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
