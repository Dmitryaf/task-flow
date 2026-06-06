<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  const success = await authStore.login({ email: email.value, password: password.value });

  if (success) {
    router.push('/board');
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Login to TaskFlow</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <div>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Loading...' : 'Login' }}
      </button>

      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      <p>
        Don't have an account ?

        <router-link to="/register">Register</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
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
