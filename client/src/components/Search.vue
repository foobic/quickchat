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
            v-on:click="createRoomHandler"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <myalert type="danger" ref="alertEmptyRoomname" btnText="Close">
      Roomname cannot be empty. And should contain only alphabetic and numeric
      characters.
    </myalert>
    <myalert type="danger" ref="alertRoomAlreadyExists" btnText="Close"
      >Room with this name already exists</myalert
    >
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Alert from './Modal/Alert.vue';

export default {
  name: 'Search',
  components: {
    myalert: Alert,
  },
  computed: {
    ...mapGetters(['rooms']),
    roomname: {
      set(value) {
        this.$store.dispatch('setRoomname', value);
      },
      get() {
        return this.$store.getters.roomname;
      },
    },
  },
  methods: {
    ...mapActions(['createRoom']),
    createRoomHandler() {
      if (this.isRoomExists()) return;
      this.createRoom(this.roomname);
      this.$router.push(`/room/${this.roomname}`);
    },
    isRoomExists() {
      let result = false;
      this.rooms.forEach(el => {
        if (el === this.roomname) {
          result = true;
          this.$refs.alertRoomAlreadyExists.showModal();
        }
      });
      return result;
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
