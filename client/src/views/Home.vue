<template>
  <div id="home">
    <div class="container">
      <!--<router-link tag="li" to="about">-->
        <!--<a>about</a>-->
      <!--</router-link>-->
      <div class="logo d-flex justify-content-center mt-4">
        <span>QuickChat</span>
      </div>
      <div class="form-group d-flex justify-content-center ">
        <input type="text" v-model="msg">
        <button @click="connect">Connect</button>
        <div class="input-group mb-3">
          <input v-model="newRoomName"
                 class="form-control form-control-lg createInput noFocus"
                 placeholder="Find or Create room" type="text" aria-label="Recipient's username" aria-describedby="basic-addon2">
          <!--<input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">-->
          <div class="input-group-append">
            <button class="btn btn-primary btn-lg noFocus createBtn" @click="createRoom">Create</button>
            <!--<button class="btn btn-outline-secondary" type="button">Button</button>-->
          </div>
        </div>
      </div>
      <div class="result">
        <span>Nothing found.</span>
      </div>
      <div class="newRoom form-group">
      </div>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{msg}}</li>
      </ul>
      <!--{{receiveMessage}}}-->
      <!--<div>{{receive()}}</div>-->
      <button @click="send">Lol</button>
    </div>
  </div>
</template>

<script>
import SocketCreator from '../socket'
export default {
  name: 'Home',
  data () {
    return {
      newRoomName: '123',
      socket: null,
      msg: '',
      messages: []
    }
  },
  methods: {
    send () {
      this.socket.send(`${this.newRoomName}: ${this.msg}`)
      this.messages.push(`${this.newRoomName}: ${this.msg}`)
      // console.log(this.socket);
    },
    handleMessage (event) {
      console.log(event)
      this.messages.push(event)
    },
    connect () {
      this.socket = SocketCreator(`ws://${this.$store.state.serverUrl}/${this.newRoomName}`)
      this.socket.$on('message', this.handleMessage)
    },
    createRoom () {
      this.$http.post(`http://${this.$store.state.serverUrl}/create`,
        JSON.stringify({ 'name': this.newRoomName }),
        { headers: { 'content-type': 'application/x-www-form-urlencoded' } }).then(response => {
        // this.socket = new WebSocket(`ws://${this.$store.state.serverUrl}/${this.newRoomName}`)
        // this.socket.onmessage = (event) => console.log(event.data)
        console.log(response)
        this.socket = SocketCreator(`ws://${this.$store.state.serverUrl}/${this.newRoomName}`)
        this.socket.$on('message', this.handleMessage)
        console.log(this.socket)
      }).catch(e => {
        // error callback
      })
    }
  }
}
</script>

<style lang="scss">
  @import 'common';

  .logo > span {
    font-size: 3em;
    color: $mainColor;
  }
  .createInput{
    border-color: $mainColor;
    color: $mainColor;
    &:active, &:focus{
      color: $mainColor;
    }
    &::placeholder{
      color: $mainColor;
      opacity: 0.9;
    }
  }

  .result{
    color: $mainColor;
  }

</style>
