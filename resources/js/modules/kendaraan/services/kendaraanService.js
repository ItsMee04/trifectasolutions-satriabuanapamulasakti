// services/kendaraanService.js
import apiClient from '@/utilities/apiClient';

export const kendaraanService = {
    // Sesuai: api/master/kendaraan [GET]
    async getKendaraan() {
        const response = await apiClient.get('/master/kendaraan');
        return response.data;
    },

    // Sesuai: api/master/kendaraan/store [POST]
    async storeKendaraan(payload) {
        const response = await apiClient.post('/master/kendaraan/store', payload);
        return response.data;
    },

    // Sesuai: api/master/kendaraan/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateKendaraan(payload) {
        const response = await apiClient.post('/master/kendaraan/update', payload);
        return response.data;
    },

    // Sesuai: api/master/kendaraan/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteKendaraan(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/kendaraan/delete', { data: payload });
        return response.data;
    }
};
