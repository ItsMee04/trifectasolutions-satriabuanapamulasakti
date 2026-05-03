import { ref, computed, reactive } from 'vue';
import { roleService } from '../services/roleService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const roles = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formRole = reactive({
    id: null,
    role: ''
});

export function useRole() {

    const fetchRoles = async () => {
        isLoading.value = true;
        try {
            const response = await roleService.getRoles();
            roles.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            roles.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formRole.role || formRole.role.trim() === '') {
            errors.value.role = 'Nama Role tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitRole = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                role: formRole.role,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formRole.id;
                response = await roleService.updateRoles(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await roleService.storeRoles(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalRole');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchRoles();

            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                // 1. Simpan error untuk ditampilkan di bawah input field
                errors.value = error.response.data.errors;

                // 2. ✨ TAMBAHKAN INI: Munculkan toastfy agar user tahu ada yang salah
                const firstErrorMessage = error.response.data.message || 'Terjadi kesalahan validasi.';
                toastfy.error(firstErrorMessage);
            } else {
                // Untuk error server (500), koneksi, dsb.
                toastfy.error(error.response?.data?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleCreate = () => {
        isEdit.value = false;
        formRole.id = null;
        formRole.role = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalRole'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formRole.id = item.id;
        formRole.role = item.role;
        const modal = new bootstrap.Modal(document.getElementById('modalRole'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Role "${item.role}" yang dihapus tidak dapat dikembalikan!`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true // Opsional: menukar posisi tombol Batal & Hapus
        });

        if (result.isConfirmed) {
            isLoading.value = true; // Set loading agar UI tetap konsisten [cite: 2025-10-25]
            try {
                // 📦 Siapkan Payload
                const payload = {
                    id: item.id,
                };
                // Mengirim payload id sesuai kebutuhan service Anda
                await roleService.deleteRoles(payload);

                toastfy.success('Role berhasil dihapus.');

                // Memanggil fetchRoles agar tabel terupdate otomatis tanpa reload
                await fetchRoles();
            } catch (error) {
                console.error('Gagal menghapus data Role:', error);
                toastfy.error('Gagal menghapus data Role.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchRoles();
    }

    // --- Tambahkan Logic Pagination ---
    const totalPages = computed(() => {
        const filteredCount = roles.value.filter(item =>
            (item.role || '').toLowerCase().includes(searchQuery.value.toLowerCase())
        ).length;

        // Hitung total halaman, minimal 1 halaman
        return Math.ceil(filteredCount / itemsPerPage) || 1;
    });

    const displayedPages = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const maxVisible = 5; // Jumlah nomor yang ingin ditampilkan

        let start = Math.max(current - Math.floor(maxVisible / 2), 1);
        let end = start + maxVisible - 1;

        if (end > total) {
            end = total;
            start = Math.max(end - maxVisible + 1, 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    });

    return {
        roles, isLoading, searchQuery, currentPage, isEdit, formRole, errors, totalPages, displayedPages,
        filteredRoles: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return roles.value.filter(item => (item.role || '').toLowerCase().includes(query));
        }),
        paginatedRoles: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (roles.value.filter(item => (item.role || '').toLowerCase().includes(searchQuery.value.toLowerCase())))
                .slice(start, start + itemsPerPage);
        }),
        fetchRoles, handleCreate, handleEdit, handleDelete, handleRefresh, submitRole
    };
}
