// services/timbangancbpService.js
import apiClient from '@/utilities/apiClient';

export const timbangancbpService = {
    // Sesuai: api/timbangan/concretebatchingplant [GET]
    async getTimbanganCBP() {
        const response = await apiClient.get('/timbangan/concretebatchingplant');
        return response.data;
    },

    async storeTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/store', payload);
        return response.data;
    },

    async updateTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/update', payload);
        return response.data;
    },

    async deleteTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/delete', payload);
        return response.data;
    },
};
