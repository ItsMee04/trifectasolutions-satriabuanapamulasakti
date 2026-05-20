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
                    :class="{ active: currentTab === menu.id }" @click="switchTab(menu)">
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
                <!-- <TimbanganCBPTable /> -->
            </div>
        </div>

        <!-- <TimbanganCBPModal /> -->
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useTimbanganCBP } from '../composables/useTimbanganCBP';
// import TimbanganCBPTable from '../components/TimbanganCBPTable.vue';
// import TimbanganCBPModal from '../components/TimbanganCBPModal.vue';

const {
    currentTab,
    isLoading,
    MenuTimbanganCBPList,
    fetchMenuTimbanganCBPList,
    fetchConcreteBatchingPlant,
    switchTab,
    currentTabName
} = useTimbanganCBP();

onMounted(async () => {
    // 1. Ambil daftar menu navigasi (misal: IN, OUT, dll)
    await fetchMenuTimbanganCBPList();

    // 2. WAJIB: Ambil data tabel pertama kali berdasarkan tab yang otomatis terpilih
    if (currentTab.value) {
        await fetchConcreteBatchingPlant(currentTab.value);
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
