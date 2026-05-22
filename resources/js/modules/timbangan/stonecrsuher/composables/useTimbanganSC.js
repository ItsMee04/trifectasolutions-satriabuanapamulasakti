import { ref, computed, reactive, watch } from 'vue'
import { toastfy } from '../../../../utilities/toast';
import Swal from 'sweetalert2';

// services
import { timbanganscService } from '../services/timbanganscService';
import { materialService } from '../../../material/services/materialService';
import { kendaraanService } from '../../../kendaraan/services/kendaraanService';
import { driverService } from '../../../driver/services/driverService';
import { customerService } from '../../../customer/services/customerService';
import { beratjenisService } from '../../../beratjenis/services/beratjenisService';

// shared state
const MenuTimbanganSCList = ref([]);
const StoneCrusher = ref([]);
const MaterialList = ref([]);
const materialDataRaw = ref([]);
const KendaraanList = ref([]);
const DriverList = ref([]);
const CustomerList = ref([]);
const BeratJenisList = ref([]);

const isLoading = ref(false);
const currentTab = ref(null);
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');
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
const currentPage = ref(1);
const itemsPerPage = 10;
const errors = ref({});
const isEdit = ref(false);

const formStoneCrusher = reactive({
    id: null,
    tanggal: '',
    material_id: null,
    kendaraan_id: null,
    driver_id: null,
    customer_id: null,
    beratjenis_id: null,
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: '',
    jarakawal: '',
    jarakakhir: '',
    jarak: '',
});

