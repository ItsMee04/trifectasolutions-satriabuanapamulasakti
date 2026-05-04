// services/driverService.js
import apiClient from '@/utilities/apiClient';

export const driverService = {
    // Sesuai: api/master/driver [GET]
    async getDriver() {
        const response = await apiClient.get('/master/driver');
        return response.data;
    },

    // Sesuai: api/master/driver/store [POST]
    async storeDriver(payload) {
        const response = await apiClient.post('/master/driver/store', payload);
        return response.data;
    },

    // Sesuai: api/master/driver/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateDriver(payload) {
        const response = await apiClient.post('/master/driver/update', payload);
        return response.data;
    },

    // Sesuai: api/master/driver/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteDriver(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/driver/delete', { data: payload });
        return response.data;
    }
};
