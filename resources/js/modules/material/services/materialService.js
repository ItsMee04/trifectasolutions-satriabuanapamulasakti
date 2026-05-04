// services/materialService.js
import apiClient from '@/utilities/apiClient';

export const materialService = {
    // Sesuai: api/master/material [GET]
    async getMaterial() {
        const response = await apiClient.get('/master/material');
        return response.data;
    },

    // Sesuai: api/master/material/store [POST]
    async storeMaterial(payload) {
        const response = await apiClient.post('/master/material/store', payload);
        return response.data;
    },

    // Sesuai: api/master/material/update [POST]
    // PENTING: Gunakan .post sesuai daftar route Anda
    async updateMaterial(payload) {
        const response = await apiClient.post('/master/material/update', payload);
        return response.data;
    },

    // Sesuai: api/master/material/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteMaterial(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/material/delete', { data: payload });
        return response.data;
    }
};
