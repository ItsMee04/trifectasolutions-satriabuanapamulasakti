<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Users</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Users</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <UserTable />
            </div>
        </div>

        <UserModal />
        <UserPermission />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUser } from '../composables/useUser';
import UserTable from '../components/UserTable.vue';
import UserModal from '../components/UserModal.vue';
import UserPermission from '../components/UserPermission.vue';

const { fetchUsers } = useUser();

onMounted(() => {
    fetchUsers();
});
</script>
