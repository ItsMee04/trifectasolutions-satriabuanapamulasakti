// services/timbangancbpService.js
import apiClient from '@/utilities/apiClient';

export const timbangancbpService = {
    async getMenuJenisCBP() {
        const response = await apiClient.get('/timbangan/concretebatchingplant/menujenis');
        return response.data;
    },
};
