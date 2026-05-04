import { ref, computed, reactive } from 'vue';
import { driverService } from '../services/driverService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const drivers = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formDriver = reactive({
    id: null,
    nama: '',
    kontak: '',
    alamat: '',
    rekening: ''
});

export function useDrivers() {

    const fetchDriver = async () => {
        isLoading.value = true;
        try {
            const response = await driverService.getDriver();
            drivers.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            drivers.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formDriver.nama || formDriver.nama.trim() === '') {
            errors.value.nama = 'Nama Driver tidak boleh kosong.';
        }
        if (!formDriver.kontak || formDriver.kontak.trim() === '') {
            errors.value.kontak = 'Kontak Driver tidak boleh kosong.';
        }
        if (!formDriver.alamat || formDriver.alamat.trim() === '') {
            errors.value.alamat = 'Alamat Driver tidak boleh kosong.';
        }
        if (!formDriver.rekening || formDriver.rekening.trim() === '') {
            errors.value.rekening = 'Rekening Driver tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitDriver = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                nama: formDriver.nama,
                kontak: formDriver.kontak,
                alamat: formDriver.alamat,
                rekening: formDriver.rekening
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formDriver.id;
                response = await driverService.updateDriver(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await driverService.storeDriver(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalDriver');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchDriver();

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
        formDriver.id = null;
        formDriver.nama = '';
        formDriver.kontak = '';
        formDriver.alamat = '';
        formDriver.rekening = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalDriver'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formDriver.id = item.id;
        formDriver.nama = item.nama;
        formDriver.kontak = item.kontak;
        formDriver.alamat = item.alamat;
        formDriver.rekening = item.rekening;
        const modal = new bootstrap.Modal(document.getElementById('modalDriver'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Driver "${item.nama}" yang dihapus tidak dapat dikembalikan!`,
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
                await driverService.deleteDriver(payload);

                toastfy.success('Driver berhasil dihapus.');

                // Memanggil fetchDriver agar tabel terupdate otomatis tanpa reload
                await fetchDriver();
            } catch (error) {
                console.error('Gagal menghapus data Driver:', error);
                toastfy.error('Gagal menghapus data Driver.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchDriver();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = drivers.value.filter(item =>
            (item.nama || '').toLowerCase().includes(query)
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
        drivers, isLoading, searchQuery, currentPage, isEdit, formDriver, errors, totalPages, displayedPages,
        filteredDriver: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return drivers.value.filter(item => (item.nama || '').toLowerCase().includes(query));
        }),
        paginatedDriver: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (drivers.value.filter(item => (item.nama || '').toLowerCase().includes(searchQuery.value.toLowerCase())))
                .slice(start, start + itemsPerPage);
        }),
        fetchDriver, handleCreate, handleEdit, handleDelete, handleRefresh, submitDriver
    };
}
