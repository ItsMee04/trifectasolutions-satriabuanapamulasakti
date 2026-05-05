import { ref, computed, reactive, watch } from 'vue';
import { timbanganscService } from '../services/timbanganscService';
import { materialService } from '../../material/services/materialService';
import { kendaraanService } from '../../kendaraan/services/kendaraanService'
import { driverService } from '../../driver/services/driverService'
import { customerService } from '../../customer/services/customerService'
import { beratjenisService } from '../../beratjenis/services/beratjenisService';
import { toastfy } from '../../../utilities/toast';
import Swal from 'sweetalert2';

// Shared State
const StoneCrushers = ref([]);
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
})

const formStoneCrusher = reactive({
    id: null,
    nomor: '',
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

export function useTimbanganSC() {

    const switchTab = async (tab) => {
        currentTab.value = tab;
        currentPage.value = 1;
        await fetchStoneCrusher(tab);
    };

    const fetchStoneCrusher = async (jenisValue = null) => {
        isLoading.value = true;
        const targetJenis = jenisValue || currentTab.value;

        try {
            const payload = { jenis: targetJenis };
            const response = await timbanganscService.getTimbanganSC(payload);
            StoneCrushers.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error("Gagal mengambil data Stone Crusher:", error);
            StoneCrushers.value = [];
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
        const material = materialDataRaw.value.find(m => m.id === formStoneCrusher.material_id);
        return material ? material.satuan.toLowerCase() : '';
    });

    // Logika Perhitungan Volume Otomatis
    watch(
        () => [formStoneCrusher.beratmuatan, formStoneCrusher.beratjenis_id, formStoneCrusher.material_id],
        () => {
            const beratMuatan = parseFloat(formStoneCrusher.beratmuatan) || 0;
            const satuan = selectedMaterialSatuan.value;

            // Cari nilai nominal berat jenis dari list berdasarkan ID yang dipilih
            const bjTerpilih = beratjenisList.value.find(b => b.value === formStoneCrusher.beratjenis_id);
            const nilaiBJ = bjTerpilih ? parseFloat(bjTerpilih.label) : 0;

            if (satuan === 'm3') {
                formStoneCrusher.volume = nilaiBJ > 0 ? (beratMuatan / nilaiBJ).toFixed(2) : 0;
            } else if (satuan === 'kg') {
                formStoneCrusher.volume = beratMuatan;
            } else if (satuan === 'liter' || satuan === 'pcs') {
                // Biarkan user input manual, jangan override jika sudah ada isinya
                // kecuali jika baru pindah ke satuan ini
            } else {
                formStoneCrusher.volume = 0;
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

        if (!formStoneCrusher.tanggal) errors.value.tanggal = 'Tanggal tidak boleh kosong.';
        if (!formStoneCrusher.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

        if (formStoneCrusher.volume === null || formStoneCrusher.volume === '') {
            errors.value.volume = 'Volume tidak boleh kosong.';
        }

        if (formStoneCrusher.berattotal === null || formStoneCrusher.berattotal === '') {
            errors.value.berattotal = 'Berat Total tidak boleh kosong.';
        }

        if (formStoneCrusher.beratkendaraan === null || formStoneCrusher.beratkendaraan === '') {
            errors.value.beratkendaraan = 'Berat Kendaraan tidak boleh kosong.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const submitStoneCrusher = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;
        try {
            const payload = {
                id: formStoneCrusher.id,
                tanggal: formStoneCrusher.tanggal,
                material: formStoneCrusher.material_id,
                kendaraan: formStoneCrusher.kendaraan_id,
                driver: formStoneCrusher.driver_id,
                suplier: formStoneCrusher.customer_id,
                beratjenis: formStoneCrusher.beratjenis_id,
                jenis: formStoneCrusher.jenis,
                volume: formStoneCrusher.volume,
                berattotal: formStoneCrusher.berattotal,
                beratkendaraan: formStoneCrusher.beratkendaraan,
                beratmuatan: formStoneCrusher.beratmuatan,
                jarakawal: formStoneCrusher.jarakawal,
                jarakakhir: formStoneCrusher.jarakakhir,
                jarak: formStoneCrusher.jarak,
            };

            let response;
            if (isEdit.value) {
                response = await timbanganscService.updateTimbanganSC(payload);
            } else {
                response = await timbanganscService.storeTimbanganSC(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalStoneCrusher');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await fetchStoneCrusher();
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
                toastfy.error(error.response.data.message || 'Terjadi kesalahan validasi.');
            } else {
                console.log(error)
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
        formStoneCrusher.id = null;
        formStoneCrusher.tanggal = getTodayDate();
        formStoneCrusher.material_id = null;
        formStoneCrusher.kendaraan_id = null;
        formStoneCrusher.driver_id = null;
        formStoneCrusher.customer_id = null;
        formStoneCrusher.beratjenis_id = null,
            formStoneCrusher.jenis = currentTab.value;
        formStoneCrusher.volume = '';
        formStoneCrusher.berattotal = '';
        formStoneCrusher.beratkendaraan = '';
        formStoneCrusher.beratmuatan = '';
        formStoneCrusher.jarakawal = '';
        formStoneCrusher.jarakakhir = '';
        formStoneCrusher.jarak = '';

        const modal = new bootstrap.Modal(document.getElementById('modalStoneCrusher'));
        modal.show();
    };

    watch(
        () => [formStoneCrusher.berattotal, formStoneCrusher.beratkendaraan],
        ([total, kendaraan]) => {
            const t = parseFloat(total) || 0;
            const k = parseFloat(kendaraan) || 0;
            const hasil = t - k;

            // Set hasil ke beratmuatan (jika hasil negatif set ke 0 atau biarkan saja)
            formStoneCrusher.beratmuatan = hasil > 0 ? hasil : 0;
        }
    );

    // Tambahkan WATCH baru untuk perhitungan jarak otomatis
    watch(
        () => [formStoneCrusher.jarakawal, formStoneCrusher.jarakakhir],
        ([awal, akhir]) => {
            const valAwal = parseFloat(awal) || 0;
            const valAkhir = parseFloat(akhir) || 0;
            const hasil = valAkhir - valAwal;

            if (hasil > 0) {
                // Gunakan .toFixed(2) untuk mendapatkan 2 angka di belakang koma
                // Kemudian bungkus dengan Number() agar tipenya kembali menjadi angka, bukan string
                formStoneCrusher.jarak = Number(hasil.toFixed(2));
            } else {
                formStoneCrusher.jarak = 0;
            }
        }
    );

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};
        formStoneCrusher.id = item.id;
        formStoneCrusher.tanggal = item.tanggal;
        formStoneCrusher.material_id = item.material_id;
        formStoneCrusher.kendaraan_id = item.kendaraan_id;
        formStoneCrusher.driver_id = item.driver_id;
        formStoneCrusher.customer_id = item.customer_id;
        formStoneCrusher.beratjenis_id = item.beratjenis_id;
        formStoneCrusher.jenis = item.jenis;
        formStoneCrusher.volume = item.volume;
        formStoneCrusher.berattotal = item.berattotal;
        formStoneCrusher.beratkendaraan = item.beratkendaraan;
        formStoneCrusher.beratmuatan = item.beratmuatan;
        formStoneCrusher.jarakawal = item.jarakawal;
        formStoneCrusher.jarakakhir = item.jarakakhir;

        const modal = new bootstrap.Modal(document.getElementById('modalStoneCrusher'));
        modal.show();
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Data Stone Crusher "${item.material.material}" yang dihapus tidak dapat dikembalikan!`,
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
                await timbanganscService.deleteTimbanganSC(payload);
                toastfy.success('Stone Crusher berhasil dihapus.');
                await fetchStoneCrusher();
            } catch (error) {
                toastfy.error('Gagal menghapus data Stone Crusher.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchStoneCrusher();
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
    const filteredStoneCrusher = computed(() => {
        const query = searchQuery.value.toLowerCase();
        const activeTab = currentTab.value; // Ambil tab yang aktif saat ini

        return StoneCrushers.value.filter(item => {

            const matchesTab = item.jenis === activeTab;
            if (!matchesTab) return false;

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
        return filteredStoneCrusher.value.reduce((acc, item) => {
            acc.volumeTotal += parseFloat(item.volume || 0);
            acc.beratTotal += Number(item.berattotal || 0);
            acc.beratKendaraan += Number(item.beratkendaraan || 0);
            acc.beratMuatan += Number(item.beratmuatan || 0);
            return acc;
        }, { volumeTotal: 0, beratTotal: 0, beratKendaraan: 0, beratMuatan: 0 });
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredStoneCrusher.value.length / itemsPerPage) || 1;
    });

    const paginatedStoneCrusher = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return filteredStoneCrusher.value.slice(start, start + itemsPerPage);
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
        StoneCrushers,
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
        switchTab,
        isEdit,
        formStoneCrusher,
        errors,
        displayedPages,
        totalPages,
        totalFooter,
        formatNumber,
        filteredStoneCrusher,
        paginatedStoneCrusher,
        fetchStoneCrusher,
        fetchMaterial,
        fetchKendaraan,
        fetchDriver,
        fetchCustomer,
        fetchBeratJenis,
        columnFilters,
        resetColumnFilters,
        handleCreate,
        handleEdit,
        handleDelete,
        handleRefresh,
        submitStoneCrusher,
        resetDateFilter
    };
}
