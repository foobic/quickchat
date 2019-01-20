<template>
  <div id="home">
    <div class="container" v-if="!connected">
      <!--<div class="container" >-->
      <div class="logo d-flex justify-content-center mt-4">
        <span>QuickChat</span>
      </div>
      <!-- <div class="inputDataMobile d-flex justify-content-center">
        <div class="form-group d-block d-md-none col-12">
          <div class="input-group mb-3">
            <input
              v-model="nickName"
              type="text"
              class="form-control form-control-lg createInput noFocus"
              placeholder="NickName"
              aria-label="Username"
              aria-describedby="basic-addon1"
            >
          </div>
        </div>
      </div>-->
      <!-- <nickname-prompt></nickname-prompt> -->
      <div class="inputData d-flex justify-content-center">
        <!-- <div class="form-group d-none d-md-block col-md-4">
          <div class="input-group mb-3">
            <input
              v-model="nickName"
              type="text"
              class="form-control form-control-lg createInput noFocus"
              placeholder="NickName"
              aria-label="Username"
              aria-describedby="basic-addon1"
            >
          </div>
        </div>-->
        <!-- <div class="form-group col-12 col-md-8"> -->
        <div class="form-group col-12">
          <div class="input-group mb-3">
            <input
              v-model="roomName"
              class="form-control form-control-lg createInput noFocus"
              placeholder="Find or Create room"
              type="text"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            >
            <div class="input-group-append">
              <button class="btn btn-primary btn-lg noFocus createBtn" @click="createRoom">Create</button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="rooms col-12">
          <div v-if="rooms.length === 0">
            <span>Nothing found.</span>
          </div>
          <div v-for="(room, index) in rooms" :key="index">
            <a href @click.prevent="connect(room)">{{room}}</a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="connected">
      <room></room>
    </div>
  </div>
</template>

<script>
import Room from '../components/Room';

export default {
  name: 'Home',
  components: {
    room: Room,
  },
  data() {
    return {
      filteredRoomname: '123',
      filteredNickname: '',
    };
  },
  computed: {
    roomName: {
      set: function(name) {
        this.filteredRoomname = this.validateName(name);
      },
      get: function() {
        return this.filteredRoomname[0] && this.filteredRoomname[0].length > 0
          ? this.filteredRoomname[0]
          : '';
      },
    },
    rooms() {
      let regex = new RegExp(this.roomName, 'i');
      const matchedRooms = this.$store.getters.rooms.filter(el => {
        return el ? el.match(regex) : false;
      });
      return matchedRooms;
    },
    connected: {
      get: function() {
        return this.$store.state.socket != null;
      },
    },
  },
  mounted() {
    this.getRooms();
    setInterval(() => {
      this.getRooms();
    }, 1000);
  },
  methods: {
    promptNickname() {
      let nickname = window.prompt('Enter your nickname, please ?');
      this.filteredNickname = this.validateName(nickname);
    },
    validateName(name) {
      // simple nickname and roomname validator
      let regex = new RegExp(/[a-z0-9]+/, 'ig');
      if (name == null) name = '';
      name = name.match(regex);
      return name == null ? '' : name;
    },
    isNameCorrect(name) {
      if (name.length !== 0) return true;
      window.alert(
        'Roomname and Nickname cannot be empty. ' +
          'And should contain only alphbetic and numeric characters.',
      );
      return false;
    },
    getRooms() {
      this.$store.dispatch('getRooms');
    },
    isDataCorrect() {
      if (!this.isNameCorrect(this.roomName)) return;
      // this.promptNickname();
      this.filteredNickname = 'asasdasdf';
      if (!this.isNameCorrect(this.filteredNickname)) return;
      return true;
    },
    connect(roomName) {
      if (!this.isDataCorrect()) return;
      this.$store.dispatch('connect', {
        roomName: roomName,
        nickName: this.filterenNickname,
      });
    },
    isRoomExists() {
      this.getRooms();
      if (this.rooms.includes(this.roomName)) {
        window.alert('Room with this name already exists');
        return true;
      }
      return false;
    },
    createRoom() {
      if (!this.isDataCorrect()) return;
      if (this.isRoomExists()) return;
      this.$store.dispatch('createRoom', this.roomName);
      this.$store.dispatch('connect', {
        roomname: this.roomName,
        nickname: this.filteredNickname,
      });
      // this.getRooms();
    },
  },
};
</script>

<style lang="scss">
@import 'common';

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
.createInput {
  border-color: $mainColor;
  color: $mainColor;
  &:active,
  &:focus {
    color: $mainColor;
  }
  &::placeholder {
    color: $mainColor;
    opacity: 0.9;
  }
}

.result {
  color: $mainColor;
}
</style>
