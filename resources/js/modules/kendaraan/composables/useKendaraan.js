import { ref, computed, reactive } from 'vue';
import { kendaraanService } from '../services/kendaraanService';
import { jeniskendaraanService } from '../../jeniskendaraan/services/jeniskendaraanService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const kendaraans = ref([]);
const jeniskendaranList = ref([])
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formKendaraan = reactive({
    id: null,
    kode: '',
    kendaraan: '',
    jenis: null,
    nomor: '',
});

export function useKendaraan() {

    const fetchKendaraan = async () => {
        isLoading.value = true;
        try {
            const response = await kendaraanService.getKendaraan();
            kendaraans.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            kendaraans.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const fetchJenisKendaraan = async () => {
        try {
            const response = await jeniskendaraanService.getJenisKendaraan();
            // Map data agar formatnya { value: id, label: 'nama' } sesuai standar Multiselect
            jeniskendaranList.value = response.data.map(jeniskendaranList => ({
                value: jeniskendaranList.id,
                label: jeniskendaranList.jenis // Sesuaikan field 'role' dengan nama kolom di tabel roles Anda
            }));
        } catch (error) {
            console.error("Gagal memuat Jenis Kendaraan:", error);
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formKendaraan.kode || formKendaraan.kode.trim() === '') {
            errors.value.kode = 'Kode Kendaraan tidak boleh kosong.';
        }
        if (!formKendaraan.kendaraan || formKendaraan.kendaraan.trim() === '') {
            errors.value.kendaraan = 'Nama Kendaraan tidak boleh kosong.';
        }
        // 4. TAMBAHKAN validasi kategori
        if (!formKendaraan.jenis) {
            errors.value.jenis = 'Pilih Jenis Kendaraan terlebih dahulu.';
        }
        if (!formKendaraan.nomor || formKendaraan.nomor.trim() === '') {
            errors.value.nomor = 'Nomor Kendaraan tidak boleh kosong.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitKendaraan = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                kode: formKendaraan.kode,
                kendaraan: formKendaraan.kendaraan,
                jenis: formKendaraan.jenis,
                nomor: formKendaraan.nomor,
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formKendaraan.id;
                response = await kendaraanService.updateKendaraan(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await kendaraanService.storeKendaraan(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalKendaraan');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchKendaraan();

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
        formKendaraan.id = null;
        formKendaraan.kode = '';
        formKendaraan.kendaraan = '';
        formKendaraan.jenis = '';
        formKendaraan.nomor = '';
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalKendaraan'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formKendaraan.id = item.id;
        formKendaraan.kode = item.kode;
        formKendaraan.kendaraan = item.kendaraan;
        formKendaraan.jenis = item.jenis_id;
        formKendaraan.nomor = item.nomor;
        const modal = new bootstrap.Modal(document.getElementById('modalKendaraan'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Kendaraan "${item.kendaraan}" yang dihapus tidak dapat dikembalikan!`,
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
                await kendaraanService.deleteKendaraan(payload);

                toastfy.success('Kendaraan berhasil dihapus.');

                // Memanggil fetchKendaraan agar tabel terupdate otomatis tanpa reload
                await fetchKendaraan();
            } catch (error) {
                console.error('Gagal menghapus data Kendaraan:', error);
                toastfy.error('Gagal menghapus data Kendaraan.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchKendaraan();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = kendaraans.value.filter(item =>
            (item.kode || '').toLowerCase().includes(query) ||
            (item.kendaraan || '').toLowerCase().includes(query) ||
            (item.jenis?.jenis || '').toLowerCase().includes(query) ||
            (item.nomor || '').toLowerCase().includes(query)
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
        kendaraans, jeniskendaranList, isLoading, searchQuery, currentPage, isEdit, formKendaraan, errors, totalPages, displayedPages,
        filteredKendaraan: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return kendaraans.value.filter(item => {
                return (
                    (item.kode || '').toLowerCase().includes(query) ||
                    (item.kendaraan || '').toLowerCase().includes(query) ||
                    (item.jeniskendaraan?.jenis || '').toLowerCase().includes(query) ||
                    (item.nomor || '').toLowerCase().includes(query) // Pastikan path relasi role benar
                );
            });
        }),
        paginatedKendaraan: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const filtered = kendaraans.value.filter(item => {
                return (
                    (item.kode || '').toLowerCase().includes(query) ||
                    (item.kendaraan || '').toLowerCase().includes(query) ||
                    (item.jeniskendaraan?.jenis || '').toLowerCase().includes(query) ||
                    (item.nomor || '').toLowerCase().includes(query)
                );
            });
            const start = (currentPage.value - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }),
        fetchKendaraan, fetchJenisKendaraan, handleCreate, handleEdit, handleDelete, handleRefresh, submitKendaraan
    };
}