export function useTimbanganSC() {

    const fetchMenuTimbanganSCList = async () => {
        try {
            isLoading.value = true;

            const response = await timbanganscService.getMenuJenisSC();

            MenuTimbanganSCList.value = response.data;

            // otomatis set tab pertama
            if (MenuTimbanganSCList.value.length > 0 && !currentTab.value) {
                currentTab.value = MenuTimbanganSCList.value[0].id;
            }

        } catch (error) {
            toastfy.error(error.message);
            console.error('Error fetching Menu Timbangan SC List:', error);
        } finally {
            isLoading.value = false;
        }
    };

    // 2. Ambil data list Timbangan Stone Crusher berdasarkan tab aktif
    const fetchStoneCrusher = async (jenisValue = null) => {
        isLoading.value = true;

        // Ambil ID dari parameter, jika tidak ada pakai tab yang sedang aktif
        const targetJenis = jenisValue || currentTab.value;

        try {
            // MEMBUAT PAYLOAD: Hanya mengirimkan jenis yang dipilih saja
            const payload = {
                menujenisplant_id: targetJenis
            };

            // Kirim objek payload ke service
            const response = await timbanganscService.getTimbanganSC(payload);

            // Normalisasi penangkapan array data
            StoneCrusher.value = response.data?.data || response.data || [];
        } catch (error) {
            console.error("Gagal mengambil data Stone Crusher:", error);
            StoneCrusher.value = [];
            toastfy.error("Gagal memuat data timbangan");
        } finally {
            isLoading.value = false;
        }
    };

    // BENAR (Ditambahkan async)
    const switchTab = async (menu) => {
        currentTab.value = menu.id;
        currentPage.value = 1; // <--- SANGAT PENTING: Reset ke halaman pertama setiap ganti jenis tab
        console.log('TAB ACTIVE KINI:', menu.nama || menu.id);

        try {
            await fetchStoneCrusher(menu.id);
        } catch (error) {
            console.error("Gagal memuat data setelah pindah tab:", error);
        }
    };

    // LOGIKA BARU: Computed untuk mendapatkan nama tab yang sedang aktif
    const currentTabName = computed(() => {
        // Cari objek menu di dalam list yang ID-nya cocok dengan currentTab
        const activeMenu = MenuTimbanganSCList.value.find(menu => menu.id === currentTab.value);

        // Kembalikan properti nama/menujenis (sesuaikan dengan field dari database kamu, misal 'nama' atau 'menujenis')
        return activeMenu ? (activeMenu.nama || activeMenu.menujenis) : '';
    });

    const handleRefresh = async () => {
        await fetchStoneCrusher();
    }

    const fetchMaterial = async () => {
        try {
            const response = await materialService.getMaterial();
            materialDataRaw.value = response.data; // Simpan data asli untuk cek satuan nanti
            MaterialList.value = response.data.map(item => ({
                value: item.id,
                label: item.material
            }));
        } catch (error) {
            console.log("Gagal memuat material:", error);
        }
    };

    const fetchKendaraan = async () => {
        try {
            const response = await kendaraanService.getKendaraan();
            KendaraanList.value = response.data.map(item => ({
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
            DriverList.value = response.data.map(item => ({
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
            CustomerList.value = response.data.map(item => ({
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
            BeratJenisList.value = response.data.map(item => ({
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

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
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
        formStoneCrusher.beratjenis_id = null;
        formStoneCrusher.menujenisplant_id = currentTab.value;
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
            const bjTerpilih = BeratJenisList.value.find(b => b.value === formStoneCrusher.beratjenis_id);
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
                menujenisplant_id: formStoneCrusher.menujenisplant_id,
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

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};

        // 1. Ambil data ID dan Tanggal dari objek utama (Root)
        formStoneCrusher.id = item.id;
        formStoneCrusher.tanggal = item.tanggal;
        formStoneCrusher.menujenisplant_id = item.menujenisplant_id;

        // 2. Ambil referensi detail timbangan material indeks ke-0 (jika ada)
        const detail = item.timbanganmaterialsc?.[0] || {};

        // 3. Petakan field detail ke dalam formStoneCrusher
        formStoneCrusher.material_id = detail.material_id || '';
        formStoneCrusher.kendaraan_id = detail.kendaraan_id || '';
        formStoneCrusher.driver_id = detail.driver_id || '';
        formStoneCrusher.customer_id = detail.customer_id || '';
        formStoneCrusher.beratjenis_id = detail.beratjenis_id || '';
        formStoneCrusher.volume = detail.volume || 0;
        formStoneCrusher.berattotal = detail.berattotal || 0;
        formStoneCrusher.beratkendaraan = detail.beratkendaraan || 0;
        formStoneCrusher.beratmuatan = detail.beratmuatan || 0;
        formStoneCrusher.jarakawal = detail.jarakawal || 0;
        formStoneCrusher.jarakakhir = detail.jarakakhir || 0;

        // Tampilkan modal setelah form terisi dengan benar
        const modalElement = document.getElementById('modalStoneCrusher');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const handleDelete = async (item) => {
        // Ambil info material/jenis plant dari item untuk ditampilkan di badge jika perlu
        const namaMaterial = item.timbanganmaterialsc?.[0]?.material?.material || 'Material';

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            // Menggunakan properti 'html' agar bisa merender tag <span> HTML
            html: `
                <div class="mb-3">
                    <span class="badge bg-info text-dark px-2 py-1 mb-2">Kode: ${item.nomor}</span>
                    <span class="badge bg-secondary text-white px-2 py-1 mb-2">${namaMaterial}</span>
                </div>
                <p class="mb-0">Data Stone Crusher yang dihapus tidak dapat dikembalikan!</p>
            `,
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
            String(item.timbanganmaterialsc?.[0]?.material?.material || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialsc?.[0]?.kendaraan?.nomor || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialsc?.[0]?.driver?.nama || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialsc?.[0]?.customer?.nama || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialsc?.[0]?.volume || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialsc?.[0]?.berattotal || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialsc?.[0]?.beratkendaraan || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialsc?.[0]?.beratmuatan || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredStoneCrusher = computed(() => {
        const query = searchQuery.value.toLowerCase();
        const activeTab = currentTab.value;

        return StoneCrusher.value.filter(item => {

            // PERBAIKAN: Gunakan == agar tidak sensitif terhadap perbedaan tipe data (string vs int)
            const matchesTab = !activeTab || item.menujenisplant_id == activeTab;
            if (!matchesTab) return false;

            // 1. FILTER SEARCH GLOBAL
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

            // 3. FILTER PER KOLOM
            const matchesColumns = Object.keys(columnFilters).every(key => {
                const filterVal = columnFilters[key].toLowerCase();
                if (!filterVal) return true;

                switch (key) {
                    case 'material':
                        return String(item.timbanganmaterialsc?.[0]?.material?.material || '').toLowerCase().includes(filterVal);
                    case 'tanggal':
                        return String(item.tanggal || '').toLowerCase().includes(filterVal);
                    case 'nomor':
                        return String(item.nomor || '').toLowerCase().includes(filterVal);
                    case 'kendaraan':
                        return String(item.timbanganmaterialsc?.[0]?.kendaraan?.nomor || '').toLowerCase().includes(filterVal);
                    case 'driver':
                        return String(item.timbanganmaterialsc?.[0]?.driver?.nama || '').toLowerCase().includes(filterVal);
                    case 'customer':
                        return String(item.timbanganmaterialsc?.[0]?.customer?.nama || '').toLowerCase().includes(filterVal);
                    case 'volume':
                        return String(item.timbanganmaterialsc?.[0]?.volume || '').toLowerCase().includes(filterVal);
                    case 'berattotal':
                        return String(item.timbanganmaterialsc?.[0]?.berattotal || '').toLowerCase().includes(filterVal);
                    case 'beratkendaraan':
                        return String(item.timbanganmaterialsc?.[0]?.beratkendaraan || '').toLowerCase().includes(filterVal);
                    case 'beratmuatan':
                        return String(item.timbanganmaterialsc?.[0]?.beratmuatan || '').toLowerCase().includes(filterVal);
                    default: return true;
                }
            });

            return matchesSearch && matchesDate && matchesColumns;
        });
    });

    const totalFooter = computed(() => {
        // Gunakan reduce dengan mengembalikan objek baru di setiap iterasi (Immutable)
        return filteredStoneCrusher.value.reduce((acc, item) => {
            const detail = item.timbanganmaterialsc?.[0];

            if (detail) {
                return {
                    volumeTotal: acc.volumeTotal + parseFloat(detail.volume || 0),
                    beratTotal: acc.beratTotal + parseFloat(detail.berattotal || 0),
                    beratKendaraan: acc.beratKendaraan + parseFloat(detail.beratkendaraan || 0),
                    beratMuatan: acc.beratMuatan + parseFloat(detail.beratmuatan || 0)
                };
            }

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
        isLoading,
        currentTab,
        currentTabName,
        MenuTimbanganSCList,
        fetchMenuTimbanganSCList,
        switchTab,
        StoneCrusher,
        fetchStoneCrusher,
        searchQuery,
        startDate,
        endDate,
        columnFilters,
        resetDateFilter,
        resetColumnFilters,
        filteredStoneCrusher,
        formatNumber,
        currentPage,
        totalPages,
        paginatedStoneCrusher,
        displayedPages,
        totalFooter,

        MaterialList,
        KendaraanList,
        DriverList,
        CustomerList,
        BeratJenisList,
        fetchMaterial,
        fetchKendaraan,
        fetchDriver,
        fetchCustomer,
        fetchBeratJenis,

        formStoneCrusher,
        errors,
        isEdit,
        validateForm,
        handleCreate,
        handleRefresh,
        selectedMaterialSatuan,
        submitStoneCrusher,
        handleEdit,
        handleDelete,
        handleRefresh,
    };
}
