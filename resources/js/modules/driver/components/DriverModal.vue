<template>
    <div class="modal fade" id="modalDriver" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT DRIVER' : 'TAMBAH DRIVER' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Nama <span class="login-danger">*</span></label>
                                    <input v-model="formDriver.nama" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.nama }">
                                    <div class="invalid-feedback" v-if="errors.nama">
                                        {{ Array.isArray(errors.nama) ? errors.nama[0] : errors.nama }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Kontak <span class="login-danger">*</span></label>
                                    <input v-model="formDriver.kontak" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kontak }">
                                    <div class="invalid-feedback" v-if="errors.kontak">
                                        {{ Array.isArray(errors.kontak) ? errors.kontak[0] : errors.kontak }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Alamat <span class="login-danger">*</span></label>
                                    <textarea v-model="formDriver.alamat" cols="4" rows="4" class="form-control" :class="{'is-invalid' : errors.alamat}"></textarea>
                                    <div class="invalid-feedback" v-if="errors.alamat">
                                        {{ Array.isArray(errors.alamat) ? errors.alamat[0] : errors.alamat }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Rekening <span class="login-danger">*</span></label>
                                    <input v-model="formDriver.rekening" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.rekening }">
                                    <div class="invalid-feedback" v-if="errors.rekening">
                                        {{ Array.isArray(errors.rekening) ? errors.rekening[0] : errors.rekening }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Driver' : 'Simpan Driver') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useDrivers } from '../composables/useDriver';

// Ambil state dan action dari composable
const { isEdit, formDriver, isLoading, errors, submitDriver } = useDrivers();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitDriver();
};
</script>
