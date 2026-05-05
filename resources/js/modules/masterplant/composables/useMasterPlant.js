import { ref, computed, reactive } from 'vue';
import { masterplantService } from '../services/masterplantService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const masterplant = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formMasterPlant = reactive({
    id: null,
    plant: ''
});

export function useMasterPlant() {

    const fetchMasterPlant = async () => {
        isLoading.value = true;
        try {
            const response = await masterplantService.getMasterPlant();
            masterplant.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            masterplant.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formMasterPlant.plant || formMasterPlant.plant.trim() === '') {
            errors.value.plant = 'Nama Plant tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitMasterPlant = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                plant: formMasterPlant.plant,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formMasterPlant.id;
                response = await masterplantService.updateMasterPlant(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await masterplantService.storeMasterPlant(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalMasterPlant');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchMasterPlant();

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
        formMasterPlant.id = null;
        formMasterPlant.plant = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalMasterPlant'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formMasterPlant.id = item.id;
        formMasterPlant.plant = item.plant;
        const modal = new bootstrap.Modal(document.getElementById('modalMasterPlant'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Plant "${item.plant}" yang dihapus tidak dapat dikembalikan!`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
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
                await masterplantService.deleteMasterPlant(payload);

                toastfy.success('Plant berhasil dihapus.');

                // Memanggil fetchMasterPlant agar tabel terupdate otomatis tanpa reload
                await fetchMasterPlant();
            } catch (error) {
                console.error('Gagal menghapus data Plant:', error);
                toastfy.error('Gagal menghapus data Plant.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchMasterPlant();
    }

    // --- Tambahkan Logic Pagination ---
    const totalPages = computed(() => {
        const filteredCount = masterplant.value.filter(item =>
            (item.plant || '').toLowerCase().includes(searchQuery.value.toLowerCase())
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
        masterplant, isLoading, searchQuery, currentPage, isEdit, formMasterPlant, errors, totalPages, displayedPages,
        filteredMasterPlant: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return masterplant.value.filter(item => (item.plant || '').toLowerCase().includes(query));
        }),
        paginatedMasterPlant: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (masterplant.value.filter(item => (item.plant || '').toLowerCase().includes(searchQuery.value.toLowerCase())))
                .slice(start, start + itemsPerPage);
        }),
        fetchMasterPlant, handleCreate, handleEdit, handleDelete, handleRefresh, submitMasterPlant
    };
}
