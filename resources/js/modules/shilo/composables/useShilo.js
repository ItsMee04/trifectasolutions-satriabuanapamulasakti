import { ref, computed, reactive } from 'vue';
import { shiloService } from '../services/shiloService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const Shilos = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formShilo = reactive({
    id: null,
    shilo: '',
});

export function useShilo() {

    const fetchShilo = async () => {
        isLoading.value = true;
        try {
            const response = await shiloService.getShilo();
            Shilos.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            Shilos.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formShilo.shilo || formShilo.shilo === null) {
            errors.value.nomor = 'Shilo tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitShilo = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                shilo: formShilo.shilo,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formShilo.id;
                response = await shiloService.updateShilo(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await shiloService.storeShilo(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalShilo');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchShilo();

            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                // 1. Simpan error untuk ditampilkan di bawah input field
                errors.value = error.response.data.errors;

                // 2. ✨ TAMBAHKAN INI: Munculkan notify agar user tahu ada yang salah
                const firstErrorMessage = error.response.data.message || 'Terjadi kesalahan validasi.';
                toastfy.error(firstErrorMessage);
            } else {
                // Untuk error server (500), koneksi, dsb.
                toastfy.error(error.response?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleCreate = () => {
        isEdit.value = false;
        formShilo.id = null;
        formShilo.shilo = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalShilo'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formShilo.id = item.id;
        formShilo.shilo = item.shilo;
        const modal = new bootstrap.Modal(document.getElementById('modalShilo'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Shilo "${item.shilo}" yang dihapus tidak dapat dikembalikan!`,
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
                await shiloService.deleteShilo(payload);

                toastfy.success('Shilo berhasil dihapus.');

                // Memanggil fetch Shilo agar tabel terupdate otomatis tanpa reload
                await fetch();
            } catch (error) {
                console.error('Gagal menghapus data Shilo:', error);
                toastfy.error('Gagal menghapus data Shilo.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchShilo();
    }

    // Helper function untuk konversi string secara aman
    const getSafeString = (val) => String(val ?? '').toLowerCase();

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase();
        const filteredCount = Shilos.value.filter(item =>
            // PERBAIKAN: Gunakan String()
            getSafeString(item.shilo).includes(query)
        ).length;

        return Math.ceil(filteredCount / itemsPerPage) || 1;
    });

    const displayedPages = computed(() => {
        // ... (logic pagination tetap sama)
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
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    });

    return {
        Shilos, isLoading, searchQuery, currentPage, isEdit, formShilo, errors, totalPages, displayedPages,

        filteredShilo: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return Shilos.value.filter(item =>
                // PERBAIKAN: Gunakan String()
                getSafeString(item.shilo).includes(query)
            );
        }),

        paginatedShilo: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const start = (currentPage.value - 1) * itemsPerPage;

            // PERBAIKAN: Gunakan String() dan pastikan logic filter dilakukan sebelum slice
            const filtered = Shilos.value.filter(item =>
                getSafeString(item.shilo).includes(query)
            );

            return filtered.slice(start, start + itemsPerPage);
        }),

        fetchShilo, handleCreate, handleEdit, handleDelete, handleRefresh, submitShilo
    };
}
