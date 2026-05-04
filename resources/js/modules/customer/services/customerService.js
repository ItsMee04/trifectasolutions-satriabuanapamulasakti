// services/customerService.js
import apiClient from '@/utilities/apiClient';

export const customerService = {
    // Sesuai: api/master/customer [GET]
    async getCustomer() {
        const response = await apiClient.get('/master/customer');
        return response.data;
    },

    // Sesuai: api/master/customer/store [POST]
    async storeCustomer(payload) {
        const response = await apiClient.post('/master/customer/store', payload);
        return response.data;
    },

    // Sesuai: api/master/customer/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateCustomer(payload) {
        const response = await apiClient.post('/master/customer/update', payload);
        return response.data;
    },

    // Sesuai: api/master/customer/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteCustomer(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/customer/delete', { data: payload });
        return response.data;
    }
};
