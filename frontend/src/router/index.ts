import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import BoardPage from '@/pages/BoardPage.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/board', component: BoardPage },
  { path: '/', redirect: '/board' },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = !!localStorage.getItem('token');
  if (to.path === '/board' && !isAuth) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && isAuth) {
    next('/board');
  } else {
    next();
  }
});

export default router;
