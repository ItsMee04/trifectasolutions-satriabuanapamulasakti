<template>
    <div class="modal fade" id="modalMaterial" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT MATERIAL' : 'TAMBAH MATERIAL' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Material <span class="login-danger">*</span></label>
                                    <input v-model="formMaterial.material" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.material }">
                                    <div class="invalid-feedback" v-if="errors.material">
                                        {{ Array.isArray(errors.material) ? errors.material[0] : errors.material }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Kategori <span class="login-danger">*</span></label>
                                    <Multiselect v-model="formMaterial.kategori_id" :options="kategori"
                                        :searchable="true" placeholder="Pilih Kategori"
                                        noOptionsText="Memuat data..." />
                                    <div class="invalid-feedback" v-if="errors.material_id">
                                        {{ Array.isArray(errors.kategori_id) ? errors.kategori_id[0] :
                                            errors.kategori_id }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Satuan <span class="login-danger">*</span></label>
                                    <Multiselect v-model="formMaterial.satuan" :options="satuanList"
                                        :searchable="true" placeholder="Pilih Satuan"
                                        noOptionsText="Memuat data..." />
                                    <div class="invalid-feedback" v-if="errors.satuan">
                                        {{ Array.isArray(errors.satuan) ? errors.satuan[0] :
                                            errors.satuan }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Material' : 'Simpan Material') }}
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
import { useMaterial } from '../composables/useMaterial';

const { isEdit, formMaterial, kategori, satuanList, errors, fetchKategori, submitMaterial, isLoading } = useMaterial();

const handleSubmit = async () => {
    await submitMaterial();
}

onMounted(() => {
    fetchKategori();
});
</script>
