import { ref, computed, reactive } from 'vue';
import { kategoriService } from '../services/kategoriService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const kategoris = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formKategori = reactive({
    id: null,
    kategori: '',
});

export function useKategori() {

    const fetchKategori = async () => {
        isLoading.value = true;
        try {
            const response = await kategoriService.getKategori();
            kategoris.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            kategoris.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formKategori.kategori || formKategori.kategori.trim() === '') {
            errors.value.kategori = 'Kategori tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitKategori = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                kategori: formKategori.kategori,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formKategori.id;
                response = await kategoriService.updateKategori(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await kategoriService.storeKategori(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalKategori');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchKategori();

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
        formKategori.id = null;
        formKategori.kategori = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalKategori'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formKategori.id = item.id;
        formKategori.kategori = item.kategori;
        const modal = new bootstrap.Modal(document.getElementById('modalKategori'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Kategori "${item.kategori}" yang dihapus tidak dapat dikembalikan!`,
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
                await kategoriService.deleteKategori(payload);

                toastfy.success('Kategori berhasil dihapus.');

                // Memanggil fetchKategori agar tabel terupdate otomatis tanpa reload
                await fetchKategori();
            } catch (error) {
                console.error('Gagal menghapus data Kategori:', error);
                toastfy.error('Gagal menghapus data Kategori.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchKategori();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = kategoris.value.filter(item =>
            (item.kategori || '').toLowerCase().includes(query)
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
        kategoris, isLoading, searchQuery, currentPage, isEdit, formKategori, errors, totalPages, displayedPages, // Pastikan ini di-return,
        filteredKategori: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return kategoris.value.filter(item => {
                return (
                    (item.kategori || '').toLowerCase().includes(query) // Pastikan path relasi role benar
                );
            });
        }),
        paginatedKategori: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const filtered = kategoris.value.filter(item => {
                return (
                    (item.kategori || '').toLowerCase().includes(query)
                );
            });
            const start = (currentPage.value - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }),
        fetchKategori, handleCreate, handleEdit, handleDelete, handleRefresh, submitKategori
    };
}
