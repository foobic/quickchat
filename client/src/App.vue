<template>
  <div id="app">
    <!--<router-link tag="li" to="/about">-->
      <!--<a>about</a>-->
    <!--</router-link>-->
    <!--<router-link tag="li" to="/">-->
      <!--<a>home</a>-->
    <!--</router-link>-->
    <router-view></router-view>
      <!--<home></home>-->
  </div>
</template>

<script>
import Home from '@/views/Home'

export default {
  name: 'App',
  // components: {
  //   'home': Home
  // }

}
</script>
