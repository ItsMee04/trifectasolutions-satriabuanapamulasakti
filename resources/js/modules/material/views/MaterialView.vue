<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Material</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Material</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <MaterialTable />
            </div>
        </div>

        <MaterialModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMaterial } from '../composables/useMaterial';
import MaterialTable from '../components/MaterialTable.vue';
import MaterialModal from '../components/MaterialModal.vue';

const { fetchMaterial } = useMaterial();

onMounted(() => {
    fetchMaterial();
});
</script>
