import { ref, computed, reactive, watch } from 'vue'
import { toastfy } from '@/utilities/toast';
import Swal from 'sweetalert2';

// Services
import { timbanganmaterialcbpService } from '@/modules/timbangan/concretebatchingplant/material/services/timbanganmaterialcbpService';
import { materialService } from '@/modules/material/services/materialService';
import { kendaraanService } from '@/modules/kendaraan/services/kendaraanService';
import { driverService } from '@/modules/driver/services/driverService';
import { customerService } from '@/modules/customer/services/customerService';
import { suplierService } from '@/modules/suplier/services/suplierService';
import { beratjenisService } from '@/modules/beratjenis/services/beratjenisService';

// Shared State Khusus Kelompok Timbangan Material
const materialItems = ref([]);
const isMaterialLoading = ref(false);

const MaterialList = ref([]);
const KendaraanList = ref([]);
const DriverList = ref([]);
const CustomerList = ref([]);
const SuplierList = ref([]);
const BeratJenisList = ref([]);
const materialDataRaw = ref([]); // State penampung data asli material untuk cek satuan

// State Pencarian, Filter, & Pagination internal rumpun material
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const errors = ref({});
const isEdit = ref(false);
const activeMenuId = ref(null); // Menyimpan ID menu aktif saat ini (3 atau 4)

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

