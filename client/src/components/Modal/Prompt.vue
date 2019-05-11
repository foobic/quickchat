<template>
  <div>
    <b-modal
      id="mymodal"
      ref="mymodal"
      :title="title"
      @ok="handleSubmit"
      @shown="clearName"
      :no-close-on-esc="nocloseonesc"
      :no-close-on-backdrop="nocloseonbackdrop"
      :hide-header-close="hideheaderclose"
    >
      <div class="info" v-if="infoMsg">
        <b-btn class variant="`outline-info`">{{ infoMsg }}</b-btn>
      </div>
      <form @submit.prevent="handleSubmit">
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
  name: 'Prompt',
  data() {
    return {
      name: '',
    };
  },
  props: {
    title: String,
    inputPlaceholder: String,
    infoMsg: String,
    nocloseonesc: Boolean,
    nocloseonbackdrop: Boolean,
    hideheaderclose: Boolean,
  },
  methods: {
    clearName() {
      this.name = '';
    },
    showModal() {
      this.$refs.mymodal.show();
    },
    hideModal() {
      this.$refs.mymodal.hide();
    },
    handleSubmit() {
      this.$refs.mymodal.hide();
      this.$emit('promptClosed', this.name);
      this.clearName();
    },
  },
};
</script>
