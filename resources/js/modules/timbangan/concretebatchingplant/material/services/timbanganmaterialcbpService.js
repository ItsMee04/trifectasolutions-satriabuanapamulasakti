// services/timbanganmaterialcbpService.js
import apiClient from '@/utilities/apiClient';

export const timbanganmaterialcbpService = {
    // Sesuai: api/timbangan/concretebatchingplant [GET]
    async getTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/material', payload);
        return response.data;
    },

    async storeTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/material/store', payload);
        return response.data;
    },

    async updateTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/material/update', payload);
        return response.data;
    },

    async deleteTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/material/delete', payload);
        return response.data;
    },
};
