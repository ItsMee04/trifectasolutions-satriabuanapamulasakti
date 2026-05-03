import apiClient from '../../../utilities/apiClient';

export const AuthenticationService = {
    async login(credentials) {
        const response = await apiClient.post('/login', credentials);
        // Kita ambil .data agar Store menerima { status, data, token }
        return response.data;
    },

    async logout() {
        const response = await apiClient.post('/logout');
        return response.data;
    }
};
