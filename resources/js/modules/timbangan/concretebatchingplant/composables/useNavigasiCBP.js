import { ref, computed } from 'vue';
import { timbangancbpService } from '../services/timbangancbpService';
import { toastfy } from '../../../../utilities/toast';

// Shared state agar data menu dan status halaman aktif konsisten di seluruh aplikasi
const MenuTimbanganCBPList = ref([]);
const currentTab = ref(null);
const currentPage = ref(1);
const isMenuLoading = ref(false);

export function useNavigationCBP() {

    // 1. Fungsi untuk mengambil daftar menu jenis dari API
    const fetchMenuTimbanganCBPList = async () => {
        isMenuLoading.value = true;
        try {
            const response = await timbangancbpService.getMenuJenisCBP();
            MenuTimbanganCBPList.value = response.data;

            // Kembalikan menu pertama sebagai rekomendasi default jika belum ada tab aktif
            if (MenuTimbanganCBPList.value.length > 0 && !currentTab.value) {
                return MenuTimbanganCBPList.value[0];
            }
        } catch (error) {
            toastfy.error('Gagal mengambil kategori menu timbangan CBP');
            console.error('Error fetch menu:', error);
        } finally {
            isMenuLoading.value = false;
        }
        return null;
    };

    // 2. Fungsi Pengatur Lalu Lintas Utama (Switch-Case ID 3 - 12)
    const switchTab = async (menu, composables = {}) => {
        currentTab.value = menu.id;
        currentPage.value = 1; // Reset pagination ke halaman 1 setiap ganti menu

        const menuId = Number(menu.id);
        console.log(`[Navigation] Dialihkan ke Kategori ID: ${menuId} (${menu.menujenis})`);

        try {
            switch (menuId) {
                case 3: // MATERIAL IN
                case 4: // MATERIAL OUT
                    if (composables.materialCBP) {
                        await composables.materialCBP.fetchMaterialData(menuId);
                    }
                    break;

                case 5: // SEMEN
                    if (composables.semenCBP) {
                        await composables.semenCBP.fetchSemenData(menuId);
                    }
                    break;

                case 6: // BAHAN BAKAR
                    if (composables.bahanBakarCBP) {
                        await composables.bahanBakarCBP.fetchBahanBakarData(menuId);
                    }
                    break;

                case 7: // OBAT
                    if (composables.obatCBP) {
                        await composables.obatCBP.fetchObatData(menuId);
                    }
                    break;

                case 8: // READY MIX
                    if (composables.readyMixCBP) {
                        await composables.readyMixCBP.fetchReadyMixData(menuId);
                    }
                    break;

                case 9: // U-DITCH & KANSTIN
                    if (composables.uditchKanstinCBP) {
                        await composables.uditchKanstinCBP.fetchUditchKanstinData(menuId);
                    }
                    break;

                case 10: // KARSO - U DITCH
                    if (composables.karsoUditchCBP) {
                        await composables.karsoUditchCBP.fetchKarsoUditchData(menuId);
                    }
                    break;

                case 11: // BESI
                    if (composables.besiCBP) {
                        await composables.besiCBP.fetchBesiData(menuId);
                    }
                    break;

                case 12: // MATERIAL RENOVASI PLANT
                    if (composables.materialRenovasiCBP) {
                        await composables.materialRenovasiCBP.fetchMaterialRenovasiData(menuId);
                    }
                    break;

                default:
                    console.warn(`[Navigation] Warning: Menu ID ${menuId} tidak dikenali dalam sistem navigasi.`);
                    break;
            }
        } catch (error) {
            console.error(`[Navigation] Gagal mengalihkan data untuk menu ${menu.menujenis}:`, error);
            toastfy.error(`Gagal memuat data ${menu.menujenis}`);
        }
    };

    // 3. Computed untuk mendapatkan nama teks dari tab yang sedang aktif
    const currentTabName = computed(() => {
        const activeMenu = MenuTimbanganCBPList.value.find(menu => Number(menu.id) === Number(currentTab.value));
        return activeMenu ? activeMenu.menujenis : '';
    });

    return {
        MenuTimbanganCBPList,
        currentTab,
        currentPage,
        currentTabName,
        isMenuLoading,
        fetchMenuTimbanganCBPList,
        switchTab
    };
}
