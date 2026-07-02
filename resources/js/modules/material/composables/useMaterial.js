import { ref, computed, reactive } from 'vue';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

import { materialService } from '../services/materialService';
import { masterplantService } from '../../masterplant/services/masterplantService';

// Shared State
const materials = ref([]);
const masterplants = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});

const satuanList = [
    { value: 'M3', label: 'M3' },
    { value: 'KG', label: 'KG' },
    { value: 'LITER', label: 'LITER' },
    { value: 'PCS', label: 'PCS' },
];

const formMaterial = reactive({
    id: null,
    kode: '',
    material: '', // 2. UBAH 'role' menjadi 'role_id' agar cocok dengan value Multiselect (ID)
    masterplant_ids: [], // 6. UBAH 'role' menjadi 'role_id' agar cocok dengan value Multiselect (ID)
    satuan: ''
});

export function useMaterial() {

    const fetchMaterial = async () => {
        isLoading.value = true;
        try {
            const response = await materialService.getMaterial();
            materials.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            materials.value = [];
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

    const validateForm = () => {
        errors.value = {};
        if (!formMaterial.kode || formMaterial.kode.trim() === '') {
            errors.value.kode = 'Kode tidak boleh kosong.';
        }
        if (!formMaterial.material || formMaterial.material.trim() === '') {
            errors.value.material = 'Material tidak boleh kosong.';
        }
        if (formMaterial.masterplant_ids.length === 0) {
            errors.value.masterplant_ids = 'Pilih minimal satu Master Plant.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const submitMaterial = async () => {
        if (!validateForm()) return false;

        isLoading.value = true;
        try {
            const payload = {
                id: formMaterial.id,
                kode: formMaterial.kode,
                material: formMaterial.material,
                masterplant_ids: formMaterial.masterplant_ids, // 5. Kirim masterplant_ids (array) ke backend
                satuan: formMaterial.satuan,
            };

            let response;
            if (isEdit.value) {
                payload.id = formMaterial.id;
                response = await materialService.updateMaterial(payload);
            } else {
                // Mode Tambah: Kirim Payload saja
                response = await materialService.storeMaterial(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');

            const modalElement = document.getElementById('modalMaterial');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchMaterial();
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
                toastfy.error(error.response?.data?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const handleCreate = () => {
        isEdit.value = false;
        errors.value = {};
        formMaterial.id = null;
        formMaterial.kode = '';
        formMaterial.material = '';
        formMaterial.masterplant_ids = []; // 7. Pastikan mengambil masterplant_ids, bukan objek masterplant
        formMaterial.satuan = ''

        const modal = new bootstrap.Modal(document.getElementById('modalMaterial'));
        modal.show();
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formMaterial.id = item.id;
        formMaterial.kode = item.kode || '';
        formMaterial.material = item.material;
        if (item.masterplants && Array.isArray(item.masterplants)) {
            // Mengambil id dari setiap object di dalam array masterplants
            formMaterial.masterplant_ids = item.masterplants.map(plant => plant.id);
        } else {
            formMaterial.masterplant_ids = [];
        } // 7. Pastikan mengambil masterplant_ids, bukan objek masterplant
        formMaterial.satuan = item.satuan;

        const modal = new bootstrap.Modal(document.getElementById('modalMaterial'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data material "${item.material}" yang dihapus tidak dapat dikembalikan!`,
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
                await materialService.deleteMaterial(payload);

                toastfy.success('Material berhasil dihapus.');

                // Memanggil fetchKendaraan agar tabel terupdate otomatis tanpa reload
                await fetchMaterial();
            } catch (error) {
                console.error('Gagal menghapus data Material:', error);
                toastfy.error('Gagal menghapus data Material.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchMaterial();
    }

    const totalPages = computed(() => {
        const query = searchQuery.value.toLowerCase(); // Ambil string pencarian
        const filteredCount = materials.value.filter(item =>
            (item.kategori?.kategori || '').toLowerCase().includes(query) ||
            (item.material || '').toLowerCase().includes(query)
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
        materials, masterplants, satuanList, isLoading, searchQuery, currentPage, isEdit, formMaterial, errors, totalPages, displayedPages,
        filteredMaterial: computed(() => {
            const query = searchQuery.value.toLowerCase();
            return materials.value.filter(item => {
                return (
                    (item.kategori?.kategori || '').toLowerCase().includes(query) ||
                    (item.material || '').toLowerCase().includes(query) || // Pastikan path relasi role benar
                    (item.satuan || '').toLowerCase().includes(query)
                );
            }
            );
        }),
        paginatedMaterial: computed(() => {
            const query = searchQuery.value.toLowerCase();
            const filtered = materials.value.filter(item => {
                return (
                    (item.kategori?.kategori || '').toLowerCase().includes(query) ||
                    (item.material || '').toLowerCase().includes(query) ||
                    (item.satuan || '').toLowerCase().includes(query)
                );
            });
            const start = (currentPage.value - 1) * itemsPerPage;
            return filtered.slice(start, start + itemsPerPage);
        }),
        fetchMaterial, fetchMasterPlant, handleCreate, handleEdit, handleDelete, handleRefresh, submitMaterial
    };
}
