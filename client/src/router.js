import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Room from './views/Room.vue';
import PageNotFound from './views/Errors/PageNotFound.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/room/:name',
      name: 'room',
      component: Room,
      meta: {
        title: 'Room',
      },
    },
    {
      path: '*',
      component: PageNotFound,
    },
  ],
});
