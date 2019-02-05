<template>
  <div id="room">
    <div class="roomWrapper d-flex container" v-if="roomExists">
      <div class="infoBlock px-4">
        #{{ roomname }}
        <button @click="gohome" class="btn btn-primary btn-xs noFocus">
          Go Home
        </button>
        <!-- <router-link></router-link> -->
      </div>
    </div>
    <div class="roomWrapper d-flex container" v-if="roomExists">
      <div class="msgBlock px-4">
        <div v-for="(msg, index) in messages" :key="index">
          <span v-if="msg.nickname === nickname">
            <b>{{ msg.nickname }}</b
            >: {{ msg.body }} <sub>{{ msg.time }}</sub>
          </span>
          <span v-else>
            {{ msg.nickname }}: {{ msg.body }} <sub>{{ msg.time }}</sub>
          </span>
        </div>
      </div>
    </div>
    <br />
    <div class="roomWrapper d-flex container" v-if="roomExists">
      <div class="msgInput w-100">
        <div class="form-group col-12">
          <div class="input-group mb-3">
            <input
              placeholder="Write a message..."
              type="text"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              class="form-control form-control-lg createInput noFocus"
              v-model="msg"
              @keyup.enter="send"
              ref="msgInput"
            />
            <div class="input-group-append">
              <button
                @click="send"
                class="btn btn-primary btn-lg noFocus createBtn"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <myprompt
      title="Submit your name"
      input-placeholder="Enter your name"
      info-msg="NickName cannot be empty. And should contain only latin or numeric
      characters."
      v-on:promptClosed="handleNickname"
      nocloseonesc
      nocloseonbackdrop
      hideheaderclose
      ref="namePrompt"
    ></myprompt>
    <myalert
      type="danger"
      ref="alertConnectionClosed"
      btnText="Reload"
      :cb="reload"
      >Connection closed. Probably, your nickname already taken in this room.
    </myalert>
    <myalert
      type="danger"
      ref="alertRoomDoesntExist"
      btnText="Go Home"
      :cb="gohome"
      >This room doesn`t exist. Go Home for create room.
    </myalert>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Vue from 'vue';
import Prompt from '../components/Modal/Prompt.vue';
import Alert from '../components/Modal/Alert.vue';

export default {
  name: 'Room',
  data() {
    return {
      msg: '',
      roomExists: false,
    };
  },
  components: {
    myprompt: Prompt,
    myalert: Alert,
  },
  computed: {
    ...mapGetters(['messages', 'roomname', 'nickname', 'socket']),
  },

  beforeRouteLeave(to, from, next) {
    this.$refs.namePrompt.hideModal();
    this.disconnectFromRoom();
    next();
  },

  watch: {
    messages() {
      // auto scroll down
      setTimeout(() => {
        const objDiv = document.getElementsByClassName('msgBlock')[0];
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 100);
    },
  },

  mounted() {
    this.setRoomname(this.$route.params.name);
    Vue.http
      .get(`http://${this.$store.getters.serverUrl}/getRoomList`)
      .then(res => {
        const roomList = res.body;
        if (roomList.includes(`/${this.$store.getters.roomname}`) === false) {
          this.resetRoomname();
          this.$refs.alertRoomDoesntExist.showModal();
        } else {
          this.roomExists = true;
          this.$refs.namePrompt.showModal();
        }
      });
  },

  methods: {
    ...mapActions([
      'connectToRoom',
      'sendMessage',
      'disconnectFromRoom',
      'setRoomname',
      'resetRoomname',
    ]),
    reload() {
      this.$router.go(this.$router.currentRoute);
    },
    gohome() {
      this.$router.push('/');
    },
    handleNickname(name) {
      this.connectToRoom({nickname: name});
      const timer = setInterval(() => {
        if (this.socket.socket.readyState !== 0) {
          clearInterval(timer);
          if (
            this.socket.socket.readyState === 2 ||
            this.socket.socket.readyState === 3
          ) {
            this.$refs.alertConnectionClosed.showModal();
          }
        }
      }, 250);

      this.$refs.msgInput.focus();
    },
    send() {
      if (this.msg.length === 0) return;
      this.sendMessage(this.msg);
      this.msg = '';
    },
  },
};
</script>

<style scoped lang="scss">
@import '../assets/common.scss';
span {
  color: #3b4857d9 !important;
  font-size: 0.7em !important;
}
.msgBlock {
  height: 70vh;
  overflow-y: auto;
  width: 100vw;
  display: flex;
  flex-direction: column;
}
.infoBlock {
  height: 10vh;
}
</style>
