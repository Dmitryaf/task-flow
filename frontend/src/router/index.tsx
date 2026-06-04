import { createRouter, createWebHashHistory } from "vue-router";
import BoardPage from "../pages/BoardPage.vue";
import LoginPage from "../pages/LoginPage.vue";

const routes = [
  { path: "/login", component: LoginPage },
  { path: "/board", component: BoardPage },
  { path: "/", redirect: "/board" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
