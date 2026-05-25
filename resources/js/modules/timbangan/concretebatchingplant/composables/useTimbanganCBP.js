import { ref, computed, reactive, watch } from 'vue'
import { toastfy } from '../../../../utilities/toast';
import Swal from 'sweetalert2';

// services
import { timbangancbpService } from '../../concretebatchingplant/services/timbanganCBPService';
import { materialService } from '../../../material/services/materialService';
import { kendaraanService } from '../../../kendaraan/services/kendaraanService';
import { driverService } from '../../../driver/services/driverService';
import { customerService } from '../../../customer/services/customerService';
import { suplierService } from '../../../suplier/services/suplierService';
import { beratjenisService } from '../../../beratjenis/services/beratjenisService';

// share state
const MenuTimbanganCBPList = ref([]);
const ConcreteBatchingPlant = ref([]);
const MaterialList = ref([]);
const KendaraanList = ref([]);
const DriverList = ref([]);
const CustomerList = ref([]);
const SuplierList = ref([]);
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
    suplier: '',
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: '',
});
const currentPage = ref(1);
const itemsPerPage = ref(10);
const errors = ref({});
const isEdit = ref(false);

const formConcreteBatchingPlant = reactive({
    id: null,
    tanggal: '',
    material_id: null,
    kendaraan_id: null,
    driver_id: null,
    customer_id: null,
    suplier_id: null,
    beratjenis_id: null,
    volume: '',
    berattotal: '',
    beratkendaraan: '',
    beratmuatan: '',
    jarakawal: '',
    jarakakhir: '',
    jarak: '',
});

