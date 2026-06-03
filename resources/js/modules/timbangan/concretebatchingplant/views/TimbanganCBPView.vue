<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman CBP (Concrete Batching Plant)</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Timbangan</li>
                            <li class="breadcrumb-item active">CBP</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="sc-navigation mb-4">
            <div class="nav-wrapper">

                <button v-for="menu in MenuTimbanganCBPList" :key="menu.id" type="button" class="nav-item"
                    :class="{ active: currentTab === menu.id }" @click="handleTabClick(menu)">
                    <div class="nav-icon dark">
                        <i class="feather-grid"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">
                            {{ menu.menujenis }}
                        </span>

                        <span class="nav-subtitle">
                            Menu Timbangan
                        </span>
                    </div>
                </button>

            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div v-if="globalLoading" class="text-center my-4">
                    <p>Memuat data...</p>
                </div>

                <div v-else>
                    <component :is="activeTableComponent" />
                </div>
            </div>
        </div>

        <component :is="activeModalComponent" />
    </div>
</template>

<script setup>
import { onMounted, computed, h } from 'vue';

// 1. Import Composable Navigasi Utama
import { useNavigationCBP } from '@/modules/timbangan/concretebatchingplant/composables/useNavigasiCBP.js';

// 2. Import Composable Fitur Spesifik
import { useTimbanganMaterialCBP } from '@/modules/timbangan/concretebatchingplant/material/composables/useTimbanganMaterialCBP.js';
import { useTimbanganSemenCBP } from '@/modules/timbangan/concretebatchingplant/semen/composables/useTimbanganSemenCBP.js';

// // 3. Import Components Tabel Spesifik
// MATERIAL
import TimbanganMaterialCBPTable from '@/modules/timbangan/concretebatchingplant/material/components/TimbanganMaterialCBPTable.vue';
import TimbanganMaterialCBPModal from '@/modules/timbangan/concretebatchingplant/material/components/TimbanganMaterialCBPModal.vue';

// SEMEN
import TimbanganSemenCBPTable from '@/modules/timbangan/concretebatchingplant/semen/components/TimbanganSemenCBPTable.vue';
// import TimbanganSemenCBPModal from '@/modules/timbangan/concretebatchingplant/semen/components/TimbanganSemenCBPModal.vue';

// // import TimbanganSemenCBPTable from '../components/TimbanganSemenCBPTable.vue'; // Contoh masa depan

// Destruktur fungsi & state dari Navigasi Pusat
const {
    MenuTimbanganCBPList,
    currentTab,
    currentPage,
    currentTabName,
    isMenuLoading,
    fetchMenuTimbanganCBPList,
    switchTab
} = useNavigationCBP();

// Inisialisasi Composable Kelompok Fitur
const materialCBP = useTimbanganMaterialCBP();
const semenCBP = useTimbanganSemenCBP();

// Daftarkan semua instance composable
const registeredComposables = {
    materialCBP,
    semenCBP
};

// SWITCH CASE UNTUK RENDERING COMPONENT TABEL
const activeTableComponent = computed(() => {
    const menuId = Number(currentTab.value);

    switch (menuId) {
        case 3: // MATERIAL IN
        case 4: // MATERIAL OUT
            return TimbanganMaterialCBPTable; // Langsung return komponennya saja tanpa await fetch

        case 5: // SEMEN
            return TimbanganSemenCBPTable;

        case 6: // BAHAN BAKAR
            return h('div', { class: 'd-flex align-items-center justify-content-center my-4 text-danger' }, `Component untuk ${currentTabName.value} belum tersedia.`);

        case 7: // OBAT
            return h('div', { class: 'd-flex align-items-center justify-content-center my-4 text-danger' }, `Component untuk ${currentTabName.value} belum tersedia.`);

        case 8: // READY MIX
            return h('div', { class: 'd-flex align-items-center justify-content-center my-4 text-danger' }, `Component untuk ${currentTabName.value} belum tersedia.`);

        case 9: // U-DITCH & KANSTIN
            return h('div', { class: 'd-flex align-items-center justify-content-center my-4 text-danger' }, `Component untuk ${currentTabName.value} belum tersedia.`);

        case 10: // KARSO & U-DITCH
            return h('div', { class: 'd-flex align-items-center justify-content-center my-4 text-danger' }, `Component untuk ${currentTabName.value} belum tersedia.`);

        case 11: // BESI
            return h('div', { class: 'd-flex align-items-center justify-content-center my-4 text-danger' }, `Component untuk ${currentTabName.value} belum tersedia.`);

        case 12: // MATERIAL RENOVASI PLANT
            return h('div', { class: 'd-flex align-items-center justify-content-center my-4 text-danger' }, `Component untuk ${currentTabName.value} belum tersedia.`);

        default:
            return h('div', { class: 'text-center my-4' }, 'Silakan pilih menu timbangan.');
    }
});

