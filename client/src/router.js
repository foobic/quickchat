/* eslint-disable prettier/prettier */
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
        title: 'Room:name',
      },
    },
    {
      path: '*',
      component: PageNotFound,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.

    //   component: About,
    //   meta: {
    //     title: 'About',
    //   },
    //   // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // },
  ],
});
