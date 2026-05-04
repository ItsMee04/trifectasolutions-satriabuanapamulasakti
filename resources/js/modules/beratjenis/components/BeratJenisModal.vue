<template>
    <div class="modal fade" id="modalBeratJenis" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT BERAT JENIS' : 'TAMBAH BERAT JENIS' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Berat Jenis <span class="login-danger">*</span></label>
                                    <input v-model="formBeratJenis.beratjenis" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.beratjenis }">
                                    <div class="invalid-feedback" v-if="errors.beratjenis">
                                        {{ Array.isArray(errors.beratjenis) ? errors.beratjenis[0] : errors.beratjenis }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Berat Jenis' : 'Simpan Berat Jenis') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useBeratJenis } from '../composables/useBeratJenis';

// Ambil state dan action dari composable
const { isEdit, formBeratJenis, isLoading, errors, submitBeratJenis } = useBeratJenis();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitBeratJenis();
};
</script>
