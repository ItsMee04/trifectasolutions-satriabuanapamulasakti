<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Master Plant</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Master Plant</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <MasterPlantTable />
            </div>
        </div>

        <MasterPlantModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMasterPlant } from '../composables/useMasterPlant';
import MasterPlantTable from '../components/MasterPlantTable.vue';
import MasterPlantModal from '../components/MasterPlantModal.vue';

const { fetchMasterPlant } = useMasterPlant();

onMounted(() => {
    fetchMasterPlant();
});
</script>
