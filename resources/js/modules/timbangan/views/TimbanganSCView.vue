<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman SC (Stone Crusher)</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Timbangan</li>
                            <li class="breadcrumb-item active">SC</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="student-group-form">
            <div class="row">
                <div class="col-lg-2 mb-3">
                    <div class="search-student-btn">
                        <button @click="switchTab('IN')" type="button" class="btn w-100"
                            :class="currentTab === 'IN' ? 'btn-primary' : 'btn-outline-primary'">
                            MATERIAL IN
                        </button>
                    </div>
                </div>
                <div class="col-lg-2">
                    <div class="search-student-btn mb-3">
                        <button @click="switchTab('OUT')" type="button" class="btn w-100"
                            :class="currentTab === 'OUT' ? 'btn-primary' : 'btn-outline-primary'">
                            MATERIAL OUT
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <TimbanganSCTable />
            </div>
        </div>

        <TimbanganSCModal />
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useTimbanganSC } from '../composables/useTimbanganSC';
import TimbanganSCTable from '../components/TimbanganSCTable.vue';
import TimbanganSCModal from '../components/TimbanganSCModal.vue';

const { currentTab, switchTab } = useTimbanganSC();

onMounted(async () => {
    // 1. Jalankan fetch data tabel (default IN)
    await switchTab('IN');
});
</script>
