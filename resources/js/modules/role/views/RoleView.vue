<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Role</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Role</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <RoleTable />
            </div>
        </div>

        <RoleModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRole } from '../composables/useRole';
import RoleTable from '../components/RoleTable.vue';
import RoleModal from '../components/RoleModal.vue';

const { fetchRoles } = useRole();

onMounted(() => {
    fetchRoles();
});
</script>
