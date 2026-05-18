<template>
    <div class="modal fade" id="modalMenuJenisPlant" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT MENU JENIS PLANT' : 'TAMBAH MENU JENIS PLANT' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Master Plant <span class="login-danger">*</span></label>
                                    <Multiselect v-model="formMenuJenisPlant.masterplant_id" :options="masterplantList"
                                        :searchable="true" placeholder="Pilih Master Plant" noOptionsText="Memuat data..." />
                                    <div class="invalid-feedback" v-if="errors.masterplant_id">
                                        {{ Array.isArray(errors.masterplant_id) ? errors.masterplant_id[0] : errors.masterplant_id }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Jenis Menu Plant <span class="login-danger">*</span></label>
                                    <input v-model="formMenuJenisPlant.jenis" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.jenis }">
                                    <div class="invalid-feedback" v-if="errors.jenis">
                                        {{ Array.isArray(errors.jenis) ? errors.jenis[0] : errors.jenis }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Menu Jenis Plant' : 'Simpan Menu Jenis Plant') }}
                        </button>
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

import { useMenuJenisPlant } from '../composables/useMenuJenisPlant';

// Ambil state dan action dari composable
const { isEdit, formMenuJenisPlant, isLoading, errors, submitMenuJenisPlant, masterplantList,  fetchMasterPlant } = useMenuJenisPlant();

onMounted(() => {
    fetchMasterPlant();
});

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitMenuJenisPlant();
};
</script>
