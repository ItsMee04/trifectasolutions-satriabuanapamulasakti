import { ref, computed, reactive, watch } from 'vue';
import { timbanganampService } from '../services/timbanganampService';
import { materialService } from '../../material/services/materialService';
import { kendaraanService } from '../../kendaraan/services/kendaraanService'
import { driverService } from '../../driver/services/driverService'
import { customerService } from '../../customer/services/customerService'
import { beratjenisService } from '../../beratjenis/services/beratjenisService'
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const AsphaltMixingPlants = ref([]);
const materialList = ref([]);
const kendaraanList = ref([]);
const driverList = ref([]);
const customerList = ref([]);
const beratjenisList = ref([]);
const currentTab = ref('IN');
const startDate = ref(''); // State Baru
const endDate = ref('');   // State Baru
const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isEdit = ref(false);
const errors = ref({});
const materialDataRaw = ref([]);
const columnFilters = reactive({
    material: '',
    tanggal: '',
    kode: '',
    kendaraan: '',
    driver: '',
    customer: '',
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: ''
});

const formAsphaltMixingPlant = reactive({
    id: null,
    kode: '',
    tanggal: '',
    material_id: null,
    kendaraan_id: null,
    driver_id: null,
    customer_id: null,
    beratjenis_id: null,
    jenis: '',
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: '',
    jarakawal: '',
    jarakakhir: '',
    jarak: '',
});

const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

