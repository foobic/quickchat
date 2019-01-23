import Vue from 'vue';
// import VueNativeSock from 'vue-native-websocket';

const newSocket = url => {
  const vueSocket = new Vue({
    created() {
      this.$connect(url);
      // console.log(this.$socket);
    },
    methods: {
      // connect(url) {
      //   console.log(this.$socket);
      // },
      // print() {
      //   console.log(this.$socket);
      // },
      send(message) {
        // if (socket.readyState === 1) {
        // console.log('sent');
        // socket.send(message);
        // }
      },
      close() {
        // socket.close();
      },
      open() {
        // console.log('opened 22');
        // socket.open();
      },
    },
  });
  // const vueSocket = new Vue({
  //   methods: {
  //     send(message) {
  //       if (socket.readyState === 1) {
  //         console.log('sent');
  //         socket.send(message);
  //       }
  //     },
  //     close() {
  //       // socket.close();
  //     },
  //     open() {
  //       console.log('opened 22');
  //       socket.open();
  //     },
  //   },
  // });

  // socket.onmessage = function(msg) {
  //   emitter.$emit('message', msg.data);
  // };
  // socket.onopen = function() {
  //   console.log('opened');
  //   // socket.open()
  //   emitter.$emit('open');
  // };
  // socket.onclose = function() {
  //   console.log('closed');
  //   // emitter.$emit('close');
  // };
  // socket.onerror = function(err) {
  //   emitter.$emit('error', err);
  // };

  return vueSocket;
};

export default newSocket;
