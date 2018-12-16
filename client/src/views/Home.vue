<template>
  <div id="home">
    <div class="container"  v-if="!connected">
    <!--<div class="container" >-->
      <div class="logo d-flex justify-content-center mt-4">
        <span>QuickChat</span>
      </div>
      <div class="form-group d-flex justify-content-center ">
        <button @click="connect" v-if="!connected">Connect</button>
        <div class="input-group mb-3">
          <input v-model="roomName"
                 class="form-control form-control-lg createInput noFocus"
                 placeholder="Find or Create room" type="text" aria-label="Recipient's username" aria-describedby="basic-addon2">
          <div class="input-group-append">
            <button class="btn btn-primary btn-lg noFocus createBtn" @click="createRoom">Create</button>
          </div>
        </div>
      </div>
      <div class="result">
        <div v-if="rooms.length === 0"><span>Nothing found.</span></div>
        <div v-for="(room, index) in rooms" :key="index"><a href="" @click.prevent="connect(room)">{{room}}</a></div>
        <!--<div><span>Nothing found.</span></div>-->
      </div>
      <div class="newRoom form-group">
      </div>
    </div>
    <div v-if="connected">
      <room></room>
    </div>
  </div>
</template>

<script>
import Room from '../components/Room'

export default {
  name: 'Home',
  components: {
    'room': Room
  },
  data () {
    return {
      connected: false,
      roomName: '123',
    }
  },
  computed: {
    rooms () {
      return this.$store.getters.rooms
    }
  },
  created () {
    this.getRooms()
    setInterval(() => {
      this.getRooms()
    }, 1000)
  },
  methods: {
    getRooms () {
      this.$store.dispatch('getRooms')
    },
    connect (roomName) {
      this.connected = true
      this.$store.dispatch('connect', roomName)
    },
    createRoom () {
      this.connected = true
      this.$store.dispatch('createRoom', this.roomName)
      this.$store.dispatch('connect', this.roomName)
      this.getRooms()
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
