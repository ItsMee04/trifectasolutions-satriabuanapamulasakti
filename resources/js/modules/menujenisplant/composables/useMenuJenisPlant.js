import { ref, computed, reactive } from 'vue';
import { menujenisService } from '../services/menujenisService';
import { masterplantService } from '../../masterplant/services/masterplantService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';


// Shared State
const masterplantList = ref([]);
const menujenisplant = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formMenuJenisPlant = reactive({
    id: null,
    masterplant_id: null,
    jenis: '',
});

export function useMenuJenisPlant() {

    const fetchMasterPlant = async () => {
        isLoading.value = true;
        try {
            const response = await masterplantService.getMasterPlant();
            masterplantList.value = response.data.map(item => ({
                value: Number(item.id),
                label: item.plant
            }));
        } catch (error) {
            masterplantList.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    const fetchMenuJenisPlant = async () => {
        isLoading.value = true;
        try {
            const response = await menujenisService.getMenuJenisPlant();
            menujenisplant.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            menujenisplant.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formMenuJenisPlant.masterplant_id) {
            errors.value.masterplant_id = 'Master Plant tidak boleh kosong.';
        }
        if (!formMenuJenisPlant.jenis) {
            errors.value.jenis = 'Jenis Menu Plant tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitMenuJenisPlant = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                masterplant_id: formMenuJenisPlant.masterplant_id,
                menujenis: formMenuJenisPlant.jenis
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formMenuJenisPlant.id;
                response = await menujenisService.updateMenuJenisPlant(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await menujenisService.storeMenuJenisPlant(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalMenuJenisPlant');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchMenuJenisPlant();

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
        formMenuJenisPlant.id = null;
        formMenuJenisPlant.masterplant_id = null;
        formMenuJenisPlant.jenis = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalMenuJenisPlant'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formMenuJenisPlant.id = item.id;
        formMenuJenisPlant.masterplant_id = item.masterplant_id;
        formMenuJenisPlant.jenis = item.menujenis;
        const modal = new bootstrap.Modal(document.getElementById('modalMenuJenisPlant'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Jenis Plant "${item.menujenis}" yang dihapus tidak dapat dikembalikan!`,
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
                await menujenisService.deleteMenuJenisPlant(payload);

                toastfy.success('Plant berhasil dihapus.');

                // Memanggil fetchMenuJenisPlant agar tabel terupdate otomatis tanpa reload
                await fetchMenuJenisPlant();
            } catch (error) {
                console.error('Gagal menghapus data Plant:', error);
                toastfy.error('Gagal menghapus data Plant.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchMenuJenisPlant();
    }

    // --- Tambahkan Logic Pagination ---
    const totalPages = computed(() => {
        const filteredCount = menujenisplant.value.filter(item =>
            (item.masterplant?.plant || '')
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||

            (item.menujenis || '')
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase())
        ).length;

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
        menujenisplant, isLoading, searchQuery, currentPage, isEdit, formMenuJenisPlant, errors, totalPages, displayedPages,
        filteredMenuJenisPlant: computed(() => {
            const query = searchQuery.value.toLowerCase();

            return menujenisplant.value.filter(item => (
                (item.masterplant?.plant || '')
                    .toLowerCase()
                    .includes(query) ||

                (item.menujenis || '')
                    .toLowerCase()
                    .includes(query)
            ));
        }),
        paginatedMenuJenisPlant: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;

            return menujenisplant.value
                .filter(item => (
                    (item.masterplant?.plant || '')
                        .toLowerCase()
                        .includes(searchQuery.value.toLowerCase()) ||

                    (item.menujenis || '')
                        .toLowerCase()
                        .includes(searchQuery.value.toLowerCase())
                ))
                .slice(start, start + itemsPerPage);
        }),
        fetchMenuJenisPlant, handleCreate, handleEdit, handleDelete, handleRefresh, submitMenuJenisPlant, fetchMasterPlant, masterplantList
    };
}
