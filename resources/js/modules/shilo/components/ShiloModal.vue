<template>
    <div class="modal fade" id="modalShilo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT SHILO' : 'TAMBAH SHILO' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Shilo <span class="login-danger">*</span></label>
                                    <input v-model="formShilo.shilo" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.shilo }">
                                    <div class="invalid-feedback" v-if="errors.shilo">
                                        {{ Array.isArray(errors.shilo) ? errors.shilo[0] : errors.shilo }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Shilo' : 'Simpan Shilo') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useShilo } from '../composables/useShilo';

// Ambil state dan action dari composable
const { isEdit, formShilo, isLoading, errors, submitShilo } = useShilo();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitShilo();
};
</script>