export function useTimbanganCBP() {

    const fetchMenuTimbanganCBPList = async () => {
        try {
            isLoading.value = true;
            const response = await timbangancbpService.getMenuJenisCBP();
            MenuTimbanganCBPList.value = response.data;

            if (MenuTimbanganCBPList.value.length > 0 && !currentTab.value) {
                currentTab.value = MenuTimbanganCBPList.value[0].id; // Set tab pertama sebagai default
            }
        } catch (error) {
            toastfy.error('Gagal mengambil data Timbangan CBP');
            console.log('Error detail:', error);
        } finally {
            isLoading.value = false;
        }
    }

    const fetchConcreteBatchingPlant = async (jenisValue = null) => {
        isLoading.value = true;

        const targetJenis = jenisValue || currentTab.value;

        try {
            const payload = {
                menujenisplant_id: targetJenis,
            };

            const response = await timbangancbpService.getTimbanganCBP(payload);
            ConcreteBatchingPlant.value = response.data;
        } catch (error) {
            toastfy.error('Gagal mengambil data Timbangan CBP');
            ConcreteBatchingPlant.value = []; // Pastikan data direset jika terjadi error
            console.log('Error detail:', error);
        } finally {
            isLoading.value = false;
        }
    }

    // BENAR (Ditambahkan async)
    const switchTab = async (menu) => {
        currentTab.value = menu.id;
        currentPage.value = 1; // <--- SANGAT PENTING: Reset ke halaman pertama setiap ganti jenis tab
        console.log('TAB ACTIVE KINI:', menu.nama || menu.id);

        try {
            await fetchConcreteBatchingPlant(menu.id);
        } catch (error) {
            console.error("Gagal memuat data setelah pindah tab:", error);
        }
    };

    // LOGIKA BARU: Computed untuk mendapatkan nama tab yang sedang aktif
    const currentTabName = computed(() => {
        // Cari objek menu di dalam list yang ID-nya cocok dengan currentTab
        const activeMenu = MenuTimbanganCBPList.value.find(menu => menu.id === currentTab.value);

        // Kembalikan properti nama/menujenis (sesuaikan dengan field dari database kamu, misal 'nama' atau 'menujenis')
        return activeMenu ? (activeMenu.nama || activeMenu.menujenis) : '';
    });

    const handleRefresh = async () => {
        await fetchConcreteBatchingPlant();
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

    const fetchSuplier = async () => {
        try {
            const response = await suplierService.getSuplier();
            SuplierList.value = response.data.map(item => ({
                value: item.id,
                label: item.nama
            }));
        } catch (error) {
            console.error("Gagal memuat suplier:", error);
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

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
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
        formConcreteBatchingPlant.suplier_id = null;
        formConcreteBatchingPlant.tujuan = '';
        formConcreteBatchingPlant.beratjenis_id = null;
        formConcreteBatchingPlant.menujenisplant_id = currentTab.value;
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

    const isTabIn = computed(() => {
        return currentTabName.value?.toUpperCase().includes('MATERIAL IN');
    });

    const isTabOut = computed(() => {
        return currentTabName.value?.toUpperCase().includes('MATERIAL OUT');
    });

    // Logika deteksi Kendaraan TM
    const isTruckMixer = computed(() => {
        const kendaraan = kendaraanList.value.find(k => k.value === formConcreteBatchingPlant.kendaraan_id);
        return kendaraan ? kendaraan.label.toUpperCase().includes('TM') : false;
    });

    // Gabungan Kondisi untuk Template
    const showSupplierFields = computed(() => isTabIn.value && !isTruckMixer.value || isTabOut.value && !isTruckMixer.value);
    const showTMOutFields = computed(() => isTabOut.value && isTruckMixer.value);

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
                suplier: formConcreteBatchingPlant.suplier_id,
                beratjenis: formConcreteBatchingPlant.beratjenis_id,
                menujenisplant_id: formConcreteBatchingPlant.menujenisplant_id,
                volume: formConcreteBatchingPlant.volume,
                berattotal: formConcreteBatchingPlant.berattotal,
                beratkendaraan: formConcreteBatchingPlant.beratkendaraan,
                beratmuatan: formConcreteBatchingPlant.beratmuatan,
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
        formConcreteBatchingPlant.id = item.id;
        formConcreteBatchingPlant.tanggal = item.tanggal;
        formConcreteBatchingPlant.menujenisplant_id = item.menujenisplant_id;

        // 2. Ambil referensi detail timbangan material indeks ke-0 (jika ada)
        const detail = item.timbanganmaterialcbp?.[0] || {};

        // 3. Petakan field detail ke dalam formConcreteBatchingPlant
        formConcreteBatchingPlant.material_id = detail.material_id || '';
        formConcreteBatchingPlant.kendaraan_id = detail.kendaraan_id || '';
        formConcreteBatchingPlant.driver_id = detail.driver_id || '';
        formConcreteBatchingPlant.customer_id = detail.customer_id || '';
        formConcreteBatchingPlant.suplier_id = detail.suplier_id || '';
        formConcreteBatchingPlant.tujuan = detail.tujuan || '';
        formConcreteBatchingPlant.beratjenis_id = detail.beratjenis_id || '';
        formConcreteBatchingPlant.volume = detail.volume || 0;
        formConcreteBatchingPlant.berattotal = detail.berattotal || 0;
        formConcreteBatchingPlant.beratkendaraan = detail.beratkendaraan || 0;
        formConcreteBatchingPlant.beratmuatan = detail.beratmuatan || 0;
        formConcreteBatchingPlant.jarakawal = detail.jarakawal || 0;
        formConcreteBatchingPlant.jarakakhir = detail.jarakakhir || 0;

        // Tampilkan modal setelah form terisi dengan benar
        const modalElement = document.getElementById('modalConcreteBatchingPlant');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const handleDelete = async (item) => {
        // Ambil info material/jenis plant dari item untuk ditampilkan di badge jika perlu
        const namaMaterial = item.timbanganmaterialcbp?.[0]?.material?.material || 'Material';

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            // Menggunakan properti 'html' agar bisa merender tag <span> HTML
            html: `
                    <div class="mb-3">
                        <span class="badge bg-info text-dark px-2 py-1 mb-2">Kode: ${item.nomor}</span>
                        <span class="badge bg-secondary text-white px-2 py-1 mb-2">${namaMaterial}</span>
                    </div>
                    <p class="mb-0">Data Concrete Batching Plant yang dihapus tidak dapat dikembalikan!</p>
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
                await timbangancbpService.deleteTimbanganCBP(payload);
                toastfy.success('Concrete Batching Plant berhasil dihapus.');
                await fetchConcreteBatchingPlant();
            } catch (error) {
                toastfy.error('Gagal menghapus data Concrete Batching Plant.');
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
            String(item.timbanganmaterialcbp?.[0]?.material?.material || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.kendaraan?.nomor || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.driver?.nama || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.customer?.nama || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.suplier?.nama || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.volume || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.berattotal || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.beratkendaraan || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.beratmuatan || '').toLowerCase().includes(query)
        );
    }

    // --- FILTER UTAMA (Text + Date Range) ---
    const filteredConcreteBatchingPlant = computed(() => {
        const query = searchQuery.value.toLowerCase();
        const activeTab = currentTab.value;

        return ConcreteBatchingPlant.value.filter(item => {

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
                        return String(item.timbanganmaterialcbp?.[0]?.material?.material || '').toLowerCase().includes(filterVal);
                    case 'tanggal':
                        return String(item.tanggal || '').toLowerCase().includes(filterVal);
                    case 'nomor':
                        return String(item.nomor || '').toLowerCase().includes(filterVal);
                    case 'kendaraan':
                        return String(item.timbanganmaterialcbp?.[0]?.kendaraan?.nomor || '').toLowerCase().includes(filterVal);
                    case 'driver':
                        return String(item.timbanganmaterialcbp?.[0]?.driver?.nama || '').toLowerCase().includes(filterVal);
                    case 'customer':
                        return String(item.timbanganmaterialcbp?.[0]?.customer?.nama || '').toLowerCase().includes(filterVal);
                    case 'suplier':
                        return String(item.timbanganmaterialcbp?.[0]?.suplier?.nama || '').toLowerCase().includes(filterVal);
                    case 'volume':
                        return String(item.timbanganmaterialcbp?.[0]?.volume || '').toLowerCase().includes(filterVal);
                    case 'berattotal':
                        return String(item.timbanganmaterialcbp?.[0]?.berattotal || '').toLowerCase().includes(filterVal);
                    case 'beratkendaraan':
                        return String(item.timbanganmaterialcbp?.[0]?.beratkendaraan || '').toLowerCase().includes(filterVal);
                    case 'beratmuatan':
                        return String(item.timbanganmaterialcbp?.[0]?.beratmuatan || '').toLowerCase().includes(filterVal);
                    default: return true;
                }
            });

            return matchesSearch && matchesDate && matchesColumns;
        });
    });

    const totalFooter = computed(() => {
        // Gunakan reduce dengan mengembalikan objek baru di setiap iterasi (Immutable)
        return filteredConcreteBatchingPlant.value.reduce((acc, item) => {
            const detail = item.timbanganmaterialcbp?.[0];

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
        MenuTimbanganCBPList,
        ConcreteBatchingPlant,
        fetchConcreteBatchingPlant,
        fetchMenuTimbanganCBPList,

        MaterialList,
        KendaraanList,
        DriverList,
        CustomerList,
        BeratJenisList,
        SuplierList,

        isLoading,
        currentTab,
        searchQuery,
        startDate,
        endDate,
        currentPage,
        itemsPerPage,
        errors,
        isEdit,
        switchTab,
        currentTabName,
        handleRefresh,
        handleCreate,
        showSupplierFields,
        showTMOutFields,
        submitConcreteBatchingPlant,
        handleEdit,
        handleDelete,
        formatNumber,
        filteredConcreteBatchingPlant,
        totalFooter,
        totalPages,
        paginatedConcreteBatchingPlant,
        resetDateFilter,
        resetColumnFilters,
        displayedPages,
        columnFilters,
    }
}

