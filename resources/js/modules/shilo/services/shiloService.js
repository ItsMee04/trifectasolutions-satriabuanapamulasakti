// services/shiloService.js
import apiClient from '@/utilities/apiClient';

export const shiloService = {
    // Sesuai: api/master/shilo [GET]
    async getShilo() {
        const response = await apiClient.get('/master/shilo');
        return response.data;
    },

    // Sesuai: api/master/shilo/store [POST]
    async storeShilo(payload) {
        const response = await apiClient.post('/master/shilo/store', payload);
        return response.data;
    },

    // Sesuai: api/master/shilo/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateShilo(payload) {
        const response = await apiClient.post('/master/shilo/update', payload);
        return response.data;
    },

    // Sesuai: api/master/shilo/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteShilo(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/shilo/delete', { data: payload });
        return response.data;
    }
};
