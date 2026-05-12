// services/backupService.js
import apiClient from '@/utilities/apiClient';

export const backupService = {
    // Sesuai: api/backup [GET]
    async getBackups() {
        const response = await apiClient.get('/backup');
        return response.data;
    },

    // Sesuai: api/backup/store [POST]
    async storeBackup(payload) {
        const response = await apiClient.post('/backup/generate', payload);
        return response.data;
    },

    async downloadBackup(filename) {
        const response = await apiClient.get(
            `/backup/download/${filename}`,
            {
                responseType: 'blob'
            }
        );
        const url = window.URL.createObjectURL(
            new Blob([response.data])
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    // Sesuai: api/backup/delete [DELETE]
    // PENTING: Gunakan .delete sesuai daftar route Anda
    async deleteBackup(id) {
        const response = await apiClient.delete(`/backup/delete/${id}`);
        return response.data;
    }
};
