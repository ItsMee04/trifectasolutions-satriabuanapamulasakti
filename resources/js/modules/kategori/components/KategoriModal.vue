<template>
    <div class="modal fade" id="modalKategori" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT KATEGORI' : 'TAMBAH KATEGORI' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Kategori <span class="login-danger">*</span></label>
                                    <input v-model="formKategori.kategori" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kategori }">
                                    <div class="invalid-feedback" v-if="errors.kategori">
                                        {{ Array.isArray(errors.kategori) ? errors.kategori[0] : errors.kategori }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Kategori' : 'Simpan Kategori') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useKategori } from '../composables/useKategori';

// Ambil state dan action dari composable
const { isEdit, formKategori, isLoading, errors, submitKategori } = useKategori();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitKategori();
};
</script>
