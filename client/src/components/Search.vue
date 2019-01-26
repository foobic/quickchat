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
  methods: {
    createRoom() {
      this.$store.dispatch('createRoom');
      this.$router.push(`/room/${this.roomname}`);
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
