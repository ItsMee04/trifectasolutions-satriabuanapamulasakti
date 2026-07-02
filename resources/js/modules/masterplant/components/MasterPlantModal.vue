<template>
    <div class="modal fade" id="modalMasterPlant" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT MASTER PLANT' : 'TAMBAH MASTER PLANT' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Kode <span class="login-danger">*</span></label>
                                    <input v-model="formMasterPlant.kode" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kode }">
                                    <div class="invalid-feedback" v-if="errors.kode">
                                        {{ Array.isArray(errors.kode) ? errors.kode[0] : errors.kode }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Nama Plant <span class="login-danger">*</span></label>
                                    <input v-model="formMasterPlant.plant" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.plant }">
                                    <div class="invalid-feedback" v-if="errors.plant">
                                        {{ Array.isArray(errors.plant) ? errors.plant[0] : errors.plant }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Master Plant' : 'Simpan Master Plant') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMasterPlant } from '../composables/useMasterPlant';

// Ambil state dan action dari composable
const { isEdit, formMasterPlant, isLoading, errors, submitMasterPlant } = useMasterPlant();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitMasterPlant();
};
</script>