const formMaterialCBP = reactive({
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

export function useTimbanganMaterialCBP() {

    // 1. Fungsi Fetch Utama yang dipicu oleh useNavigationCBP
    const fetchMaterialData = async (menuJenisPlantId) => {
        isMaterialLoading.value = true;
        activeMenuId.value = menuJenisPlantId; // Kunci ID menu yang sedang aktif (3 atau 4)

        try {
            const payload = { menujenisplant_id: menuJenisPlantId };
            const response = await timbanganmaterialcbpService.getTimbanganCBP(payload);
            materialItems.value = response.data;
        } catch (error) {
            toastfy.error('Gagal mengambil data Timbangan Material');
            materialItems.value = [];
            console.error('Error detail:', error);
        } finally {
            isMaterialLoading.value = false;
        }
    }

    const handleRefresh = async () => {
        if (activeMenuId.value) {
            await fetchMaterialData(activeMenuId.value);
        }
    }

    // 2. Load Data Dropdown Master
    const fetchMaterial = async () => {
        try {
            const response = await materialService.getMaterial();
            materialDataRaw.value = response.data;
            MaterialList.value = response.data.map(item => ({
                value: item.id,
                label: item.material
            }));
        } catch (error) {
            console.error("Gagal memuat material:", error);
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
            console.error("Gagal memuat kendaraan:", error)
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
            console.error("Gagal memuat driver:", error)
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

    // 3. Form Handling & Validasi
    const validateForm = () => {
        errors.value = {};

        if (!formMaterialCBP.tanggal) errors.value.tanggal = 'Tanggal tidak boleh kosong.';
        if (!formMaterialCBP.material_id) errors.value.material_id = 'Pilih Material terlebih dahulu.';

        if (formMaterialCBP.volume === null || formMaterialCBP.volume === '') {
            errors.value.volume = 'Volume tidak boleh kosong.';
        }
        if (formMaterialCBP.berattotal === null || formMaterialCBP.berattotal === '') {
            errors.value.berattotal = 'Berat Total tidak boleh kosong.';
        }
        if (formMaterialCBP.beratkendaraan === null || formMaterialCBP.beratkendaraan === '') {
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
        formMaterialCBP.id = null;
        formMaterialCBP.tanggal = getTodayDate();
        formMaterialCBP.material_id = null;
        formMaterialCBP.kendaraan_id = null;
        formMaterialCBP.driver_id = null;
        formMaterialCBP.customer_id = null;
        formMaterialCBP.suplier_id = null;
        formMaterialCBP.tujuan = '';
        formMaterialCBP.beratjenis_id = null;
        formMaterialCBP.menujenisplant_id = activeMenuId.value; // Set sesuai menu aktif
        formMaterialCBP.volume = '';
        formMaterialCBP.berattotal = '';
        formMaterialCBP.beratkendaraan = '';
        formMaterialCBP.beratmuatan = '';
        formMaterialCBP.jarakawal = '';
        formMaterialCBP.jarakakhir = '';
        formMaterialCBP.jarak = '';

        const modal = new bootstrap.Modal(document.getElementById('modalMaterialCBP'));
        modal.show();
    };

    // Kondisi UI Template Form berdasarkan ID Menu (3 = Material In, 4 = Material Out)
    const isTabIn = computed(() => activeMenuId.value === 3);
    const isTabOut = computed(() => activeMenuId.value === 4);

    const isTruckMixer = computed(() => {
        const kendaraan = KendaraanList.value.find(k => k.value === formMaterialCBP.kendaraan_id);
        return kendaraan ? kendaraan.label.toUpperCase().includes('TM') : false;
    });

    const showSupplierFields = computed(() => (isTabIn.value && !isTruckMixer.value) || (isTabOut.value && !isTruckMixer.value));
    const showTMOutFields = computed(() => isTabOut.value && isTruckMixer.value);

    const selectedMaterialSatuan = computed(() => {
        const material = materialDataRaw.value.find(m => m.id === formMaterialCBP.material_id);
        return material ? material.satuan.toLowerCase() : '';
    });

    // 4. Logika Perhitungan Otomatis (Watchers)
    watch(
        () => [formMaterialCBP.beratmuatan, formMaterialCBP.beratjenis_id, formMaterialCBP.material_id, formMaterialCBP.kendaraan_id],
        () => {
            const beratMuatan = parseFloat(formMaterialCBP.beratmuatan) || 0;
            const satuan = selectedMaterialSatuan.value;

            const bjTerpilih = BeratJenisList.value.find(b => b.value === formMaterialCBP.beratjenis_id);
            const nilaiBJ = bjTerpilih ? parseFloat(bjTerpilih.label) : 0;

            if (satuan === 'm3') {
                if (isTruckMixer.value) {
                    formMaterialCBP.volume = 1;
                } else {
                    formMaterialCBP.volume = nilaiBJ > 0 ? (beratMuatan / nilaiBJ).toFixed(2) : 0;
                }
            } else if (satuan === 'kg') {
                formMaterialCBP.volume = beratMuatan;
            } else if (satuan === 'liter' || satuan === 'pcs') {
                // Manual input oleh user
            } else {
                formMaterialCBP.volume = 0;
            }
        }
    );

    watch(
        () => [formMaterialCBP.berattotal, formMaterialCBP.beratkendaraan],
        ([total, kendaraan]) => {
            const t = parseFloat(total) || 0;
            const k = parseFloat(kendaraan) || 0;
            const hasil = t - k;
            formMaterialCBP.beratmuatan = hasil > 0 ? hasil : 0;
        }
    );

    watch(
        () => [formMaterialCBP.jarakawal, formMaterialCBP.jarakakhir],
        ([awal, akhir]) => {
            const valAwal = parseFloat(awal) || 0;
            const valAkhir = parseFloat(akhir) || 0;
            const hasil = valAkhir - valAwal;

            formMaterialCBP.jarak = hasil > 0 ? Number(hasil.toFixed(2)) : 0;
        }
    );

    // 5. Aksi Simpan, Edit, & Hapus
    const submitConcreteBatchingPlant = async () => {
        if (!validateForm()) return false;
        isMaterialLoading.value = true;
        try {
            const payload = {
                id: formMaterialCBP.id,
                tanggal: formMaterialCBP.tanggal,
                material: formMaterialCBP.material_id,
                kendaraan: formMaterialCBP.kendaraan_id,
                driver: formMaterialCBP.driver_id,
                customer: formMaterialCBP.customer_id,
                suplier: formMaterialCBP.suplier_id,
                beratjenis: formMaterialCBP.beratjenis_id,
                menujenisplant_id: formMaterialCBP.menujenisplant_id,
                volume: formMaterialCBP.volume,
                berattotal: formMaterialCBP.berattotal,
                beratkendaraan: formMaterialCBP.beratkendaraan,
                beratmuatan: formMaterialCBP.beratmuatan,
                jarakawal: formMaterialCBP.jarakawal,
                jarakakhir: formMaterialCBP.jarakakhir,
                jarak: formMaterialCBP.jarak,
            };

            let response;
            if (isEdit.value) {
                response = await timbanganmaterialcbpService.updateTimbanganCBP(payload);
            } else {
                response = await timbanganmaterialcbpService.storeTimbanganCBP(payload);
            }

            toastfy.success(response.message || 'Data berhasil disimpan');
            const modalElement = document.getElementById('modalMaterialCBP');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            await handleRefresh();
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
                toastfy.error(error.response.data.message || 'Terjadi kesalahan validasi.');
            } else {
                console.error(error);
                toastfy.error(error.response?.data?.message || 'Gagal menyimpan data.');
            }
            return false;
        } finally {
            isMaterialLoading.value = false;
        }
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        errors.value = {};

        formMaterialCBP.id = item.id;
        formMaterialCBP.tanggal = item.tanggal;
        formMaterialCBP.menujenisplant_id = item.menujenisplant_id;

        const detail = item.timbanganmaterialcbp?.[0] || {};

        formMaterialCBP.material_id = detail.material_id || '';
        formMaterialCBP.kendaraan_id = detail.kendaraan_id || '';
        formMaterialCBP.driver_id = detail.driver_id || '';
        formMaterialCBP.customer_id = detail.customer_id || '';
        formMaterialCBP.suplier_id = detail.suplier_id || '';
        formMaterialCBP.tujuan = detail.tujuan || '';
        formMaterialCBP.beratjenis_id = detail.beratjenis_id || '';
        formMaterialCBP.volume = detail.volume || 0;
        formMaterialCBP.berattotal = detail.berattotal || 0;
        formMaterialCBP.beratkendaraan = detail.beratkendaraan || 0;
        formMaterialCBP.beratmuatan = detail.beratmuatan || 0;
        formMaterialCBP.jarakawal = detail.jarakawal || 0;
        formMaterialCBP.jarakakhir = detail.jarakakhir || 0;

        const modalElement = document.getElementById('modalMaterialCBP');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const handleDelete = async (item) => {
        const namaMaterial = item.timbanganmaterialcbp?.[0]?.material?.material || 'Material';

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            html: `
                <div class="mb-3">
                    <span class="badge bg-info text-dark px-2 py-1 mb-2">Kode: ${item.nomor}</span>
                    <span class="badge bg-secondary text-white px-2 py-1 mb-2">${namaMaterial}</span>
                </div>
                <p class="mb-0">Data Timbangan Material yang dihapus tidak dapat dikembalikan!</p>
            `,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            isMaterialLoading.value = true;
            try {
                const payload = { id: item.id };
                await timbanganmaterialcbpService.deleteTimbanganCBP(payload);
                toastfy.success('Timbangan Material berhasil dihapus.');
                await handleRefresh();
            } catch (error) {
                toastfy.error('Gagal menghapus data Timbangan Material.');
            } finally {
                isMaterialLoading.value = false;
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

    // 6. Pencarian, Pemfilteran per Kolom & Pagination Internal
    const searchMatch = (item, query) => {
        return (
            String(item.nomor || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.material?.material || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.kendaraan?.nomor || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.driver?.nama || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.customer?.nama || '').toLowerCase().includes(query) ||
            String(item.timbanganmaterialcbp?.[0]?.suplier?.nama || '').toLowerCase().includes(query)
        );
    }

    const filteredMaterialCBP = computed(() => {
        const query = searchQuery.value.toLowerCase();

        return materialItems.value.filter(item => {
            const matchesSearch = searchMatch(item, query);

            let matchesDate = true;
            if (startDate.value && endDate.value) {
                matchesDate = item.tanggal >= startDate.value && item.tanggal <= endDate.value;
            } else if (startDate.value) {
                matchesDate = item.tanggal >= startDate.value;
            } else if (endDate.value) {
                matchesDate = item.tanggal <= endDate.value;
            }

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
                    default: return true;
                }
            });

            return matchesSearch && matchesDate && matchesColumns;
        });
    });

    const totalFooter = computed(() => {
        return filteredMaterialCBP.value.reduce((acc, item) => {
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
        return Math.ceil(filteredMaterialCBP.value.length / itemsPerPage.value) || 1;
    });

    const paginatedMaterialCBP = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredMaterialCBP.value.slice(start, start + itemsPerPage.value);
    });

    const resetDateFilter = () => {
        startDate.value = '';
        endDate.value = '';
        currentPage.value = 1;
    };

    const resetColumnFilters = () => {
        Object.keys(columnFilters).forEach(key => columnFilters[key] = '');
    };

    const displayedPages = computed(() => {
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
        materialItems,
        isMaterialLoading,
        fetchMaterialData,
        handleRefresh,

        MaterialList,
        KendaraanList,
        DriverList,
        CustomerList,
        BeratJenisList,
        SuplierList,
        formMaterialCBP,

        searchQuery,
        startDate,
        endDate,
        currentPage,
        itemsPerPage,
        errors,
        isEdit,
        columnFilters,

        fetchMaterial,
        fetchKendaraan,
        fetchDriver,
        fetchCustomer,
        fetchSuplier,
        fetchBeratJenis,
        handleCreate,
        showSupplierFields,
        showTMOutFields,
        submitConcreteBatchingPlant,
        handleEdit,
        handleDelete,
        formatNumber,
        filteredMaterialCBP,
        totalFooter,
        totalPages,
        paginatedMaterialCBP,
        resetDateFilter,
        resetColumnFilters,
        displayedPages,
    }
}
