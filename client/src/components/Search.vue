<template>
  <div class="inputData d-flex justify-content-center">
    <div class="form-group col-12">
      <div class="input-group mb-3">
        <input
          v-focus
          v-restrict.alpha.number
          v-maxchars="10"
          v-model="roomname"
          class="createInput noFocus form-control form-control-lg"
          placeholder="Find or Create room"
          type="text"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        />
        <div class="input-group-append">
          <button
            class="btn btn-primary btn-lg noFocus createBtn"
            v-on:click="createRoom"
          >
            Csdfreate Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      roomname: '',
    };
  },
  computed: {
    rawRoomname: {
      get() {
        return this.roomname;
      },
      set(name) {
        // console.log(validateName(name)[0]);
        this.roomname = name;
      },
    },
  },
  methods: {
    createRoom() {
      this.$store.dispatch('setRoomname', this.roomname);
      // if (!this.isDataCorrect()) return;
      // if (this.isRoomExists()) return;
      // this.$store.dispatch('createRoom', this.roomName);
      // this.$store.dispatch('connect');
    },
    isRoomExists() {
      this.$store.dispatch('getRooms');
      if (this.rooms.includes(this.roomName)) {
        this.$refs.alertRoomAlreadyExists.showModal();
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
@import '../assets/common.scss';

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
</style>
