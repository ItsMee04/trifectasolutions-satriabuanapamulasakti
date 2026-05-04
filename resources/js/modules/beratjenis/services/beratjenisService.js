// services/beratjenisService.js
import apiClient from '@/utilities/apiClient';

export const beratjenisService = {
    // Sesuai: api/master/berat-jenis [GET]
    async getBeratJenis() {
        const response = await apiClient.get('/master/beratjenis');
        return response.data;
    },

    // Sesuai: api/master/berat-jenis/store [POST]
    async storeBeratJenis(payload) {
        const response = await apiClient.post('/master/beratjenis/store', payload);
        return response.data;
    },

    // Sesuai: api/master/berat-jenis/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateBeratJenis(payload) {
        const response = await apiClient.post('/master/beratjenis/update', payload);
        return response.data;
    },

    // Sesuai: api/master/berat-jenis/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteBeratJenis(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/beratjenis/delete', { data: payload });
        return response.data;
    }
};
