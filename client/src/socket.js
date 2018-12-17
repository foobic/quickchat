import Vue from 'vue'

const newSocket = (url) => {
  const socket = new WebSocket(url)

  const emitter = new Vue({
    methods: {
      send (message) {
        if (socket.readyState === 1) {
          console.log('sent')
          socket.send(message)
        }
      }
    }
  })

  socket.testName = 'aaalex'

  socket.onmessage = function (msg) {
    emitter.$emit('message', msg.data)
  }
  socket.onopen = function () {
    console.log('opened')
    emitter.$emit('open')
  }
  socket.onerror = function (err) {
    emitter.$emit('error', err)
  }

  return emitter
}

export default newSocket
