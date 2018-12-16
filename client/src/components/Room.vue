<template>
  <div id="room">

    <input type="text" v-model="msg">
    room {{this.$store.state.serverUrl}}
    <button @click="send">Send</button>
    <div>
      <div v-for="(msg, index) in messages" :key="index">
        <span>{{msg}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Room',
  data () {
    return {
      msg: ''
    }
  },
  computed: {
    messages () {
      return this.$store.getters.messages
    }
  },
  methods: {
    send () {
      this.$store.dispatch('sendMessage', this.msg)
    }
  }
}
</script>

<style scoped>

</style>
