<template>
  <div id="app">
    <div class="container">
      <div class="logo d-flex justify-content-center mt-4">
        <span>QuickChat</span>
      </div>
      <div class="form-group d-flex justify-content-center ">
        <!--<div class="borderWrapper">-->
          <!--&lt;!&ndash;<input type="text"  >&ndash;&gt;-->
          <!--<div class="w-50">-->
            <!--<input class="form-control form-control-lg createBtn noFocus"  placeholder="New room name" type="text">-->
          <!--</div>-->
          <!--&lt;!&ndash;<div class="w-25">&ndash;&gt;-->
          <!--&lt;!&ndash;<button class="btn btn-primary btn-lg noFocus w-100">Create</button>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--<button class="btn btn-primary btn-lg noFocus">Create</button>-->
        <!--</div>-->
        <div class="input-group mb-3">
          <input class="form-control form-control-lg createInput noFocus"  placeholder="New room name" type="text" aria-label="Recipient's username" aria-describedby="basic-addon2">
          <!--<input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">-->
          <div class="input-group-append">
            <button class="btn btn-primary btn-lg noFocus createBtn">Create</button>
            <!--<button class="btn btn-outline-secondary" type="button">Button</button>-->
          </div>
        </div>
      </div>
      <div class="newRoom form-group">
      </div>
      sdfsdf
      <home></home>
    </div>
  </div>
</template>

<style lang="scss">
  @import 'common';

  .logo > span {
    font-size: 3em;
    color: $mainColor;
  }
  .createInput{
    border-color: $mainColor;
    &::placeholder{
      color: $mainColor;
      opacity: 0.9;
    }
  }

</style>

<script>
import Home from '@/views/Home'

export default {
  name: 'App',
  components: {
    'home': Home
  }

}
</script>
