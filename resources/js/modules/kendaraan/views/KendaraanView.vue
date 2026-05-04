<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Kendaraan</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Kendaraan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <KendaraanTable />
            </div>
        </div>

        <KendaraanModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useKendaraan } from '../composables/useKendaraan';
import KendaraanTable from '../components/KendaraanTable.vue';
import KendaraanModal from '../components/KendaraanModal.vue';

const { fetchKendaraan } = useKendaraan();

onMounted(() => {
    fetchKendaraan();
});
</script>
