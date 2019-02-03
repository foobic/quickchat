<template>
  <div class="d-flex justify-content-center">
    <div class="rooms col-12">
      <div v-if="rooms.length === 0">
        <span>Nothing found.</span>
      </div>
      <div v-for="(roomname, index) in rooms" v-bind:key="index">
        <a href v-on:click.prevent="connect(roomname)">{{ roomname }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomList',
  data() {
    return {};
  },
  mounted() {
    // this.$store.dispatch('getRooms');
  },
  created() {
    this.$store.dispatch('connectToRoomlist');
    // setInterval(() => {
    //   this.$store.dispatch('getRooms');
    // }, 2000);
  },
  computed: {
    rooms() {
      const regex = new RegExp(this.$store.getters.roomname, 'i');
      const matchedRooms = this.$store.getters.rooms.filter(el =>
        el ? el.match(regex) : false,
      );
      return matchedRooms;
    },
  },
  methods: {
    connect(roomname, event) {
      if (event) event.preventDefault();
      this.$router.push({name: 'room', params: {name: roomname}});

      // this.$router.push(`/room/${roomname}`);
    },
  },
};
</script>
