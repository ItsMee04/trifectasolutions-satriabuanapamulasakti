// services/kategoriService.js
import apiClient from '@/utilities/apiClient';

export const kategoriService = {
    // Sesuai: api/master/kategori [GET]
    async getKategori() {
        const response = await apiClient.get('/master/kategori');
        return response.data;
    },

    // Sesuai: api/master/kategori/store [POST]
    async storeKategori(payload) {
        const response = await apiClient.post('/master/kategori/store', payload);
        return response.data;
    },

    // Sesuai: api/master/kategori/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateKategori(payload) {
        const response = await apiClient.post('/master/kategori/update', payload);
        return response.data;
    },

    // Sesuai: api/master/kategori/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteKategori(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/kategori/delete', { data: payload });
        return response.data;
    }
};
