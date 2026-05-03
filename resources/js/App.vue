<template>
    <router-view></router-view>
</template>
<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
    // 1. Cek apakah ada token di localStorage
    // 2. Jika ada, panggil API /api/me untuk ambil data user & modules
    await authStore.checkAuth();
});
</script>
