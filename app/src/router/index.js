import Vue from "vue";
import VueRouter from "vue-router";
import AddComic from "../views/local/AddComic.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "AddComic",
    component: AddComic,
    // redirect: { name: 'History' }
  },
  {
    path: "/list",
    name: "List",
    component: () =>
      import(/* webpackChunkName: "ComicList" */ "../views/local/ComicList.vue"),
  },
  {
    path: "/chapter-list",
    name: "ChapterList",
    component: () =>
      import(/* webpackChunkName: "ChapterList" */ "../views/local/ChapterList.vue"),
  },
  {
    path: "/read",
    name: "Read",
    component: () =>
      import(/* webpackChunkName: "Read" */ "../views/local/Read.vue"),
  },
  {
    path: "/history",
    name: "History",
    component: () =>
      import(/* webpackChunkName: "history" */ "../views/local/History.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/spider",
    name: "Spider",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/crawler/Manhuafen.vue"),
  },
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes,
});

export default router;
