<template>
  <div id="home">
    <div class="container">
      <logo></logo>
      <search></search>
      <div class="roomList">
        <roomList></roomList>
      </div>
    </div>
    <myalert type="danger" ref="alertEmptyRoomname">
      Roomname cannot be empty. And should contain only alphabetic and numeric
      characters.
    </myalert>
    <myalert type="danger" ref="alertRoomAlreadyExists"
      >Room with this name already exists</myalert
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
    myalert: Alert,
    logo: Logo,
  },
  data() {
    return {};
  },
  // created() {
  //   this.$store.dispatch('connectToRoomlist');
  // },
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
