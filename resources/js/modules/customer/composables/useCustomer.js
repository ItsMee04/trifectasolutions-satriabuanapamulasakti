import { ref, computed, reactive } from 'vue';
import { customerService } from '../services/customerService';
import { masterplantService } from '../../masterplant/services/masterplantService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const customers = ref([]);
const masterplants = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({}); // Error ditaruh di shared state agar sinkron dengan modal

const formCustomer = reactive({
    id: null,
    nama: '',
    alamat: '',
    email: '',
    kontak: '',
    masterplant_ids: [],
});

export function useCustomer() {

    const fetchCustomer = async () => {
        isLoading.value = true;
        try {
            const response = await customerService.getCustomer();
            customers.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            customers.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const fetchMasterPlant = async () => {
        try {
            const response = await masterplantService.getMasterPlant();
            masterplants.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            masterplants.value = [];
        }
    };

    // --- LOGIKA VALIDASI ---
    const validateForm = () => {
        errors.value = {}; // Reset error
        if (!formCustomer.nama || formCustomer.nama.trim() === '') {
            errors.value.nama = 'Nama Customer tidak boleh kosong.';
        }
        if (formCustomer.masterplant_ids.length === 0) {
            errors.value.masterplant_ids = 'Pilih minimal satu Master Plant.';
        }
        return Object.keys(errors.value).length === 0;
    };

    // --- LOGIKA SUBMIT (STORE & UPDATE) ---
    const submitCustomer = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            // 📦 Siapkan Payload
            const payload = {
                nama: formCustomer.nama,
                alamat: formCustomer.alamat,
                kontak: formCustomer.kontak,
                email: formCustomer.email,
                masterplant_ids: formCustomer.masterplant_ids, // Sertakan array masterplant_ids
            };

            let response;
            if (isEdit.value) {
                // Mode Edit: Kirim ID dan Payload
                payload.id = formCustomer.id;
                response = await customerService.updateCustomer(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await customerService.storeCustomer(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            // Tutup Modal
            const modalElement = document.getElementById('modalCustomer');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Refresh tabel tanpa reload halaman [cite: 2025-10-25]
            await fetchCustomer();

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
        formCustomer.id = null;
        formCustomer.nama = '';
        formCustomer.email = '';
        formCustomer.kontak = '';
        formCustomer.alamat = '';
        formCustomer.masterplant_ids = [];
        errors.value = {};
        const modal = new bootstrap.Modal(document.getElementById('modalCustomer'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formCustomer.id = item.id;
        formCustomer.nama = item.nama;
        formCustomer.kontak = item.kontak;
        formCustomer.alamat = item.alamat;
        formCustomer.email = item.email;
        // ✨ PROSES EKSTRAK ID: Otomatis mencentang checkbox masterplant
        if (item.masterplants && Array.isArray(item.masterplants)) {
            // Mengambil id dari setiap object di dalam array masterplants
            formCustomer.masterplant_ids = item.masterplants.map(plant => plant.id);
        } else {
            formCustomer.masterplant_ids = [];
        }
        const modal = new bootstrap.Modal(document.getElementById('modalCustomer'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Customer "${item.nama}" yang dihapus tidak dapat dikembalikan!`,
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
                await customerService.deleteCustomer(payload);

                toastfy.success('Customer berhasil dihapus.');

                // Memanggil fetchCustomer agar tabel terupdate otomatis tanpa reload
                await fetchCustomer();
            } catch (error) {
                console.error('Gagal menghapus data Customer:', error);
                toastfy.error('Gagal menghapus data Customer.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchCustomer();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = customers.value.filter(item =>
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
        customers, masterplants, isLoading, searchQuery, currentPage, isEdit, formCustomer, errors, totalPages, displayedPages,
        filteredCustomer: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return customers.value.filter(item => (item.nama || '').toLowerCase().includes(query));
        }),
        paginatedCustomer: computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            return (customers.value.filter(item => (item.nama || '').toLowerCase().includes(searchQuery.value.toLowerCase())))
                .slice(start, start + itemsPerPage);
        }),
        fetchCustomer, fetchMasterPlant, handleCreate, handleEdit, handleDelete, handleRefresh, submitCustomer
    };
}
