// services/masterplantService.js
import apiClient from '@/utilities/apiClient';

export const masterplantService = {
    // Sesuai: api/master/masterplant [GET]
    async getMasterPlant() {
        const response = await apiClient.get('/master/masterplant');
        return response.data;
    },

    // Sesuai: api/master/masterplant/store [POST]
    async storeMasterPlant(payload) {
        const response = await apiClient.post('/master/masterplant/store', payload);
        return response.data;
    },

    // Sesuai: api/master/masterplant/update [PUT]
    // PENTING: Gunakan .put sesuai daftar route Anda
    async updateMasterPlant(payload) {
        const response = await apiClient.put('/master/masterplant/update', payload);
        return response.data;
    },

    // Sesuai: api/master/masterplant/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteMasterPlant(payload) {
        // Jika payload berisi { id: 1 }, axios.delete butuh konfigurasi data
        const response = await apiClient.delete('/master/masterplant/delete', { data: payload });
        return response.data;
    }
};
