<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Suplier</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Suplier</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <SuplierTable />
            </div>
        </div>

        <SuplierModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSuplier } from '../composables/useSuplier';
import SuplierTable from '../components/SuplierTable.vue';
import SuplierModal from '../components/SuplierModal.vue';

const { fetchSuplier } = useSuplier();

onMounted(() => {
    fetchSuplier();
});
</script>
