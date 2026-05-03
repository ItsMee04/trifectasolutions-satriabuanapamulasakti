<template>
    <div class="modal fade" id="modalUsers" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <b>
                        <h5 class="modal-title text-primary">EDIT USERS</h5>
                    </b>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Pegawai <span class="login-danger">*</span></label>
                                        <input type="text" class="form-control" v-model="formUsers.nama" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Email <span class="login-danger">*</span></label>
                                        <input type="email" class="form-control" v-model="formUsers.email" required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Password <span class="login-danger">*</span></label>
                                        <input type="password" class="form-control" v-model="formUsers.password">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Role <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formUsers.role_id" :options="roles" :searchable="true"
                                            placeholder="Pilih Role" noOptionsText="Memuat data..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : 'Simpan Users' }} </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { useUser } from '../composables/useUser';

const { formUsers, roles, fetchRoles, submitUsers, isLoading } = useUser();

const handleSubmit = async () => {
    await submitUsers();
}

onMounted(() => {
    fetchRoles();
});
</script>
