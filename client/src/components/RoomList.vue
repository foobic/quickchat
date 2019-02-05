<template>
  <div class="d-flex justify-content-center">
    <div class="rooms col-12">
      <div v-if="matchedRooms.length === 0">
        <span>Nothing found.</span>
      </div>
      <div v-for="(roomname, index) in matchedRooms" v-bind:key="index">
        <a href v-on:click.prevent="connect(roomname)">{{ roomname }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'RoomList',
  created() {
    this.connectToRoomlist();
  },
  computed: {
    ...mapGetters(['roomname', 'rooms']),
    matchedRooms() {
      const regex = new RegExp(this.roomname, 'i');
      const matchedRooms = this.rooms.filter(el =>
        el ? el.match(regex) : false,
      );
      return matchedRooms;
    },
  },
  destroyed() {
    this.disconnectFromRoomlist();
  },
  methods: {
    ...mapActions(['connectToRoomlist', 'disconnectFromRoomlist']),
    connect(roomname, event) {
      if (event) event.preventDefault();
      this.$router.push({name: 'room', params: {name: roomname}});
    },
  },
};
</script>
