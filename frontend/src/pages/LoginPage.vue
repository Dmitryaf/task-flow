<template>
    <div>
        <h2>Login</h2>
        <input v-model="email" placeholder="Email">
        <input v-model="password" placeholder="Password">
        <button type="button" @click="login">Login</button>

        <p v-if="error"> {{ error }}</p>
        <router-link to="/register">No account? Register</router-link>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { login } from '../api/login'


const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();


const loginHandler = async () => {
    error.value = await login();
}
</script>