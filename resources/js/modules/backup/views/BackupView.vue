<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Backup</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Setting</li>
                            <li class="breadcrumb-item active">Backup</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <BackupTable />
            </div>
        </div>

        <!-- <BackupModal /> -->
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBackup } from '../composables/useBackup';
import BackupTable from '../components/BackupTable.vue';
// import BackupModal from '../components/BackupModal.vue';

const { fetchBackup } = useBackup();

onMounted(() => {
    fetchBackup();
});
</script>
