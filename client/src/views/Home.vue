<template>
  <div id="home">
    <div class="container">
      <logo></logo>
      <search></search>
      <div class="roomList">
        <roomList></roomList>
      </div>
    </div>
  </div>
</template>

<script>
import RoomList from '../components/RoomList.vue';
import Search from '../components/Search.vue';
import Logo from '../components/Logo.vue';

export default {
  name: 'Home',
  components: {
    roomList: RoomList,
    search: Search,
    logo: Logo,
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
</style>
