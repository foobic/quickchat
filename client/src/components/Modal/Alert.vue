<template>
  <div>
    <b-modal ref="myModalRef" hide-footer hide-header>
      <div class="d-block text-center">
        <h3>
          <slot></slot>
        </h3>
      </div>
      <b-btn class="mt-2" :variant="`outline-${type}`" block @click="hideModal"
        >Close</b-btn
      >
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    type: String,
  },
  methods: {
    showModal() {
      this.$refs.myModalRef.show();
    },
    hideModal() {
      this.$refs.myModalRef.hide();
    },
  },
};
</script>
