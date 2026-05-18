// services/timbanganscService.js
import apiClient from '@/utilities/apiClient';

export const timbanganscService = {
    // Sesuai: api/timbangan/stonecrusher [GET]
    async getTimbanganSC() {
        const response = await apiClient.get('/timbangan/stonecrusher');
        return response.data;
    },

    async getMenuJenisSC() {
        const response = await apiClient.get('/timbangan/stonecrusher/menujenis');
        return response.data;
    },

    async storeTimbanganSC(payload) {
        const response = await apiClient.post('/timbangan/stonecrusher/store', payload);
        return response.data;
    },

    async updateTimbanganSC(payload) {
        const response = await apiClient.post('/timbangan/stonecrusher/update', payload);
        return response.data;
    },

    async deleteTimbanganSC(payload) {
        const response = await apiClient.post('/timbangan/stonecrusher/delete', payload);
        return response.data;
    },


};
