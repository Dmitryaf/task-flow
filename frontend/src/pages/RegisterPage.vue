<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const name = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleRegister = async () => {
  const success = await authStore.register({
    email: email.value,
    name: name.value,
    password: password.value,
  });

  if (success) {
    router.push('/board');
  }
};
</script>

<template>
  <div class="register-container">
    <h2>Register to TaskFlow</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <div>
        <input v-model="name" type="name" placeholder="Name" required />
      </div>
      <div>
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Loading...' : 'Login' }}
      </button>

      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      <p>
        Already have an account ?

        <router-link to="/login">Login</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.register-container {
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
