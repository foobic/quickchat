import Vue from 'vue';

const newSocket = ({onopen, onerror, onmessage}) => {
  const socket = new Vue({
    data() {
      return {socket: null};
    },
    methods: {
      connect(url) {
        this.socket = new WebSocket(url);
        this.socket.onopen = onopen;
        this.socket.onerror = onerror;
        this.socket.onmessage = onmessage;
      },
      send(msg) {
        this.socket.send(msg);
      },
      close() {
        this.socket.close();
      },
    },
  });
  return socket;
};

export default newSocket;
