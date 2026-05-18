import { ref } from 'vue'
import { toastfy } from '../../../utilities/toast';

// services
import { timbanganscService } from '../services/timbanganscService';

// shared state
const MenuTimbanganSCList = ref([]);
const isLoading = ref(false);
const currentTab = ref(null);

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

    const switchTab = (menu) => {
        currentTab.value = menu.id;

        console.log('TAB ACTIVE :', menu);
    };

    return {
        isLoading,
        currentTab,
        MenuTimbanganSCList,
        fetchMenuTimbanganSCList,
        switchTab,
    };
}
