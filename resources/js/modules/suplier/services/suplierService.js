// services/suplierService.js
import apiClient from '@/utilities/apiClient';

export const suplierService = {
    // Sesuai: api/master/suplier [GET]
    async getSuplier() {
        const response = await apiClient.get('/master/suplier');
        return response.data;
    },

    // Sesuai: api/master/suplier/store [POST]
    async storeSuplier(payload) {
        const response = await apiClient.post('/master/suplier/store', payload);
        return response.data;
    },

    // Sesuai: api/master/suplier/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateSuplier(payload) {
        const response = await apiClient.post('/master/suplier/update', payload);
        return response.data;
    },

    // Sesuai: api/master/suplier/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteSuplier(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/suplier/delete', { data: payload });
        return response.data;
    }
};
