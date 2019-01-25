<template>
  <div id="home">
    <div class="container" v-if="!connected">
      <logo></logo>
      <search></search>
      <div class="roomList">
        <roomList></roomList>
      </div>
    </div>
    <!-- <div v-if="connected">
      <room></room>
    </div>-->
    <alert type="danger" ref="alertEmptyRoomname">
      Roomname cannot be empty. And should contain only alphabetic and numeric
      characters.
    </alert>
    <alert type="danger" ref="alertRoomAlreadyExists"
      >Room with this name already exists</alert
    >
  </div>
</template>

<script>
// import Room from '@/components/Room';
import RoomList from '../components/RoomList.vue';
import Search from '../components/Search.vue';
import Logo from '../components/Logo.vue';
import Alert from '../components/Modal/Alert.vue';

export default {
  name: 'Home',
  components: {
    // room: Room,
    roomList: RoomList,
    search: Search,
    alert: Alert,
    logo: Logo,
  },
  data() {
    return {
      // filteredRoomname: '123',
      // filteredNickname: '',
    };
  },
  // mounted() {},
  created() {
    document.addEventListener('backbutton', this.resetData, true);
  },
  beforeDestroy() {
    document.removeEventListener('backbutton', this.resetData);
  },
  computed: {
    // roomName: {
    //   set(name) {
    //     this.filteredRoomname = validateName(name);
    //   },
    //   get() {
    //     return this.filteredRoomname[0] && this.filteredRoomname[0].length > 0
    //       ? this.filteredRoomname[0]
    //       : '';
    //   },
    // },
    connected: {
      get() {
        return this.$store.state.socket != null;
      },
    },
  },
  // mounted() {
  // this.$refs.alertEmptyRoomname.showModal();
  // setInterval(() => {
  // this.$refs.alertEmptyRoomname.showModal();
  // this.getRooms();
  // }, 1000);
  // },
  methods: {
    resetData(event) {
      console.log(event);
      console.log('asdfds');
      this.$store.dispatch('resetRoomname');
      this.$store.dispatch('resetNickname');
    },
    // isDataCorrect() {
    //   if (!this.isNameCorrect(this.roomName)) return false;
    //   // this.promptNickname();
    //   this.filteredNickname = 'asasdasdf';
    //   if (!this.isNameCorrect(this.filteredNickname)) return false;
    //   return true;
    // },
    // connect() {
    //   if (!this.isDataCorrect()) return;
    //   this.$store.dispatch('connect');
    // },
  },
};
</script>

<style lang="scss">
@import '../assets/common.scss';

.logo > span {
  font-size: 3em;

  @media (max-width: 400px) {
    font-size: 2em;
  }
  color: $mainColor;
}
.rooms {
  color: $mainColor;
}

// .result {
//   color: $mainColor;
// }
</style>
