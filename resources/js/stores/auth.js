import { defineStore } from 'pinia'
import router from '@/router'
import { AuthenticationService } from '../modules/authentication/services/authenticationService'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        modules: [],
        permissions: [], // <-- 1. TAMBAHKAN STATE PERMISSIONS
        isAuthenticated: false,
        isLoading: false,
        authToken: localStorage.getItem('token') || null
    }),

    actions: {
        async loginUser(credentials) {
            this.isLoading = true;
            try {
                const response = await AuthenticationService.login(credentials);

                // response.data berisi: { user, modules, permissions }
                this.authToken = response.token;
                this.user = response.data.user;
                this.modules = response.data.modules;
                this.permissions = response.data.permissions; // <-- 2. SIMPAN PERMISSIONS
                this.isAuthenticated = true;

                localStorage.setItem('token', response.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

                router.push('/dashboard');
            } catch (error) {
                this.clearAuthData();
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async checkAuth() {
            if (!this.authToken) return;

            this.isLoading = true;
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;

                const response = await axios.get('/api/me');

                // Sesuaikan dengan struktur response backend: response.data.data
                const resData = response.data.data;

                this.user = resData.user;
                this.modules = resData.modules;
                this.permissions = resData.permissions; // <-- 3. REFRESH PERMISSIONS
                this.isAuthenticated = true;
            } catch (error) {
                this.clearAuthData();
            } finally {
                this.isLoading = false;
            }
        },

        async logout() {
            try {
                await AuthenticationService.logout();
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                this.clearAuthData();
                router.push('/login');
            }
        },

        /**
         * ✨ ACTION BARU: updateProfile
         * Digunakan untuk sinkronisasi data user (nama/foto) setelah proses Edit Pegawai
         */
        updateProfile(newData) {
            if (this.user) {
                // Menggabungkan data user yang sudah ada dengan data baru dari response backend
                // Contoh: newData berisi { nama: '...', image: '...' }
                this.user = { ...this.user, ...newData };
            }
        },

        clearAuthData() {
            this.user = null;
            this.modules = [];
            this.permissions = []; // <-- 4. BERSIHKAN SAAT LOGOUT
            this.isAuthenticated = false;
            this.authToken = null;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
})
