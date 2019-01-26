<template>
  <div id="home">
    <div class="container" v-if="!connected">
      <logo></logo>
      <search></search>
      <div class="roomList">
        <roomList></roomList>
      </div>
    </div>
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
import RoomList from '../components/RoomList.vue';
import Search from '../components/Search.vue';
import Logo from '../components/Logo.vue';
import Alert from '../components/Modal/Alert.vue';

export default {
  name: 'Home',
  components: {
    roomList: RoomList,
    search: Search,
    alert: Alert,
    logo: Logo,
  },
  data() {
    return {};
  },
  computed: {
    connected: {
      get() {
        return this.$store.state.socket != null;
      },
    },
  },
  methods: {},
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
</style>
