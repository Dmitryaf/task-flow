<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div>
    <h1>TaskFlow Board</h1>
    <p>Welcome, {{ authStore.user?.name }}!</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>
