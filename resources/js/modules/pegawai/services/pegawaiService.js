// services/pegawaiService.js
import apiClient from '@/utilities/apiClient';

export const pegawaiService = {
    // Sesuai: api/master/pegawai [GET]
    async getPegawai() {
        const response = await apiClient.get('/master/pegawai');
        return response.data;
    },

    // Sesuai: api/master/pegawai/store [POST]
    async storePegawai(payload) {
        const response = await apiClient.post('/master/pegawai/store', payload);
        return response.data;
    },

    // Sesuai: api/master/pegawai/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updatePegawai(payload) {
        const response = await apiClient.post('/master/pegawai/update', payload);
        return response.data;
    },

    // Sesuai: api/master/pegawai/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deletePegawai(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/pegawai/delete', { data: payload });
        return response.data;
    }
};
