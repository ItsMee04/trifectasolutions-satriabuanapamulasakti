import { ref, computed, reactive } from 'vue';
import { suplierService } from '../services/suplierService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const supliers = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formSuplier = reactive({
    id: null,
    nama: '',
    kontak: '',
    alamat: '',
});

export function useSuplier() {

    const fetchSuplier = async () => {
        isLoading.value = true;
        try {
            const response = await suplierService.getSuplier();
            supliers.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            supliers.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formSuplier.nama || formSuplier.nama.trim() === '') {
            errors.value.nama = 'Nama Suplier tidak boleh kosong.';
        }
        if (!formSuplier.kontak || formSuplier.kontak.trim() === '') {
            errors.value.kontak = 'Kontak Suplier tidak boleh kosong.';
        }
        if (!formSuplier.alamat || formSuplier.alamat.trim() === '') {
            errors.value.alamat = 'Alamat Suplier tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitSuplier = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                nama: formSuplier.nama,
                kontak: formSuplier.kontak,
                alamat: formSuplier.alamat,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formSuplier.id;
                response = await suplierService.updateSuplier(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await suplierService.storeSuplier(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalSuplier');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchSuplier();

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
        formSuplier.id = null;
        formSuplier.nama = '';
        formSuplier.kontak = '';
        formSuplier.alamat = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalSuplier'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formSuplier.id = item.id;
        formSuplier.nama = item.nama;
        formSuplier.kontak = item.kontak;
        formSuplier.alamat = item.alamat;
        const modal = new bootstrap.Modal(document.getElementById('modalSuplier'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Suplier "${item.nama}" yang dihapus tidak dapat dikembalikan!`,
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
                await suplierService.deleteSuplier(payload);

                toastfy.success('Suplier berhasil dihapus.');

                // Memanggil fetchSuplier agar tabel terupdate otomatis tanpa reload
                await fetchSuplier();
            } catch (error) {
                console.error('Gagal menghapus data Suplier:', error);
                toastfy.error('Gagal menghapus data Suplier.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchSuplier();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = supliers.value.filter(item =>
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
        supliers, isLoading, searchQuery, currentPage, isEdit, formSuplier, errors, totalPages, displayedPages,
        filteredSuplier: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return supliers.value.filter(item => (item.nama || '').toLowerCase().includes(query));
        }),
        paginatedSuplier: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (supliers.value.filter(item => (item.nama || '').toLowerCase().includes(searchQuery.value.toLowerCase())))
                .slice(start, start + itemsPerPage);
        }),
        fetchSuplier, handleCreate, handleEdit, handleDelete, handleRefresh, submitSuplier
    };
}
