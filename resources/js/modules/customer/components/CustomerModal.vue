<template>
    <div class="modal fade" id="modalCustomer" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT CUSTOMER' : 'TAMBAH CUSTOMER' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Nama <span class="login-danger">*</span></label>
                                    <input v-model="formCustomer.nama" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.nama }">
                                    <div class="invalid-feedback" v-if="errors.nama">
                                        {{ Array.isArray(errors.nama) ? errors.nama[0] : errors.nama }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Email</label>
                                    <input v-model="formCustomer.email" type="email" class="form-control"
                                        :class="{ 'is-invalid': errors.email }">
                                    <div class="invalid-feedback" v-if="errors.email">
                                        {{ Array.isArray(errors.email) ? errors.email[0] : errors.email }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Kontak</label>
                                    <input v-model="formCustomer.kontak" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kontak }">
                                    <div class="invalid-feedback" v-if="errors.kontak">
                                        {{ Array.isArray(errors.kontak) ? errors.kontak[0] : errors.kontak }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Alamat</label>
                                    <textarea v-model="formCustomer.alamat" cols="4" rows="4" class="form-control" :class="{'is-invalid' : errors.alamat}"></textarea>
                                    <div class="invalid-feedback" v-if="errors.alamat">
                                        {{ Array.isArray(errors.alamat) ? errors.alamat[0] : errors.alamat }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group mb-3">
                                    <label class="form-label d-block">Pilih Masterplant <span class="login-danger">*</span></label>
                                    <div :class="{ 'is-invalid': errors.masterplant_ids }">
                                        <div v-for="plant in masterplants" :key="plant.id" class="form-check form-check-inline mb-2">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :id="'plant-' + plant.id"
                                                :value="plant.id"
                                                v-model="formCustomer.masterplant_ids"
                                            >
                                            <label class="form-check-label" :for="'plant-' + plant.id">
                                                {{ plant.plant }}
                                            </label>
                                        </div>
                                    </div>
                                    <div class="invalid-feedback" v-if="errors.masterplant_ids">
                                        {{ Array.isArray(errors.masterplant_ids) ? errors.masterplant_ids[0] : errors.masterplant_ids }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Customer' : 'Simpan Customer') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCustomer } from '../composables/useCustomer';

// Ambil state dan action dari composable
const { isEdit, formCustomer, isLoading, errors, fetchMasterPlant, masterplants, submitCustomer } = useCustomer();

const handleSubmit = async () => {
    // submitRole akan mengembalikan true jika berhasil
    await submitCustomer();
};

onMounted(() => {
    fetchMasterPlant();
});
</script>
