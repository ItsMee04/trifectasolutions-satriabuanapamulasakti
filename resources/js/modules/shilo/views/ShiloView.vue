<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Shilo</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Shilo</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <ShiloTable />
            </div>
        </div>

        <ShiloModal />
    </div>
</template>

<script setup>
import ShiloTable from '../components/ShiloTable.vue';
import ShiloModal from '../components/ShiloModal.vue';
</script>