export function useTimbanganAMP() {

    const switchTab = async (tab) => {
        currentTab.value = tab;
        currentPage.value = 1;
        await fetchAsphaltMixingPlant(tab);
    };

    const fetchAsphaltMixingPlant = async (jenisValue = null) => {
        isLoading.value = true;
        const targetJenis = jenisValue || currentTab.value;

        try {
            const payload = { jenis: targetJenis };
            const response = await timbanganampService.getTimbanganAMP(payload);
            AsphaltMixingPlants.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Asphalt Mixing Plant:", error);
            AsphaltMixingPlants.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const fetchMaterial = async () => {
        try {
            const response = await materialService.getMaterial();
            materialDataRaw.value = response.data; // Simpan data asli untuk cek satuan nanti
            materialList.value = response.data.map(item => ({
                value: item.id,
                label: item.material
            }));
        } catch (error) {
            console.log("Gagal memuat material:", error);
        }
    };

    // Helper untuk mendapatkan satuan material yang sedang dipilih
    const selectedMaterialSatuan = computed(() => {
        const material = materialDataRaw.value.find(m => m.id === formAsphaltMixingPlant.material_id);
        return material ? material.satuan.toLowerCase() : '';
    });

    // --- TAMBAHKAN INI ---
    const isKategoriAspal = computed(() => {
        const material = materialDataRaw.value.find(m => m.id === formAsphaltMixingPlant.material_id);
        if (!material || !material.kategori) return false;
        return material.kategori.kategori.toUpperCase() === 'ASPAL';
    });

    // Logika Perhitungan Volume Otomatis
    watch(
        // TAMBAHKAN selectedMaterialSatuan ke dalam dependency
        () => [
            formAsphaltMixingPlant.beratmuatan,
            formAsphaltMixingPlant.beratjenis_id,
            formAsphaltMixingPlant.material_id,
            selectedMaterialSatuan.value, // <--- Tambahkan ini
            isKategoriAspal.value // <--- Tambahkan dependency ini
        ],
        () => {
            // --- TAMBAHKAN LOGIKA RESET INI ---
            if (isKategoriAspal.value) {
                formAsphaltMixingPlant.beratjenis_id = null;
            }
            // ----------------------------------

            const beratMuatan = parseFloat(formAsphaltMixingPlant.beratmuatan) || 0;
            const satuan = selectedMaterialSatuan.value;

            // Cari nilai nominal berat jenis
            const bjTerpilih = beratjenisList.value.find(b => b.value === formAsphaltMixingPlant.beratjenis_id);
            const nilaiBJ = bjTerpilih ? parseFloat(bjTerpilih.label) : 0;

            // Gunakan .toUpperCase() agar pengecekan tidak sensitif huruf besar/kecil
            const currentSatuan = satuan.toUpperCase();

            if (currentSatuan === 'M3') {
                formAsphaltMixingPlant.volume = nilaiBJ > 0 ? (beratMuatan / nilaiBJ).toFixed(2) : 0;
            } else if (currentSatuan === 'KG') {
                // Sekarang ini akan langsung berjalan saat satuan berubah menjadi KG
                formAsphaltMixingPlant.volume = beratMuatan / 1000;
            } else if (currentSatuan === 'LITER' || currentSatuan === 'PCS') {
                // Biarkan user input manual
            } else {
                formAsphaltMixingPlant.volume = 0;
            }
        }
    );

    const fetchKendaraan = async () => {
        try {
            const response = await kendaraanService.getKendaraan();
            kendaraanList.value = response.data.map(item => ({
                value: item.id,
                label: item.kode
            }))
        } catch (error) {
            console.log("Gagal memuat kendaraan:", error)
        }
    }

    const fetchDriver = async () => {
        try {
            const response = await driverService.getDriver();
            driverList.value = response.data.map(item => ({
                value: item.id,
                label: item.nama
            }))
        } catch (error) {
            console.log("Gagal memuat driver:", error)
        }
    }

    const fetchCustomer = async () => {
        try {
            const response = await customerService.getCustomer();
            customerList.value = response.data.map(item => ({
                value: item.id,
                label: item.nama
            }));
        } catch (error) {
            console.error("Gagal memuat customer:", error);
        }
    };

    const fetchBeratJenis = async () => {
        try {
            const response = await beratjenisService.getBeratJenis();
            beratjenisList.value = response.data.map(item => ({
                value: item.id,
                label: item.beratjenis
            }));
        } catch (error) {
            console.error("Gagal memuat berat jenis:", error);
        }
    };

    const validateForm = () => {
        errors.value = {};

        if (!formAsphaltMixingPlant.tanggal) errors.value.tanggal = 'Tanggal tidak boleh kosong.';
        if (!formAsphaltMixingPlant.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

        if (formAsphaltMixingPlant.volume === null || formAsphaltMixingPlant.volume === '') {
            errors.value.volume = 'Volume tidak boleh kosong.';
        }

        if (formAsphaltMixingPlant.berattotal === null || formAsphaltMixingPlant.berattotal === '') {
            errors.value.berattotal = 'Berat Total tidak boleh kosong.';
        }

        if (formAsphaltMixingPlant.beratkendaraan === null || formAsphaltMixingPlant.beratkendaraan === '') {
            errors.value.beratkendaraan = 'Berat Kendaraan tidak boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitAsphaltMixingPlant = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formAsphaltMixingPlant.id,
                tanggal: formAsphaltMixingPlant.tanggal,
                material: formAsphaltMixingPlant.material_id,
                kendaraan: formAsphaltMixingPlant.kendaraan_id,
                driver: formAsphaltMixingPlant.driver_id,
                customer: formAsphaltMixingPlant.customer_id,
                beratjenis: formAsphaltMixingPlant.beratjenis_id,
                jenis: formAsphaltMixingPlant.jenis,
                volume: formAsphaltMixingPlant.volume,
                berattotal: formAsphaltMixingPlant.berattotal,
                beratkendaraan: formAsphaltMixingPlant.beratkendaraan,
                beratmuatan: formAsphaltMixingPlant.beratmuatan,
                jarakawal: formAsphaltMixingPlant.jarakawal,
                jarakakhir: formAsphaltMixingPlant.jarakakhir,
                jarak: formAsphaltMixingPlant.jarak,
            };

            let response;
            if (isEdit.value) {
                response = await timbanganampService.updateTimbanganAMP(payload);
            } else {
                response = await timbanganampService.storeTimbanganAMP(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalAsphaltMixingPlant');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchAsphaltMixingPlant();
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
                toastfy.error(error.response.data.message || 'Terjadi kesalahan validasi.');
            } else {
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
        formAsphaltMixingPlant.id = null;
        formAsphaltMixingPlant.tanggal = getTodayDate();
        formAsphaltMixingPlant.material_id = null;
        formAsphaltMixingPlant.kendaraan_id = null;
        formAsphaltMixingPlant.driver_id = null;
        formAsphaltMixingPlant.customer_id = null;
        formAsphaltMixingPlant.beratjenis_id = null;
        formAsphaltMixingPlant.jenis = currentTab.value;
        formAsphaltMixingPlant.volume = '';
        formAsphaltMixingPlant.berattotal = '';
        formAsphaltMixingPlant.beratkendaraan = '';
        formAsphaltMixingPlant.beratmuatan = '';
        formAsphaltMixingPlant.jarakawal = '';
        formAsphaltMixingPlant.jarakakhir = '';
        formAsphaltMixingPlant.jarak = '';

        const modal = new bootstrap.Modal(document.getElementById('modalAsphaltMixingPlant'));
        modal.show();
    };

    watch(
        () => [formAsphaltMixingPlant.berattotal, formAsphaltMixingPlant.beratkendaraan],
        ([total, kendaraan]) => {
            const t = parseFloat(total) || 0;
            const k = parseFloat(kendaraan) || 0;
            const hasil = t - k;

            // Set hasil ke beratmuatan (jika hasil negatif set ke 0 atau biarkan saja)
            formAsphaltMixingPlant.beratmuatan = hasil > 0 ? hasil : 0;
        }
    );

    // Tambahkan WATCH baru untuk perhitungan jarak otomatis
    watch(
        () => [formAsphaltMixingPlant.jarakawal, formAsphaltMixingPlant.jarakakhir],
        ([awal, akhir]) => {
            const valAwal = parseFloat(awal) || 0;
            const valAkhir = parseFloat(akhir) || 0;
            const hasil = valAkhir - valAwal;

            if (hasil > 0) {
                // Gunakan .toFixed(2) untuk mendapatkan 2 angka di belakang koma
                // Kemudian bungkus dengan Number() agar tipenya kembali menjadi angka, bukan string
                formAsphaltMixingPlant.jarak = Number(hasil.toFixed(2));
            } else {
                formAsphaltMixingPlant.jarak = 0;
            }
        }
    );

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formAsphaltMixingPlant.id = item.id;
        formAsphaltMixingPlant.tanggal = item.tanggal;
        formAsphaltMixingPlant.material_id = item.material_id;
        formAsphaltMixingPlant.kendaraan_id = item.kendaraan_id;
        formAsphaltMixingPlant.driver_id = item.driver_id;
        formAsphaltMixingPlant.customer_id = item.customer_id;
        formAsphaltMixingPlant.beratjenis_id = item.beratjenis_id;
        formAsphaltMixingPlant.jenis = item.jenis;
        formAsphaltMixingPlant.volume = item.volume;
        formAsphaltMixingPlant.berattotal = item.berattotal;
        formAsphaltMixingPlant.beratkendaraan = item.beratkendaraan;
        formAsphaltMixingPlant.beratmuatan = item.beratmuatan;
        formAsphaltMixingPlant.jarakawal = item.jarakawal;
        formAsphaltMixingPlant.jarakakhir = item.jarakakhir;
        formAsphaltMixingPlant.jarak = item.jarak;

        const modal = new bootstrap.Modal(document.getElementById('modalAsphaltMixingPlant'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Asphalt Mixing Plant "${item.material.material}" yang dihapus tidak dapat dikembalikan!`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            isLoading.value = true;
            try {
                const payload = { id: item.id };
                await timbanganampService.deleteTimbanganAMP(payload);
                toastfy.success('Asphalt Mixing Plant berhasil dihapus.');
                await fetchAsphaltMixingPlant();
            } catch (error) {
                toastfy.error('Gagal menghapus data Asphalt Mixing Plant.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchAsphaltMixingPlant();
    }

    const formatNumber = (value, decimals = 0) => {
        if (value === null || value === undefined || value === '') return "0";
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    };

    // --- HELPER UNTUK SEARCH MATCH ---
    const searchMatch = (item, query) => {
        return (
            String(item.nomor || '').toLowerCase().includes(query) ||
            String(item.material?.material || '').toLowerCase().includes(query) ||
            String(item.kendaraan?.nomor || '').toLowerCase().includes(query) ||
            String(item.driver?.nama || '').toLowerCase().includes(query) ||
            String(item.suplier?.nama || '').toLowerCase().includes(query) ||
            String(item.volume || '').toLowerCase().includes(query) ||
            String(item.berattotal || '').toLowerCase().includes(query) ||
            String(item.beratkendaraan || '').toLowerCase().includes(query) ||
            String(item.beratmuatan || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredAsphaltMixingPlant = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return AsphaltMixingPlants.value.filter(item => {
            // 1. FILTER SEARCH GLOBAL (Cari di semua field)
            const matchesSearch = searchMatch(item, query);

            // 2. FILTER TANGGAL (Range)
            let matchesDate = true;
            if (startDate.value && endDate.value) {
                matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
            } else if (startDate.value) {
                matchesDate = item.tanggal >= startDate.value;
            } else if (endDate.value) {
                matchesDate = item.tanggal <= endDate.value;
            }

            // 3. FILTER PER KOLOM (Spesifik)
            // .every() memastikan SEMUA inputan kolom yang diisi harus terpenuhi
            const matchesColumns = Object.keys(columnFilters).every(key => {
                const filterVal = columnFilters[key].toLowerCase();
                if (!filterVal) return true; // Jika filter kosong, loloskan data

                switch (key) {
                    case 'material':
                        return String(item.material?.material || '').toLowerCase().includes(filterVal);
                    case 'tanggal':
                        return String(item.tanggal || '').toLowerCase().includes(filterVal);
                    case 'nomor':
                        return String(item.kode || '').toLowerCase().includes(filterVal);
                    case 'kendaraan':
                        return String(item.kendaraan?.nomor || '').toLowerCase().includes(filterVal);
                    case 'driver':
                        return String(item.driver?.nama || '').toLowerCase().includes(filterVal);
                    case 'customer':
                        return String(item.customer?.nama || '').toLowerCase().includes(filterVal);
                    case 'volume':
                        return String(item.volume || '').toLowerCase().includes(filterVal);
                    case 'berattotal':
                        return String(item.berattotal || '').toLowerCase().includes(filterVal);
                    case 'beratkendaraan':
                        return String(item.beratkendaraan || '').toLowerCase().includes(filterVal);
                    case 'beratmuatan':
                        return String(item.beratmuatan || '').toLowerCase().includes(filterVal);
                    // ... case kolom lainnya
                    default: return true;
                }
            });

            // KEMBALIKAN DATA HANYA JIKA SEMUA KONDISI TRUE
            return matchesSearch && matchesDate && matchesColumns;
        });
    });

    const totalFooter = computed(() => {
        return filteredAsphaltMixingPlant.value.reduce((acc, item) => {
            acc.volumeTotal += parseFloat(item.volume || 0);
            acc.beratTotal += Number(item.berattotal || 0);
            acc.beratKendaraan += Number(item.beratkendaraan || 0);
            acc.beratMuatan += Number(item.beratmuatan || 0);
            return acc;
        }, { volumeTotal: 0, beratTotal: 0, beratKendaraan: 0, beratMuatan: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredAsphaltMixingPlant.value.length / itemsPerPage) || 1;
    });

    const paginatedAsphaltMixingPlant = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredAsphaltMixingPlant.value.slice(start, start + itemsPerPage);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    // Tambahkan reset filter kolom
    const resetColumnFilters = () => {
        Object.keys(columnFilters).forEach(key => columnFilters[key] = '');
    };

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
        AsphaltMixingPlants,
        materialList,
        kendaraanList,
        driverList,
        customerList,
        beratjenisList,
        selectedMaterialSatuan,
        isLoading,
        searchQuery,
        currentPage,
        currentTab,
        startDate,
        endDate,
        displayedPages,
        switchTab,
        isEdit,
        formAsphaltMixingPlant,
        errors,
        totalPages,
        totalFooter,
        columnFilters,
        resetColumnFilters,
        formatNumber,
        filteredAsphaltMixingPlant,
        paginatedAsphaltMixingPlant,
        fetchAsphaltMixingPlant,
        fetchMaterial,
        fetchKendaraan,
        fetchDriver,
        fetchCustomer,
        fetchBeratJenis,
        handleCreate,
        handleEdit,
        handleDelete,
        handleRefresh,
        submitAsphaltMixingPlant,
        resetDateFilter,
        isKategoriAspal,
    };
}
