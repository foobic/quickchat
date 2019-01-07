<template>
  <div id="home">
    <div class="container" v-if="!connected">
      <!--<div class="container" >-->
      <div class="logo d-flex justify-content-center mt-4">
        <span>QuickChat</span>
      </div>
      <div class="inputDataMobile d-flex justify-content-center">
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
      </div>
      <div class="inputData d-flex justify-content-center">
        <div class="form-group d-none d-md-block col-md-4">
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
        <div class="form-group col-12 col-md-8">
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
      filteredRoomName: '',
      filterednickName: '',
    };
  },
  computed: {
    rooms() {
      let regex = new RegExp(this.roomName, 'i');
      const matchedRooms = this.$store.getters.rooms.filter(el => {
        return el ? el.match(regex) : false;
      });
      return matchedRooms;
    },
    roomName: {
      set: function(name) {
        let regex = new RegExp(/[a-z0-9]+/, 'ig');
        this.filteredRoomName = name.match(regex);
        this.filteredRoomName =
          this.filteredRoomName == null ? '' : this.filteredRoomName;
        return this.filteredRoomName[0];
      },
      get: function() {
        return this.filteredRoomName[0];
      },
    },
    nickName: {
      set: function(name) {
        let regex = new RegExp(/[a-z0-9]+/, 'ig');
        this.filterednickName = name.match(regex);
        this.filterednickName =
          this.filterednickName == null ? '' : this.filterednickName;
        return this.filterednickName[0];
      },
      get: function() {
        return this.filterednickName[0];
      },
    },
    connected: {
      get: function() {
        console.log(this.$store.state.socket);
        return this.$store.state.socket != null;
      },
    },
  },
  created() {
    this.getRooms();
    setInterval(() => {
      this.getRooms();
    }, 1000);
  },
  methods: {
    validData() {
      // window.alert(this.roomName.length)
      if (this.roomName.length === 0 || this.nickName.length === 0) {
        window.alert('Roomname and NickName cannot be empty.');
        return false;
      }
      return true;
    },
    getRooms() {
      this.$store.dispatch('getRooms');
    },
    connect(roomName) {
      if (this.nickName.length === 0) return;
      this.$store.state.roomName = roomName;
      // this.connected = true
      console.log(this.nickName);
      this.$store.dispatch('connect', {
        roomName: roomName,
        nickName: this.nickName,
      });
    },
    createRoom() {
      if (!this.validData()) return;
      this.getRooms();
      console.log(
        '111',
        this.roomName,
        this.rooms,
        this.rooms.includes(this.roomName),
      );
      if (this.rooms.includes(this.roomName)) {
        window.alert('Room with this name already exists');
        return;
      }
      // this.connected = true
      this.$store.dispatch('createRoom', this.roomName);
      console.log(this.nickName);
      this.$store.dispatch('connect', {
        roomName: this.roomName,
        nickName: this.nickName,
      });
      this.getRooms();
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
