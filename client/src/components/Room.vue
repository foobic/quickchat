<template>
  <div id="room">
    <div class="roomWrapper d-flex container">
      <div  class="infoBlock px-4">
        #{{roomName}}
        <button  @click="close"  class="btn btn-primary btn-xs noFocus">Close</button>
      </div>
    </div>
    <div class="roomWrapper d-flex container">
      <div  class="msgBlock px-4">
        <div v-for="(msg, index) in messages" :key="index">
          <span v-html="msg"></span>
        </div>
      </div>
    </div>
    <br>
    <div class="roomWrapper d-flex   container">
      <div class="msgInput w-100">
        <div class="form-group col-12 ">
          <div class="input-group mb-3 ">
            <input placeholder="Write a message..." type="text" aria-label="Recipient's username" aria-describedby="basic-addon2"
                   class="form-control form-control-lg createInput noFocus" v-model="msg" @keyup.enter="send" ref="msgInput" >
            <div class="input-group-append">
              <button  @click="send"  class="btn btn-primary btn-lg noFocus createBtn">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Room',
  data () {
    return {
      msg: ''
    }
  },
  computed: {
    messages () {
      return this.$store.getters.messages
    },
    roomName () {
      return this.$store.state.roomName
    }
  },
  watch: {
    messages: function () {
      // auto scroll down
      setTimeout(() => {
        let objDiv = document.getElementsByClassName('msgBlock')[0]
        objDiv.scrollTop = objDiv.scrollHeight
      }, 100)
    }
  },
  mounted () {
    this.$refs.msgInput.focus()
  },
  methods: {
    send () {
      if (this.msg.length === 0) return
      this.$store.dispatch('sendMessage', this.msg)
      this.msg = ''
    },
    close(){
      console.log('closing')
      this.$store.dispatch('close')
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../views/common.scss';
  span{
    color:  #3b4857d9 !important;
    font-size: 0.7em !important;
  }
  .msgBlock{
    height: 70vh;
    overflow-y: auto ;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  .infoBlock{
    height: 10vh;
  }
  /*.msgInput{*/
    /*height: 10vh;*/
  /*}*/
</style>
