<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Pegawai</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Pegawai</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <PegawaiTable />
            </div>
        </div>

        <!-- <RoleModal /> -->
        <PegawaiModal />
    </div>
</template>

<script setup>
import PegawaiTable from '../components/PegawaiTable.vue';
import PegawaiModal from '../components/PegawaiModal.vue';
</script>
