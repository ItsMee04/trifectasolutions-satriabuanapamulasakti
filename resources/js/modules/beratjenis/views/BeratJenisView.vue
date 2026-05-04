<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Berat Jenis</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Berat Jenis</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <BeratJenisTable />
            </div>
        </div>

        <BeratJenisModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBeratJenis } from '../composables/useBeratJenis';
import BeratJenisTable from '../components/BeratJenisTable.vue';
import BeratJenisModal from '../components/BeratJenisModal.vue';

const { fetchBeratJenis } = useBeratJenis();

onMounted(() => {
    fetchBeratJenis();
});
</script>
