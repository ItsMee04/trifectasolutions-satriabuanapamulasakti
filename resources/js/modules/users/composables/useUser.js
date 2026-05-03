import { ref, computed, reactive } from 'vue';
import { userService } from '../services/userService';
import { toastfy } from '../../../utilities/toast';
import { roleService } from '../../role/services/roleService';

// Shared State
const users = ref([]);
const roles = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

// State untuk Permission
const masterPermissions = ref([]);
const userPermissions = ref([]); // Pastikan nama ini konsisten
const selectedUser = ref(null);

const formUsers = reactive({
    id: null,
    nama: '',
    email: '',
    password: '',
    role_id: null,
});

export function useUser() {

    const fetchUsers = async () => {
        isLoading.value = true;
        try {
            const response = await userService.getUsers();
            users.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            users.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await roleService.getRoles();
            roles.value = response.data.map(role => ({
                value: role.id,
                label: role.role
            }));
        } catch (error) {
            console.error("Gagal memuat roles:", error);
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formUsers.email || formUsers.email.trim() === '') {
            errors.value.email = 'Email tidak boleh kosong.';
        }
        if (!formUsers.role_id) {
            errors.value.role_id = 'Pilih Role terlebih dahulu.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const submitUsers = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formUsers.id,
                email: formUsers.email,
                password: formUsers.password,
                role_id: formUsers.role_id
            };

            let response;
            if (isEdit.value) {
                response = await userService.updateUsers(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalUsers');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchUsers();
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
                const firstErrorMessage = error.response.data.message || 'Terjadi kesalahan validasi.';
                toastfy.error(firstErrorMessage);
            } else {
                toastfy.error(error.response?.data?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formUsers.id = item.id;
        formUsers.nama = item.pegawai?.nama || '-';
        formUsers.email = item.email;
        formUsers.password = '';
        formUsers.role_id = item.role_id;

        const modal = new bootstrap.Modal(document.getElementById('modalUsers'));
        modal.show();
    };

    // --- LOGIC PERMISSION ---
    const fetchMasterPermissions = async () => {
        // Cek cache: jika sudah ada data, jangan panggil API lagi
        if (masterPermissions.value.length > 0) return;

        isLoading.value = true;
        try {
            const res = await userService.getPermissions();
            masterPermissions.value = res.data;
        } catch (error) {
            toastfy.error("Gagal memuat daftar hak akses");
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    };

    const handlePermission = async (user) => {
        selectedUser.value = user;

        // Load master data jika belum ada
        if (masterPermissions.value.length === 0) {
            await fetchMasterPermissions();
        }

        // PROSES INI YANG MEMBUAT CHECKBOX AKTIF:
        if (user.permissions) {
            // Ambil ID dari array objects 'permissions' yang ada di JSON response Anda
            userPermissions.value = user.permissions.map(p => Number(p.id));
        } else {
            userPermissions.value = [];
        }

        // Munculkan modal
        const modalElement = document.getElementById('modalPermission');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    };

    const submitPermissions = async () => {
        if (!selectedUser.value) return;

        isLoading.value = true;
        try {
            // Kirim userId sebagai argumen pertama, array permissions sebagai argumen kedua
            const response = await userService.updatePermissions(
                selectedUser.value.id,
                userPermissions.value
            );

            if (response.success) {
                toastfy.success(response.message);

                const modalElement = document.getElementById('modalPermission');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                await fetchUsers();
            }
        } catch (error) {
            toastfy.error("Gagal menyimpan hak akses");
        } finally {
            isLoading.value = false;
        }
    };

    const handleRefresh = async () => {
        await fetchUsers();
    }

    // --- PAGINATION LOGIC ---
    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase();
        const filteredCount = users.value.filter(item =>
            (item.pegawai?.nama || '').toLowerCase().includes(query) ||
            (item.email || '').toLowerCase().includes(query) ||
            (item.role?.role || '').toLowerCase().includes(query)
        ).length;
        return Math.ceil(filteredCount / itemsPerPage) || 1;
    });

    const displayedPages = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const maxVisible = 5;
        let start = Math.max(current - Math.floor(maxVisible / 2), 1);
        let end = start + maxVisible - 1;
        if (end > total) {
            end = total;
            start = Math.max(end - maxVisible + 1, 1);
        }
        const pages = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    });

    return {
        // State
        users, roles, isLoading, searchQuery, currentPage, isEdit, formUsers, errors, totalPages, displayedPages,
        masterPermissions, userPermissions, selectedUser, // Tambahkan ini di return

        // Computed
        filteredUsers: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return users.value.filter(item =>
                (item.pegawai?.nama || '').toLowerCase().includes(query) ||
                (item.email || '').toLowerCase().includes(query) ||
                (item.role?.role || '').toLowerCase().includes(query)
            );
        }),
        paginatedUsers: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const filtered = users.value.filter(item =>
                (item.pegawai?.nama || '').toLowerCase().includes(query) ||
                (item.email || '').toLowerCase().includes(query) ||
                (item.role?.role || '').toLowerCase().includes(query)
            );
            const start = (currentPage.value - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }),

        // Methods
        fetchUsers, fetchRoles, handleEdit, handleRefresh, submitUsers,
        handlePermission, fetchMasterPermissions, submitPermissions // Tambahkan ini di return
    };
}
