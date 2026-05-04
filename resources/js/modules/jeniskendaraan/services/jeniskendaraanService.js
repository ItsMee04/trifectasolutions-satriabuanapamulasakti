// services/jeniskendaraanService.js
import apiClient from '@/utilities/apiClient';

export const jeniskendaraanService = {
    // Sesuai: api/master/jeniskendaraan [GET]
    async getJenisKendaraan() {
        const response = await apiClient.get('/master/jeniskendaraan');
        return response.data;
    },

    // Sesuai: api/master/jeniskendaraan/store [POST]
    async storeJenisKendaraan(payload) {
        const response = await apiClient.post('/master/jeniskendaraan/store', payload);
        return response.data;
    },

    // Sesuai: api/master/jeniskendaraan/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateJenisKendaraan(payload) {
        const response = await apiClient.post('/master/jeniskendaraan/update', payload);
        return response.data;
    },

    // Sesuai: api/master/jeniskendaraan/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteJenisKendaraan(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/jeniskendaraan/delete', { data: payload });
        return response.data;
    }
};
