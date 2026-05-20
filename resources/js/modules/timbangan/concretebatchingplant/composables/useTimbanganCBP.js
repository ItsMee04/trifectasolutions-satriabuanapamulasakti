import { ref, computed, reactive, watch } from 'vue'
import { toastfy } from '../../../../utilities/toast';
import Swal from 'sweetalert2';

// services
import { timbangancbpService } from '../../concretebatchingplant/services/timbanganCBPService';
import { materialService } from '../../../material/services/materialService';
import { kendaraanService } from '../../../kendaraan/services/kendaraanService';
import { driverService } from '../../../driver/services/driverService';
import { customerService } from '../../../customer/services/customerService';
import { beratjenisService } from '../../../beratjenis/services/beratjenisService';

const MenuTimbanganCBPList = ref([]);
const ConcreteBatchingPlant = ref([]);
const MaterialList = ref([]);
const KendaraanList = ref([]);
const DriverList = ref([]);
const CustomerList = ref([]);
const BeratJenisList = ref([]);

const isLoading = ref(false);
const currentTab = ref(null);
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const errors = ref({});
const isEdit = ref(false);

export function useTimbanganCBP() {

    const fetchMenuTimbanganCBPList = async () => {
        try {
            isLoading.value = true;
            const response = await timbangancbpService.getMenuJenisCBP();
            MenuTimbanganCBPList.value = response.data;
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
    }
}

