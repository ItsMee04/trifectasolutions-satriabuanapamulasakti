import { ref, computed, reactive } from 'vue';
import { beratjenisService } from '../services/beratjenisService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const BeratJeniss = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formBeratJenis = reactive({
    id: null,
    beratjenis: '',
});

export function useBeratJenis() {

    const fetchBeratJenis = async () => {
        isLoading.value = true;
        try {
            const response = await beratjenisService.getBeratJenis();
            BeratJeniss.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            BeratJeniss.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formBeratJenis.beratjenis || formBeratJenis.beratjenis === null) {
            errors.value.nomor = 'Berat Jenis tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitBeratJenis = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                beratjenis: formBeratJenis.beratjenis,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formBeratJenis.id;
                response = await beratjenisService.updateBeratJenis(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await beratjenisService.storeBeratJenis(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalBeratJenis');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchBeratJenis();

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
        formBeratJenis.id = null;
        formBeratJenis.beratjenis = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalBeratJenis'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formBeratJenis.id = item.id;
        formBeratJenis.beratjenis = item.beratjenis;
        const modal = new bootstrap.Modal(document.getElementById('modalBeratJenis'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Berat Jenis "${item.beratjenis}" yang dihapus tidak dapat dikembalikan!`,
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
                await beratjenisService.deleteBeratJenis(payload);

                toastfy.success('Berat Jenis berhasil dihapus.');

                // Memanggil fetch Berat Jenis agar tabel terupdate otomatis tanpa reload
                await fetchBeratJenis();
            } catch (error) {
                console.error('Gagal menghapus data Berat Jenis:', error);
                toastfy.error('Gagal menghapus data Berat Jenis.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchBeratJenis();
    }

    // Helper function untuk konversi string secara aman
    const getSafeString = (val) => String(val ?? '').toLowerCase();

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase();
        const filteredCount = BeratJeniss.value.filter(item =>
            // PERBAIKAN: Gunakan String()
            getSafeString(item.beratjenis).includes(query)
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
        BeratJeniss, isLoading, searchQuery, currentPage, isEdit, formBeratJenis, errors, totalPages, displayedPages,

        filteredBeratJenis: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return BeratJeniss.value.filter(item =>
                // PERBAIKAN: Gunakan String()
                getSafeString(item.beratjenis).includes(query)
            );
        }),

        paginatedBeratJenis: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const start = (currentPage.value - 1) * itemsPerPage;

            // PERBAIKAN: Gunakan String() dan pastikan logic filter dilakukan sebelum slice
            const filtered = BeratJeniss.value.filter(item =>
                getSafeString(item.beratjenis).includes(query)
            );

            return filtered.slice(start, start + itemsPerPage);
        }),

        fetchBeratJenis, handleCreate, handleEdit, handleDelete, handleRefresh, submitBeratJenis
    };
}
