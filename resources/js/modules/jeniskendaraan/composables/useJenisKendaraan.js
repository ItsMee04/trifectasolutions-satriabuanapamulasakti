import { ref, computed, reactive } from 'vue';
import { jeniskendaraanService } from '../services/jeniskendaraanService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const jeniskendarans = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formJenisKendaraan = reactive({
    id: null,
    jenis: '',
    indexperkm: '',
});

export function useJenisKendaraan() {

    const fetchJenisKendaraan = async () => {
        isLoading.value = true;
        try {
            const response = await jeniskendaraanService.getJenisKendaraan();
            jeniskendarans.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            jeniskendarans.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formJenisKendaraan.jenis || formJenisKendaraan.jenis.trim() === '') {
            errors.value.jenis = 'Jenis tidak boleh kosong.';
        }
        if (formJenisKendaraan.indexperkm === null || formJenisKendaraan.indexperkm === '') {
            errors.value.indexperkm = 'Index Per KM tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitJenisKendaraan = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                jenis: formJenisKendaraan.jenis,
                indexperkm: formJenisKendaraan.indexperkm,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formJenisKendaraan.id;
                response = await jeniskendaraanService.updateJenisKendaraan(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await jeniskendaraanService.storeJenisKendaraan(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalJenisKendaraan');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchJenisKendaraan();

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
        formJenisKendaraan.id = null;
        formJenisKendaraan.jenis = '';
        formJenisKendaraan.indexperkm = '';

        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalJenisKendaraan'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formJenisKendaraan.id = item.id;
        formJenisKendaraan.jenis = item.jenis;
        formJenisKendaraan.indexperkm = item.indexperkm;

        const modal = new bootstrap.Modal(document.getElementById('modalJenisKendaraan'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Jenis Kendaraan "${item.jenis}" yang dihapus tidak dapat dikembalikan!`,
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
                await jeniskendaraanService.deleteJenisKendaraan(payload);

                toastfy.success('Jenis Kendaraan berhasil dihapus.');

                // Memanggil fetchDriver agar tabel terupdate otomatis tanpa reload
                await fetchJenisKendaraan();
            } catch (error) {
                console.error('Gagal menghapus data Jenis Kendaraan:', error);
                toastfy.error('Gagal menghapus data Jenis Kendaraan.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchJenisKendaraan();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = jeniskendarans.value.filter(item =>
            (item.jenis || '').toLowerCase().includes(query) ||
            (item.indexperkm || '').toLowerCase().includes(query)
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
        jeniskendarans, isLoading, searchQuery, currentPage, isEdit, formJenisKendaraan, errors, totalPages, displayedPages,
        filteredJenisKendaraan: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return jeniskendarans.value.filter(item =>
                (item.jenis || '').toLowerCase().includes(query) ||
                (item.indexperkm || '').toLowerCase().includes(query)
            );
        }),
        paginatedJenisKendaraan: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (jeniskendarans.value.filter(item =>
                (item.jenis || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                (item.indexperkm || '').toLowerCase().includes(searchQuery.value.toLowerCase())
            ))
                .slice(start, start + itemsPerPage);
        }),
        fetchJenisKendaraan, handleCreate, handleEdit, handleDelete, handleRefresh, submitJenisKendaraan
    };
}