// SWITCH CASE UNTUK RENDERING COMPONENT MODAL
const activeModalComponent = computed(() => {
    const menuId = Number(currentTab.value);

    switch (menuId) {
        case 3: // MATERIAL IN
        case 4: // MATERIAL OUT
            return TimbanganMaterialCBPModal;

        // case 5: // SEMEN (Contoh jika besok sudah dibuat)
        //     // return TimbanganSemenCBPModal;
        //     return TimbanganSemenCBPModal;

        default:
            return null; // Menu lain yang belum ada modalnya tidak akan merender apa pun
    }
});

// Kombinasikan semua state loading dari sub-composable aktif
const globalLoading = computed(() => {
    if (isMenuLoading.value) return true;

    switch (currentTab.value) {
        case 3:
        case 4:
            return materialCBP.isMaterialLoading.value;
        case 5:
            return semenCBP.isSemenLoading.value;
        default:
            return false;
    }
});

// Fungsi pembungkus klik tab
const handleTabClick = async (menu) => {
    await switchTab(menu, registeredComposables);
};

onMounted(async () => {
    const defaultMenu = await fetchMenuTimbanganCBPList();
    if (defaultMenu) {
        await handleTabClick(defaultMenu);
    }
});
</script>

<style scoped>
.sc-navigation {
    width: 100%;
}

.nav-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
}

.nav-item {
    border: 1px solid #eef2f7;
    background: #ffffff;

    border-radius: 14px;

    padding: 14px 16px;

    display: flex;
    align-items: center;
    gap: 12px;

    transition: all 0.2s ease;

    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.nav-item:hover {
    transform: translateY(-2px);

    box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08);

    border-color: #dbeafe;
}

.nav-item.active {
    background: linear-gradient(135deg,
            #171717,
            #2E2E2E);

    border-color: transparent;
}

.nav-icon {
    width: 42px;
    height: 42px;

    border-radius: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 16px;

    flex-shrink: 0;
}

/* COLORS */
.nav-icon.blue {
    background: rgba(37, 99, 235, 0.12);
    color: #2563eb;
}

.nav-icon.red {
    background: rgba(239, 68, 68, 0.12);
    color: #dc2626;
}

.nav-icon.orange {
    background: rgba(249, 115, 22, 0.12);
    color: #ea580c;
}

.nav-icon.yellow {
    background: rgba(234, 179, 8, 0.12);
    color: #ca8a04;
}

.nav-icon.green {
    background: rgba(34, 197, 94, 0.12);
    color: #16a34a;
}

.nav-icon.purple {
    background: rgba(168, 85, 247, 0.12);
    color: #9333ea;
}

.nav-icon.cyan {
    background: rgba(6, 182, 212, 0.12);
    color: #0891b2;
}

.nav-icon.dark {
    background: rgba(51, 65, 85, 0.12);
    color: #334155;
}

.nav-icon.gray {
    background: rgba(107, 114, 128, 0.12);
    color: #4b5563;
}

.nav-item.active .nav-icon {
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
}

.nav-content {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.nav-title {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
}

.nav-subtitle {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
}

.nav-item.active .nav-title,
.nav-item.active .nav-subtitle {
    color: #ffffff;
}
</style>
