<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ROUTE_BOARD, ROUTE_LOGIN, ROUTE_REGISTER } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  mode: 'login' | 'register';
}>();

const email = ref('');
const name = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const isLogin = computed(() => props.mode === 'login');
const title = computed(() => (isLogin.value ? 'Login to TaskFlow' : 'Register to TaskFlow'));
const submitLabel = computed(() => (isLogin.value ? 'Login' : 'Register'));
const alternateText = computed(() =>
  isLogin.value ? "Don't have an account ?" : 'Already have an account ?',
);
const alternateRoute = computed(() => (isLogin.value ? ROUTE_REGISTER : ROUTE_LOGIN));
const alternateLabel = computed(() => (isLogin.value ? 'Register' : 'Login'));

const handleSubmit = async () => {
  const success = isLogin.value
    ? await authStore.login({ email: email.value, password: password.value })
    : await authStore.register({
        email: email.value,
        name: name.value,
        password: password.value,
      });

  if (success) {
    router.push(ROUTE_BOARD);
  }
};
</script>

<template>
  <div class="auth-container">
    <h2>{{ title }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <div v-if="!isLogin">
        <input v-model="name" type="text" placeholder="Name" required />
      </div>
      <div>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Loading...' : submitLabel }}
      </button>

      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      <p>
        {{ alternateText }}
        <router-link :to="alternateRoute">{{ alternateLabel }}</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.error {
  color: red;
  font-size: 14px;
}
</style>
