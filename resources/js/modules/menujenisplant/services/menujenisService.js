// services/menujenisService.js
import apiClient from '@/utilities/apiClient';

export const menujenisService = {
    // Sesuai: api/master/menujenisplant [GET]
    async getMenuJenisPlant() {
        const response = await apiClient.get('/master/menujenisplant');
        return response.data;
    },

    // Sesuai: api/master/menujenisplant/store [POST]
    async storeMenuJenisPlant(payload) {
        const response = await apiClient.post('/master/menujenisplant/store', payload);
        return response.data;
    },

    // Sesuai: api/master/menujenisplant/update [PUT]
    // PENTING: Gunakan .put sesuai daftar route Anda
    async updateMenuJenisPlant(payload) {
        const response = await apiClient.post('/master/menujenisplant/update', payload);
        return response.data;
    },

    // Sesuai: api/master/menujenisplant/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteMenuJenisPlant(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/menujenisplant/delete', { data: payload });
        return response.data;
    },

    async getMenuJenisPlantById(payload) {
        const response = await apiClient.get('/master/menujenisplant/', { data: payload });
        return response.data;
    }
};
