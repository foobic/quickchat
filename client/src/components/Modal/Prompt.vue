<template>
  <div>
    <!-- <b-btn v-b-modal.modalPrevent>Launch demo modal</b-btn> -->
    <!-- Modal Component -->
    <b-modal
      id="modalPrevent"
      ref="modal"
      :title="title"
      @ok="handleOk"
      @shown="clearName"
    >
      <div class="info" v-if="infoMsg">
        <b-btn class variant="`outline-info`">{{ infoMsg }}</b-btn>
      </div>
      <form @submit.stop.prevent="handleSubmit">
        <b-form-input
          v-focus
          v-restrict.alpha.number
          v-maxchars="20"
          type="text"
          :placeholder="inputPlaceholder"
          v-model="name"
        ></b-form-input>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data() {
    return {
      name: '',
    };
  },
  props: {
    title: String,
    inputPlaceholder: String,
    infoMsg: String,
  },
  methods: {
    clearName() {
      this.name = '';
    },
    showModal() {
      this.$refs.modal.show();
    },
    handleOk(event) {
      event.preventDefault();
      if (!this.name) {
        // window.alert('Please enter your name');
      } else {
        this.handleSubmit();
      }
    },
    handleSubmit() {
      this.clearName();
      this.$refs.modal.hide();
      this.$emit('promptClosed');
    },
  },
};
</script>
