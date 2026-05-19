import { ref, computed, reactive, watch } from 'vue';
import { timbangancbpService } from '../services/timbangancbpService';
import { materialService } from '../../material/services/materialService';
import { kendaraanService } from '../../kendaraan/services/kendaraanService'
import { driverService } from '../../driver/services/driverService'
import { customerService } from '../../customer/services/customerService'
import { beratjenisService } from '../../beratjenis/services/beratjenisService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const ConcreteBatchingPlants = ref([]);
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
    nomor: '',
    kendaraan: '',
    driver: '',
    customer: '',
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: ''
});

const formConcreteBatchingPlant = reactive({
    id: null,
    nomor: '',
    tanggal: '',
    material_id: null,
    kendaraan_id: null,
    driver_id: null,
    customer_id: null,
    beratjenis_id: null,
    awal: null,
    tujuan: null,
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

export function useTimbanganCBP() {

    const switchTab = async (tab) => {
        currentTab.value = tab;
        currentPage.value = 1;
        await fetchCBP(tab);
    };

    // Logika deteksi Tab
    const isTabIn = computed(() => currentTab.value === 'IN');
    const isTabOut = computed(() => currentTab.value === 'OUT');

    // Logika deteksi Kendaraan TM
    const isTruckMixer = computed(() => {
        const kendaraan = kendaraanList.value.find(k => k.value === formConcreteBatchingPlant.kendaraan_id);
        return kendaraan ? kendaraan.label.toUpperCase().includes('TM') : false;
    });

    // Gabungan Kondisi untuk Template
    const showSupplierFields = computed(() => isTabIn.value && !isTruckMixer.value || isTabOut.value && !isTruckMixer.value);
    const showTMOutFields = computed(() => isTabOut.value && isTruckMixer.value);

    const fetchCBP = async (jenisValue = null) => {
        isLoading.value = true;
        const targetJenis = jenisValue || currentTab.value;

        try {
            const payload = { jenis: targetJenis };
            const response = await timbangancbpService.getTimbanganCBP(payload);
            ConcreteBatchingPlants.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Concrete Batch Plant:", error);
            ConcreteBatchingPlants.value = [];
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
        const material = materialDataRaw.value.find(m => m.id === formConcreteBatchingPlant.material_id);
        return material ? material.satuan.toLowerCase() : '';
    });

    // Logika Perhitungan Volume Otomatis
    watch(
        () => [formConcreteBatchingPlant.beratmuatan, formConcreteBatchingPlant.beratjenis_id, formConcreteBatchingPlant.material_id, formConcreteBatchingPlant.kendaraan_id],
        () => {
            const beratMuatan = parseFloat(formConcreteBatchingPlant.beratmuatan) || 0;
            const satuan = selectedMaterialSatuan.value;

            // Cari nilai nominal berat jenis dari list berdasarkan ID yang dipilih
            const bjTerpilih = beratjenisList.value.find(b => b.value === formConcreteBatchingPlant.beratjenis_id);
            const nilaiBJ = bjTerpilih ? parseFloat(bjTerpilih.label) : 0;

            if (satuan === 'm3') {
                // JIKA KENDARAAN ADALAH TM, VOLUME SET KE 1 (PER RIT)
                if (isTruckMixer.value) {
                    formConcreteBatchingPlant.volume = 1;
                } else {
                    // JIKA BUKAN TM, HITUNG BERDASARKAN BERAT JENIS
                    formConcreteBatchingPlant.volume = nilaiBJ > 0 ? (beratMuatan / nilaiBJ).toFixed(2) : 0;
                }
            } else if (satuan === 'kg') {
                formConcreteBatchingPlant.volume = beratMuatan;
            } else if (satuan === 'liter' || satuan === 'pcs') {
                // Biarkan user input manual
            } else {
                formConcreteBatchingPlant.volume = 0;
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

        if (!formConcreteBatchingPlant.tanggal) errors.value.tanggal = 'Tanggal tidak boleh kosong.';
        if (!formConcreteBatchingPlant.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

        if (formConcreteBatchingPlant.volume === null || formConcreteBatchingPlant.volume === '') {
            errors.value.volume = 'Volume tidak boleh kosong.';
        }

        if (formConcreteBatchingPlant.berattotal === null || formConcreteBatchingPlant.berattotal === '') {
            errors.value.berattotal = 'Berat Total tidak boleh kosong.';
        }

        if (formConcreteBatchingPlant.beratkendaraan === null || formConcreteBatchingPlant.beratkendaraan === '') {
            errors.value.beratkendaraan = 'Berat Kendaraan tidak boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitConcreteBatchingPlant = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formConcreteBatchingPlant.id,
                tanggal: formConcreteBatchingPlant.tanggal,
                material: formConcreteBatchingPlant.material_id,
                kendaraan: formConcreteBatchingPlant.kendaraan_id,
                driver: formConcreteBatchingPlant.driver_id,
                customer: formConcreteBatchingPlant.customer_id,
                beratjenis: formConcreteBatchingPlant.beratjenis_id,
                jenis: formConcreteBatchingPlant.jenis,
                volume: formConcreteBatchingPlant.volume,
                berattotal: formConcreteBatchingPlant.berattotal,
                beratkendaraan: formConcreteBatchingPlant.beratkendaraan,
                beratmuatan: formConcreteBatchingPlant.beratmuatan,
                awal: formConcreteBatchingPlant.awal,
                tujuan: formConcreteBatchingPlant.tujuan,
                jarakawal: formConcreteBatchingPlant.jarakawal,
                jarakakhir: formConcreteBatchingPlant.jarakakhir,
                jarak: formConcreteBatchingPlant.jarak,
            };

            let response;
            if (isEdit.value) {
                response = await timbangancbpService.updateTimbanganCBP(payload);
            } else {
                response = await timbangancbpService.storeTimbanganCBP(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalConcreteBatchingPlant');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchCBP();
            return true;

            console.log(payload)
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
        formConcreteBatchingPlant.id = null;
        formConcreteBatchingPlant.tanggal = getTodayDate();
        formConcreteBatchingPlant.material_id = null;
        formConcreteBatchingPlant.kendaraan_id = null;
        formConcreteBatchingPlant.driver_id = null;
        formConcreteBatchingPlant.customer_id = null;
        formConcreteBatchingPlant.beratjenis_id = null,
            formConcreteBatchingPlant.jenis = currentTab.value;
        formConcreteBatchingPlant.volume = '';
        formConcreteBatchingPlant.berattotal = '';
        formConcreteBatchingPlant.beratkendaraan = '';
        formConcreteBatchingPlant.beratmuatan = '';
        formConcreteBatchingPlant.jarakawal = '';
        formConcreteBatchingPlant.jarakakhir = '';
        formConcreteBatchingPlant.jarak = '';

        const modal = new bootstrap.Modal(document.getElementById('modalConcreteBatchingPlant'));
        modal.show();
    };

    watch(
        () => [formConcreteBatchingPlant.berattotal, formConcreteBatchingPlant.beratkendaraan],
        ([total, kendaraan]) => {
            const t = parseFloat(total) || 0;
            const k = parseFloat(kendaraan) || 0;
            const hasil = t - k;

            // Set hasil ke beratmuatan (jika hasil negatif set ke 0 atau biarkan saja)
            formConcreteBatchingPlant.beratmuatan = hasil > 0 ? hasil : 0;
        }
    );

    // Tambahkan WATCH baru untuk perhitungan jarak otomatis
    watch(
        () => [formConcreteBatchingPlant.jarakawal, formConcreteBatchingPlant.jarakakhir],
        ([awal, akhir]) => {
            const valAwal = parseFloat(awal) || 0;
            const valAkhir = parseFloat(akhir) || 0;
            const hasil = valAkhir - valAwal;

            if (hasil > 0) {
                // Gunakan .toFixed(2) untuk mendapatkan 2 angka di belakang koma
                // Kemudian bungkus dengan Number() agar tipenya kembali menjadi angka, bukan string
                formConcreteBatchingPlant.jarak = Number(hasil.toFixed(2));
            } else {
                formConcreteBatchingPlant.jarak = 0;
            }
        }
    );

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formConcreteBatchingPlant.id = item.id;
        formConcreteBatchingPlant.tanggal = item.tanggal;
        formConcreteBatchingPlant.material_id = item.material_id;
        formConcreteBatchingPlant.kendaraan_id = item.kendaraan_id;
        formConcreteBatchingPlant.driver_id = item.driver_id;
        formConcreteBatchingPlant.customer_id = item.customer_id;
        formConcreteBatchingPlant.beratjenis_id = item.beratjenis_id;
        formConcreteBatchingPlant.jenis = item.jenis;
        formConcreteBatchingPlant.volume = item.volume;
        formConcreteBatchingPlant.berattotal = item.berattotal;
        formConcreteBatchingPlant.beratkendaraan = item.beratkendaraan;
        formConcreteBatchingPlant.beratmuatan = item.beratmuatan;
        formConcreteBatchingPlant.jarakawal = item.jarakawal;
        formConcreteBatchingPlant.jarakakhir = item.jarakakhir;
        formConcreteBatchingPlant.jarak = item.jarak;

        const modal = new bootstrap.Modal(document.getElementById('modalConcreteBatchingPlant'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Concrete Batching Plant "${item.material.material}" yang dihapus tidak dapat dikembalikan!`,
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
                await timbangancbpService.deleteTimbanganCBP(payload);
                toastfy.success('Concrete Batching Plant berhasil dihapus.');
                await fetchCBP();
            } catch (error) {
                toastfy.error('Gagal menghapus data Concrete Batching Plant.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchCBP();
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
            String(item.customer?.nama || '').toLowerCase().includes(query) ||
            String(item.volume || '').toLowerCase().includes(query) ||
            String(item.berattotal || '').toLowerCase().includes(query) ||
            String(item.beratkendaraan || '').toLowerCase().includes(query) ||
            String(item.beratmuatan || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredConcreteBatchingPlant = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return ConcreteBatchingPlants.value.filter(item => {
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
                        return String(item.nomor || '').toLowerCase().includes(filterVal);
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
        return filteredConcreteBatchingPlant.value.reduce((acc, item) => {
            acc.volumeTotal += parseFloat(item.volume || 0);
            acc.beratTotal += Number(item.berattotal || 0);
            acc.beratKendaraan += Number(item.beratkendaraan || 0);
            acc.beratMuatan += Number(item.beratmuatan || 0);
            return acc;
        }, { volumeTotal: 0, beratTotal: 0, beratKendaraan: 0, beratMuatan: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredConcreteBatchingPlant.value.length / itemsPerPage) || 1;
    });

    const paginatedConcreteBatchingPlant = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredConcreteBatchingPlant.value.slice(start, start + itemsPerPage);
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
        ConcreteBatchingPlants,
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
        isTabIn,
        isTabOut,
        isTruckMixer,
        showSupplierFields,
        showTMOutFields,
        startDate,
        endDate,
        switchTab,
        isEdit,
        formConcreteBatchingPlant,
        errors,
        displayedPages,
        totalPages,
        totalFooter,
        columnFilters,
        resetColumnFilters,
        formatNumber,
        filteredConcreteBatchingPlant,
        paginatedConcreteBatchingPlant,
        fetchCBP,
        fetchMaterial,
        fetchKendaraan,
        fetchDriver,
        fetchCustomer,
        fetchBeratJenis,
        handleCreate,
        handleEdit,
        handleDelete,
        handleRefresh,
        submitConcreteBatchingPlant,
        resetDateFilter
    };
}

// // Shared State
// const ConcreteBatchingPlant = ref([]);
// const materialList = ref([]);
// const kendaraanList = ref([]);
// const driverList = ref([]);
// const customerList = ref([]);
// const beratjenisList = ref([]);
// const currentTab = ref('IN');
// const startDate = ref(''); // State Baru
// const endDate = ref('');   // State Baru
// const isLoading = ref(false);
// const searchQuery = ref('');
// const currentPage = ref(1);
// const itemsPerPage = 10;
// const isEdit = ref(false);
// const errors = ref({});
// const materialDataRaw = ref([]);
// const columnFilters = reactive({
//     material: '',
//     tanggal: '',
//     nomor: '',
//     kendaraan: '',
//     driver: '',
//     customer: '',
//     volume: '',
//     berattotal: '',
//     beratkendaraan: '',
//     beratmuatan: ''
// })

// const formConcreteBatchingPlant = reactive({
//     id: null,
//     nomor: '',
//     tanggal: '',
//     material_id: null,
//     kendaraan_id: null,
//     driver_id: null,
//     customer_id: null,
//     beratjenis_id: null,
//     jenis: '',
//     volume: '',
//     berattotal: '',
//     beratkendaraan: '',
//     beratmuatan: '',
//     jarakawal: '',
//     jarakakhir: '',
//     jarak: '',
// });

// const getTodayDate = () => {
//     return new Date().toISOString().split('T')[0];
// };

// export function useTimbanganCBP() {

//     const switchTab = async (tab) => {
//         currentTab.value = tab;
//         currentPage.value = 1;
//         await fetchConcreteBatchingPlant(tab);
//     };

//     const fetchConcreteBatchingPlant = async (jenisValue = null) => {
//         isLoading.value = true;
//         const targetJenis = jenisValue || currentTab.value;

//         try {
//             const payload = { jenis: targetJenis };
//             const response = await timbangancbpService.getTimbanganCBP(payload);
//             ConcreteBatchingPlant.value = Array.isArray(response) ? response : (response.data || []);
//         } catch (error) {
//             console.error("Gagal mengambil data Stone Crusher:", error);
//             ConcreteBatchingPlant.value = [];
//         } finally {
//             isLoading.value = false;
//         }
//     };

//     const fetchMaterial = async () => {
//         try {
//             const response = await materialService.getMaterial();
//             materialDataRaw.value = response.data; // Simpan data asli untuk cek satuan nanti
//             materialList.value = response.data.map(item => ({
//                 value: item.id,
//                 label: item.material
//             }));
//         } catch (error) {
//             console.log("Gagal memuat material:", error);
//         }
//     };

//     // Helper untuk mendapatkan satuan material yang sedang dipilih
//     const selectedMaterialSatuan = computed(() => {
//         const material = materialDataRaw.value.find(m => m.id === formConcreteBatchingPlant.material_id);
//         return material ? material.satuan.toLowerCase() : '';
//     });

//     // Logika Perhitungan Volume Otomatis
//     watch(
//         () => [formConcreteBatchingPlant.beratmuatan, formConcreteBatchingPlant.beratjenis_id, formConcreteBatchingPlant.material_id],
//         () => {
//             const beratMuatan = parseFloat(formConcreteBatchingPlant.beratmuatan) || 0;
//             const satuan = selectedMaterialSatuan.value;

//             // Cari nilai nominal berat jenis dari list berdasarkan ID yang dipilih
//             const bjTerpilih = beratjenisList.value.find(b => b.value === formConcreteBatchingPlant.beratjenis_id);
//             const nilaiBJ = bjTerpilih ? parseFloat(bjTerpilih.label) : 0;

//             if (satuan === 'm3') {
//                 formConcreteBatchingPlant.volume = nilaiBJ > 0 ? (beratMuatan / nilaiBJ).toFixed(2) : 0;
//             } else if (satuan === 'kg') {
//                 formConcreteBatchingPlant.volume = beratMuatan;
//             } else if (satuan === 'liter' || satuan === 'pcs') {
//                 // Biarkan user input manual, jangan override jika sudah ada isinya
//                 // kecuali jika baru pindah ke satuan ini
//             } else {
//                 formConcreteBatchingPlant.volume = 0;
//             }
//         }
//     );

//     const fetchKendaraan = async () => {
//         try {
//             const response = await kendaraanService.getKendaraan();
//             kendaraanList.value = response.data.map(item => ({
//                 value: item.id,
//                 label: item.kode
//             }))
//         } catch (error) {
//             console.log("Gagal memuat kendaraan:", error)
//         }
//     }

//     const fetchDriver = async () => {
//         try {
//             const response = await driverService.getDriver();
//             driverList.value = response.data.map(item => ({
//                 value: item.id,
//                 label: item.nama
//             }))
//         } catch (error) {
//             console.log("Gagal memuat driver:", error)
//         }
//     }

//     const fetchCustomer = async () => {
//         try {
//             const response = await customerService.getCustomer();
//             customerList.value = response.data.map(item => ({
//                 value: item.id,
//                 label: item.nama
//             }));
//         } catch (error) {
//             console.error("Gagal memuat customer:", error);
//         }
//     };

//     const fetchBeratJenis = async () => {
//         try {
//             const response = await beratjenisService.getBeratJenis();
//             beratjenisList.value = response.data.map(item => ({
//                 value: item.id,
//                 label: item.beratjenis
//             }));
//         } catch (error) {
//             console.error("Gagal memuat berat jenis:", error);
//         }
//     };

//     const validateForm = () => {
//         errors.value = {};

//         if (!formConcreteBatchingPlant.tanggal) errors.value.tanggal = 'Tanggal tidak boleh kosong.';
//         if (!formConcreteBatchingPlant.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

//         if (formConcreteBatchingPlant.volume === null || formConcreteBatchingPlant.volume === '') {
//             errors.value.volume = 'Volume tidak boleh kosong.';
//         }

//         if (formConcreteBatchingPlant.berattotal === null || formConcreteBatchingPlant.berattotal === '') {
//             errors.value.berattotal = 'Berat Total tidak boleh kosong.';
//         }

//         if (formConcreteBatchingPlant.beratkendaraan === null || formConcreteBatchingPlant.beratkendaraan === '') {
//             errors.value.beratkendaraan = 'Berat Kendaraan tidak boleh kosong.';
//         }

//         return Object.keys(errors.value).length === 0;
//     };

//     const submitConcreteBatchingPlant = async () => {
//         if (!validateForm()) return false;
//         isLoading.value = true;
//         try {
//             const payload = {
//                 id: formConcreteBatchingPlant.id,
//                 tanggal: formConcreteBatchingPlant.tanggal,
//                 material: formConcreteBatchingPlant.material_id,
//                 kendaraan: formConcreteBatchingPlant.kendaraan_id,
//                 driver: formConcreteBatchingPlant.driver_id,
//                 suplier: formConcreteBatchingPlant.customer_id,
//                 beratjenis: formConcreteBatchingPlant.beratjenis_id,
//                 jenis: formConcreteBatchingPlant.jenis,
//                 volume: formConcreteBatchingPlant.volume,
//                 berattotal: formConcreteBatchingPlant.berattotal,
//                 beratkendaraan: formConcreteBatchingPlant.beratkendaraan,
//                 beratmuatan: formConcreteBatchingPlant.beratmuatan,
//                 jarakawal: formConcreteBatchingPlant.jarakawal,
//                 jarakakhir: formConcreteBatchingPlant.jarakakhir,
//                 jarak: formConcreteBatchingPlant.jarak,
//             };

//             let response;
//             if (isEdit.value) {
//                 response = await timbangancbpService.updateTimbanganCBP(payload);
//             } else {
//                 response = await timbangancbpService.storeTimbanganCBP(payload);
//             }

//             toastfy.success(response.message || 'Data berhasil disimpan');
//             const modalElement = document.getElementById('modalConcreteBatchingPlant');
//             const modalInstance = bootstrap.Modal.getInstance(modalElement);
//             if (modalInstance) modalInstance.hide();

//             await fetchConcreteBatchingPlant();
//             return true;
//         } catch (error) {
//             if (error.response?.status === 422) {
//                 errors.value = error.response.data.errors;
//                 toastfy.error(error.response.data.message || 'Terjadi kesalahan validasi.');
//             } else {
//                 console.log(error)
//                 toastfy.error(error.response?.data?.message || 'Gagal menyimpan data.');
//             }
//             return false;
//         } finally {
//             isLoading.value = false;
//         }
//     };

//     const handleCreate = () => {
//         isEdit.value = false;
//         errors.value = {};
//         formConcreteBatchingPlant.id = null;
//         formConcreteBatchingPlant.tanggal = getTodayDate();
//         formConcreteBatchingPlant.material_id = null;
//         formConcreteBatchingPlant.kendaraan_id = null;
//         formConcreteBatchingPlant.driver_id = null;
//         formConcreteBatchingPlant.customer_id = null;
//         formConcreteBatchingPlant.beratjenis_id = null,
//             formConcreteBatchingPlant.jenis = currentTab.value;
//         formConcreteBatchingPlant.volume = '';
//         formConcreteBatchingPlant.berattotal = '';
//         formConcreteBatchingPlant.beratkendaraan = '';
//         formConcreteBatchingPlant.beratmuatan = '';
//         formConcreteBatchingPlant.jarakawal = '';
//         formConcreteBatchingPlant.jarakakhir = '';
//         formConcreteBatchingPlant.jarak = '';

//         const modal = new bootstrap.Modal(document.getElementById('modalConcreteBatchingPlant'));
//         modal.show();
//     };

//     watch(
//         () => [formConcreteBatchingPlant.berattotal, formConcreteBatchingPlant.beratkendaraan],
//         ([total, kendaraan]) => {
//             const t = parseFloat(total) || 0;
//             const k = parseFloat(kendaraan) || 0;
//             const hasil = t - k;

//             // Set hasil ke beratmuatan (jika hasil negatif set ke 0 atau biarkan saja)
//             formConcreteBatchingPlant.beratmuatan = hasil > 0 ? hasil : 0;
//         }
//     );

//     // Tambahkan WATCH baru untuk perhitungan jarak otomatis
//     watch(
//         () => [formConcreteBatchingPlant.jarakawal, formConcreteBatchingPlant.jarakakhir],
//         ([awal, akhir]) => {
//             const valAwal = parseFloat(awal) || 0;
//             const valAkhir = parseFloat(akhir) || 0;
//             const hasil = valAkhir - valAwal;

//             if (hasil > 0) {
//                 // Gunakan .toFixed(2) untuk mendapatkan 2 angka di belakang koma
//                 // Kemudian bungkus dengan Number() agar tipenya kembali menjadi angka, bukan string
//                 formConcreteBatchingPlant.jarak = Number(hasil.toFixed(2));
//             } else {
//                 formConcreteBatchingPlant.jarak = 0;
//             }
//         }
//     );

//     const handleEdit = (item) => {
//         isEdit.value = true;
//         errors.value = {};
//         formConcreteBatchingPlant.id = item.id;
//         formConcreteBatchingPlant.tanggal = item.tanggal;
//         formConcreteBatchingPlant.material_id = item.material_id;
//         formConcreteBatchingPlant.kendaraan_id = item.kendaraan_id;
//         formConcreteBatchingPlant.driver_id = item.driver_id;
//         formConcreteBatchingPlant.customer_id = item.customer_id;
//         formConcreteBatchingPlant.beratjenis_id = item.beratjenis_id;
//         formConcreteBatchingPlant.jenis = item.jenis;
//         formConcreteBatchingPlant.volume = item.volume;
//         formConcreteBatchingPlant.berattotal = item.berattotal;
//         formConcreteBatchingPlant.beratkendaraan = item.beratkendaraan;
//         formConcreteBatchingPlant.beratmuatan = item.beratmuatan;
//         formConcreteBatchingPlant.jarakawal = item.jarakawal;
//         formConcreteBatchingPlant.jarakakhir = item.jarakakhir;

//         const modal = new bootstrap.Modal(document.getElementById('modalConcreteBatchingPlant'));
//         modal.show();
//     };

//     const handleDelete = async (item) => {
//         const result = await Swal.fire({
//             title: 'Apakah Anda yakin?',
//             text: `Data Concrete Batching Plant "${item.material.material}" yang dihapus tidak dapat dikembalikan!`,
//             showCancelButton: true,
//             confirmButtonColor: '#d33',
//             cancelButtonColor: '#3085d6',
//             confirmButtonText: 'Ya, hapus!',
//             cancelButtonText: 'Batal',
//             reverseButtons: true
//         });

//         if (result.isConfirmed) {
//             isLoading.value = true;
//             try {
//                 const payload = { id: item.id };
//                 await timbangancbpService.deleteTimbanganCBP(payload);
//                 toastfy.success('Concrete Batching Plant berhasil dihapus.');
//                 await fetchConcreteBatchingPlant();
//             } catch (error) {
//                 toastfy.error('Gagal menghapus data Concrete Batching Plant.');
//             } finally {
//                 isLoading.value = false;
//             }
//         }
//     };

//     const handleRefresh = async () => {
//         await fetchConcreteBatchingPlant();
//     }

//     const formatNumber = (value, decimals = 0) => {
//         if (value === null || value === undefined || value === '') return "0";
//         return new Intl.NumberFormat("id-ID", {
//             minimumFractionDigits: decimals,
//             maximumFractionDigits: decimals
//         }).format(value);
//     };

//     // --- HELPER UNTUK SEARCH MATCH ---
//     const searchMatch = (item, query) => {
//         return (
//             String(item.nomor || '').toLowerCase().includes(query) ||
//             String(item.material?.material || '').toLowerCase().includes(query) ||
//             String(item.kendaraan?.nomor || '').toLowerCase().includes(query) ||
//             String(item.driver?.nama || '').toLowerCase().includes(query) ||
//             String(item.customer?.nama || '').toLowerCase().includes(query) ||
//             String(item.volume || '').toLowerCase().includes(query) ||
//             String(item.berattotal || '').toLowerCase().includes(query) ||
//             String(item.beratkendaraan || '').toLowerCase().includes(query) ||
//             String(item.beratmuatan || '').toLowerCase().includes(query)
//         );
//     }

//     // --- FILTER UTAMA (Text + Date Range) ---
//     const filteredConcreteBatchingPlant = computed(() => {
//         const query = searchQuery.value.toLowerCase();
//         const activeTab = currentTab.value; // Ambil tab yang aktif saat ini

//         return ConcreteBatchingPlant.value.filter(item => {

//             const matchesTab = item.jenis === activeTab;
//             if (!matchesTab) return false;

//             // 1. FILTER SEARCH GLOBAL (Cari di semua field)
//             const matchesSearch = searchMatch(item, query);

//             // 2. FILTER TANGGAL (Range)
//             let matchesDate = true;
//             if (startDate.value && endDate.value) {
//                 matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
//             } else if (startDate.value) {
//                 matchesDate = item.tanggal >= startDate.value;
//             } else if (endDate.value) {
//                 matchesDate = item.tanggal <= endDate.value;
//             }

//             // 3. FILTER PER KOLOM (Spesifik)
//             // .every() memastikan SEMUA inputan kolom yang diisi harus terpenuhi
//             const matchesColumns = Object.keys(columnFilters).every(key => {
//                 const filterVal = columnFilters[key].toLowerCase();
//                 if (!filterVal) return true; // Jika filter kosong, loloskan data

//                 switch (key) {
//                     case 'material':
//                         return String(item.material?.material || '').toLowerCase().includes(filterVal);
//                     case 'tanggal':
//                         return String(item.tanggal || '').toLowerCase().includes(filterVal);
//                     case 'nomor':
//                         return String(item.nomor || '').toLowerCase().includes(filterVal);
//                     case 'kendaraan':
//                         return String(item.kendaraan?.nomor || '').toLowerCase().includes(filterVal);
//                     case 'driver':
//                         return String(item.driver?.nama || '').toLowerCase().includes(filterVal);
//                     case 'customer':
//                         return String(item.customer?.nama || '').toLowerCase().includes(filterVal);
//                     case 'volume':
//                         return String(item.volume || '').toLowerCase().includes(filterVal);
//                     case 'berattotal':
//                         return String(item.berattotal || '').toLowerCase().includes(filterVal);
//                     case 'beratkendaraan':
//                         return String(item.beratkendaraan || '').toLowerCase().includes(filterVal);
//                     case 'beratmuatan':
//                         return String(item.beratmuatan || '').toLowerCase().includes(filterVal);
//                     // ... case kolom lainnya
//                     default: return true;
//                 }
//             });

//             // KEMBALIKAN DATA HANYA JIKA SEMUA KONDISI TRUE
//             return matchesSearch && matchesDate && matchesColumns;
//         });
//     });

//     const totalFooter = computed(() => {
//         return filteredConcreteBatchingPlant.value.reduce((acc, item) => {
//             acc.volumeTotal += parseFloat(item.volume || 0);
//             acc.beratTotal += Number(item.berattotal || 0);
//             acc.beratKendaraan += Number(item.beratkendaraan || 0);
//             acc.beratMuatan += Number(item.beratmuatan || 0);
//             return acc;
//         }, { volumeTotal: 0, beratTotal: 0, beratKendaraan: 0, beratMuatan: 0 });
//     });

//     const totalPages = computed(() => {
//         return Math.ceil(filteredConcreteBatchingPlant.value.length / itemsPerPage) || 1;
//     });

//     const paginatedConcreteBatchingPlant = computed(() => {
//         const start = (currentPage.value - 1) * itemsPerPage;
//         return filteredConcreteBatchingPlant.value.slice(start, start + itemsPerPage);
//     });

//     const resetDateFilter = () => {
//         startDate.value = '';
//         endDate.value = '';
//         currentPage.value = 1;
//     };

//     // Tambahkan reset filter kolom
//     const resetColumnFilters = () => {
//         Object.keys(columnFilters).forEach(key => columnFilters[key] = '');
//     };

//     const displayedPages = computed(() => {
//         const total = totalPages.value;
//         const current = currentPage.value;
//         const maxVisible = 5; // Jumlah nomor yang ingin ditampilkan

//         let start = Math.max(current - Math.floor(maxVisible / 2), 1);
//         let end = start + maxVisible - 1;

//         if (end > total) {
//             end = total;
//             start = Math.max(end - maxVisible + 1, 1);
//         }

//         const pages = [];
//         for (let i = start; i <= end; i++) {
//             pages.push(i);
//         }
//         return pages;
//     });

//     return {
//         ConcreteBatchingPlant,
//         materialList,
//         kendaraanList,
//         driverList,
//         customerList,
//         beratjenisList,
//         selectedMaterialSatuan,
//         isLoading,
//         searchQuery,
//         currentPage,
//         currentTab,
//         startDate,
//         endDate,
//         switchTab,
//         isEdit,
//         formConcreteBatchingPlant,
//         errors,
//         displayedPages,
//         totalPages,
//         totalFooter,
//         formatNumber,
//         filteredConcreteBatchingPlant,
//         paginatedConcreteBatchingPlant,
//         fetchConcreteBatchingPlant,
//         fetchMaterial,
//         fetchKendaraan,
//         fetchDriver,
//         fetchCustomer,
//         fetchBeratJenis,
//         columnFilters,
//         resetColumnFilters,
//         handleCreate,
//         handleEdit,
//         handleDelete,
//         handleRefresh,
//         submitConcreteBatchingPlant,
//         resetDateFilter
//     };
// }
