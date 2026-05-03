// resources/js/Helper/apiClient.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true
});

apiClient.interceptors.request.use(config => {
    const authStore = useAuthStore();
    // Gunakan authToken yang disimpan di Pinia (baik dari local/session storage)
    if (authStore.authToken) {
        config.headers.Authorization = `Bearer ${authStore.authToken}`;
    }
    return config;
});

export default apiClient;
