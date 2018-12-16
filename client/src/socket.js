import Vue from 'vue'

const newSocket = (url) => {
  const socket = new WebSocket(url)

  const emitter = new Vue({
    methods: {
      send (message) {
        console.log('sender')
        if (socket.readyState === 1) {
          console.log('sent')
          socket.send(message)
        }
      }
    }
  })

  socket.onmessage = function (msg) {
    console.log('received: ', msg)
    emitter.$emit('message', msg.data)
  }
  socket.onerror = function (err) {
    emitter.$emit('error', err)
  }

  return emitter
}

export default newSocket
