// services/userService.js
import apiClient from '@/utilities/apiClient';

export const userService = {
    // Sesuai: api/master/user [GET]
    async getUsers() {
        const response = await apiClient.get('/master/user');
        return response.data;
    },

    // Sesuai: api/master/user/update [PUT]
    // PENTING: Gunakan .put sesuai daftar route Anda
    async updateUsers(payload) {
        const response = await apiClient.post('/master/user/update', payload);
        return response.data;
    },

    /**
     * Mengambil daftar seluruh module dan permission
     * Sesuai: GET /api/master/permission
     */
    async getPermissions() {
        const response = await apiClient.get('/master/permission');
        return response.data;
    },

    /**
     * Menyimpan perubahan hak akses user
     * Sesuai: POST /api/master/permission/update
     * Payload harus berisi: { user_id: id, permissions: [id1, id2, ...] }
     */
    /**
 * Mengirim ID lewat URL sesuai signature Controller: /api/master/permission/update/{userId}
 */
    async updatePermissions(userId, permissions) {
        const response = await apiClient.post(`/master/permission/update/${userId}`, {
            permissions: permissions
        });
        return response.data;
    }
};
