<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman AMP (Asphalt Mixing Plant)</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Timbangan</li>
                            <li class="breadcrumb-item active">AMP</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="cbp-navigation mb-4">
            <div class="nav-wrapper">

                <!-- MATERIAL IN -->
                <button type="button" class="nav-item" :class="{ active: currentTab === 'IN' }"
                    @click="switchTab('IN')">
                    <div class="nav-icon blue">
                        <i class="feather-download"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">Material In</span>
                        <span class="nav-subtitle">Barang masuk</span>
                    </div>
                </button>

                <!-- MATERIAL OUT -->
                <button type="button" class="nav-item" :class="{ active: currentTab === 'OUT' }"
                    @click="switchTab('OUT')">
                    <div class="nav-icon red">
                        <i class="feather-upload"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">Material Out</span>
                        <span class="nav-subtitle">Barang keluar</span>
                    </div>
                </button>

                <!-- MATERIAL ASPHALT -->
                <button type="button" class="nav-item" :class="{ active: currentTab === 'ASPHALT' }"
                    @click="switchTab('ASPHALT')">
                    <div class="nav-icon orange">
                        <i class="feather-droplet"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">Material Asphalt</span>
                        <span class="nav-subtitle">Bahan aspal</span>
                    </div>
                </button>

                <!-- BAHAN BAKAR -->
                <button type="button" class="nav-item" :class="{ active: currentTab === 'FUEL' }"
                    @click="switchTab('FUEL')">
                    <div class="nav-icon yellow">
                        <i class="feather-droplet"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">Bahan Bakar</span>
                        <span class="nav-subtitle">Fuel operasional</span>
                    </div>
                </button>

                <!-- MATERIAL HOTMIX -->
                <button type="button" class="nav-item" :class="{ active: currentTab === 'HOTMIX' }"
                    @click="switchTab('HOTMIX')">
                    <div class="nav-icon green">
                        <i class="feather-box"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">Material Hotmix</span>
                        <span class="nav-subtitle">Bahan hotmix</span>
                    </div>
                </button>

                <!-- MATERIAL EMULSI -->
                <button type="button" class="nav-item" :class="{ active: currentTab === 'EMULSI' }"
                    @click="switchTab('EMULSI')">
                    <div class="nav-icon purple">
                        <i class="feather-droplet"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">Material Emulsi</span>
                        <span class="nav-subtitle">Bahan emulsi</span>
                    </div>
                </button>

                <!-- MATERIAL OLI -->
                <button type="button" class="nav-item" :class="{ active: currentTab === 'OLI' }"
                    @click="switchTab('OLI')">
                    <div class="nav-icon gray">
                        <i class="feather-droplet"></i>
                    </div>

                    <div class="nav-content">
                        <span class="nav-title">Material Oli</span>
                        <span class="nav-subtitle">Bahan oli</span>
                    </div>
                </button>

            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <TimbanganAMPTable />
            </div>
        </div>

        <TimbanganAMPModal />
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useTimbanganAMP } from '../composables/useTimbanganAMP';
import TimbanganAMPTable from '../components/TimbanganAMPTable.vue';
import TimbanganAMPModal from '../components/TimbanganAMPModal.vue';

const { currentTab, switchTab } = useTimbanganAMP();

onMounted(async () => {
    // 1. Jalankan fetch data tabel (default IN)
    await switchTab('IN');
});
</script>

<style scoped>
.cbp-navigation {
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
