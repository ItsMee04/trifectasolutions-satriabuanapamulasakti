// services/roleService.js
import apiClient from '@/utilities/apiClient';

export const roleService = {
    // Sesuai: api/master/role [GET]
    async getRoles() {
        const response = await apiClient.get('/master/role');
        return response.data;
    },

    // Sesuai: api/master/role/store [POST]
    async storeRoles(payload) {
        const response = await apiClient.post('/master/role/store', payload);
        return response.data;
    },

    // Sesuai: api/master/role/update [PUT]
    // PENTING: Gunakan .put sesuai daftar route Anda
    async updateRoles(payload) {
        const response = await apiClient.put('/master/role/update', payload);
        return response.data;
    },

    // Sesuai: api/master/role/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteRoles(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/role/delete', { data: payload });
        return response.data;
    }
};
