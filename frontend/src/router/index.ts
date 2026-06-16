import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import BoardPage from '@/pages/BoardPage.vue';
import { ROUTE_BOARD, ROUTE_HOME, ROUTE_LOGIN, ROUTE_REGISTER } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth';

const routes = [
  { path: ROUTE_LOGIN, component: LoginPage, meta: { guestOnly: true } },
  { path: ROUTE_REGISTER, component: RegisterPage, meta: { guestOnly: true } },
  { path: ROUTE_BOARD, component: BoardPage, meta: { requiresAuth: true } },
  { path: ROUTE_HOME, redirect: ROUTE_BOARD },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isAuthenticated();

  if (to.meta.requiresAuth && !isAuth) {
    next(ROUTE_LOGIN);
  } else if (to.meta.guestOnly && isAuth) {
    next(ROUTE_BOARD);
  } else {
    next();
  }
});

export default router;
