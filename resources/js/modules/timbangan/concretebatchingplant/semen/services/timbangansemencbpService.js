// services/timbangansemencbpService.js
import apiClient from '@/utilities/apiClient';

export const timbangansemencbpService = {
    // Sesuai: api/timbangan/concretebatchingplant [GET]
    async getTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/semen', payload);
        return response.data;
    },

    async storeTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/semen/store', payload);
        return response.data;
    },

    async updateTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/semen/update', payload);
        return response.data;
    },

    async deleteTimbanganCBP(payload) {
        const response = await apiClient.post('/timbangan/concretebatchingplant/semen/delete', payload);
        return response.data;
    },
};
