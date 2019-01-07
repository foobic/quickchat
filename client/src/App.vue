<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    window.onpopstate = function(event) {
      // window.location.href = 'http://localhost:8080'
      window.location.replace('http://localhost:8080');

      // window.alert('location: ' + document.location + ', state: ' + JSON.stringify(event.state))
    };
  },
};
</script>
