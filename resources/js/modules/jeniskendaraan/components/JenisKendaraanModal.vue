<template>
    <div class="modal fade" id="modalJenisKendaraan" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT JENIS KENDARAAN' : 'TAMBAH JENIS KENDARAAN' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Jenis <span class="login-danger">*</span></label>
                                    <input v-model="formJenisKendaraan.jenis" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.jenis }">
                                    <div class="invalid-feedback" v-if="errors.jenis">
                                        {{ Array.isArray(errors.jenis) ? errors.jenis[0] : errors.jenis }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Index Per KM <span class="login-danger">*</span></label>
                                    <input v-model="formJenisKendaraan.indexperkm" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.indexperkm }">
                                    <div class="invalid-feedback" v-if="errors.indexperkm">
                                        {{ Array.isArray(errors.indexperkm) ? errors.indexperkm[0] : errors.indexperkm }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Jenis Kendaran' : 'Simpan Jenis Kendaran') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useJenisKendaraan } from '../composables/useJenisKendaraan';

// Ambil state dan action dari composable
const { isEdit, formJenisKendaraan, isLoading, errors, submitJenisKendaraan } = useJenisKendaraan();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitJenisKendaraan();
};
</script>
