// services/timbanganampService.js
import apiClient from '@/utilities/apiClient';

export const timbanganampService = {
    // Sesuai: api/timbangan/asphaltmixingplant [GET]
    async getTimbanganAMP() {
        const response = await apiClient.get('/timbangan/asphaltmixingplant');
        return response.data;
    },

    async storeTimbanganAMP(payload) {
        const response = await apiClient.post('/timbangan/asphaltmixingplant/store', payload);
        return response.data;
    },

    async updateTimbanganAMP(payload) {
        const response = await apiClient.post('/timbangan/asphaltmixingplant/update', payload);
        return response.data;
    },

    async deleteTimbanganAMP(payload) {
        const response = await apiClient.post('/timbangan/asphaltmixingplant/delete', payload);
        return response.data;
    },
};
