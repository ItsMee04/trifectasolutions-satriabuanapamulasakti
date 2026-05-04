<template>
    <div class="modal fade" id="modalKendaraan" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT KENDARAAN' : 'TAMBAH KENDARAAN' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Kode <span class="login-danger">*</span></label>
                                    <input v-model="formKendaraan.kode" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kode }">
                                    <div class="invalid-feedback" v-if="errors.kode">
                                        {{ Array.isArray(errors.kode) ? errors.kode[0] : errors.kode }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Kendaraan <span class="login-danger">*</span></label>
                                    <input v-model="formKendaraan.kendaraan" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kendaraan }">
                                    <div class="invalid-feedback" v-if="errors.kendaraan">
                                        {{ Array.isArray(errors.kendaraan) ? errors.kendaraan[0] : errors.kendaraan }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Jenis <span class="login-danger">*</span></label>
                                    <Multiselect v-model="formKendaraan.jenis" :options="jeniskendaranList"
                                        :searchable="true" placeholder="Pilih Jenis" noOptionsText="Memuat data..." />
                                    <div class="invalid-feedback" v-if="errors.jenis">
                                        {{ Array.isArray(errors.jenis) ? errors.jenis[0] : errors.jenis }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-4">
                                    <label>Nomor <span class="login-danger">*</span></label>
                                    <input v-model="formKendaraan.nomor" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.nomor }">
                                    <div class="invalid-feedback" v-if="errors.nomor">
                                        {{ Array.isArray(errors.nomor) ? errors.nomor[0] : errors.nomor }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Kendaraan' : 'Simpan Kendaraan') }}
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
import { useKendaraan } from '../composables/useKendaraan';

// Ambil state dan action dari composable
const { isEdit, formKendaraan, fetchJenisKendaraan, jeniskendaranList, isLoading, errors, submitKendaraan } = useKendaraan();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitKendaraan();
};

onMounted(() => {
    fetchJenisKendaraan();
});
</script>
