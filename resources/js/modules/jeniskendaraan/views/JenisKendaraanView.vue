<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Jenis Kendaraan</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Jenis Kendaraan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <JenisKendaraanTable />
            </div>
        </div>

        <JenisKendaraanModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useJenisKendaraan } from '../composables/useJenisKendaraan';
import JenisKendaraanTable from '../components/JenisKendaraanTable.vue';
import JenisKendaraanModal from '../components/JenisKendaraanModal.vue';

const { fetchJenisKendaraan } = useJenisKendaraan();

onMounted(() => {
    fetchJenisKendaraan();
});
</script>
