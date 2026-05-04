<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Driver</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Driver</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <DriverTable />
            </div>
        </div>

        <DriverModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDrivers } from '../composables/useDriver';
import DriverTable from '../components/DriverTable.vue';
import DriverModal from '../components/DriverModal.vue';

const { fetchDriver } = useDrivers();

onMounted(() => {
    fetchDriver();
});
</script>
