<template>
    <div class="modal fade" id="modalStoneCrusher" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT STONE CRUSHER' : 'TAMBAH STONE CRUSHER' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Tanggal <span class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.tanggal" type="date" class="form-control"
                                            :class="{ 'is-invalid': errors.tanggal }" readonly>
                                        <div class="invalid-feedback" v-if="errors.tanggal">
                                            {{ Array.isArray(errors.tanggal) ? errors.tanggal[0] : errors.tanggal }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label> Material <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formStoneCrusher.material_id" :options="materialList"
                                            :searchable="true" placeholder="Pilih Material"
                                            noOptionsText="Memuat data..."
                                            :class="{ 'is-invalid': errors.material_id }" />
                                        <div class="invalid-feedback" v-if="errors.material_id">
                                            {{ Array.isArray(errors.material_id) ? errors.material_id[0] :
                                                errors.material_id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>No. Polisi <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formStoneCrusher.kendaraan_id" :options="kendaraanList"
                                            :searchable="true" placeholder="Pilih Kendaraan"
                                            noOptionsText="Memuat data..."
                                            :class="{ 'is-invalid': errors.kendaraan_id }" />
                                        <div class="invalid-feedback" v-if="errors.kendaraan_id">
                                            {{ Array.isArray(errors.kendaraan_id) ? errors.kendaraan_id[0] :
                                                errors.kendaraan_id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Driver <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formStoneCrusher.driver_id" :options="driverList"
                                            :searchable="true" placeholder="Pilih Driver" noOptionsText="Memuat data..."
                                            :class="{ 'is-invalid': errors.driver_id }" />
                                        <div class="invalid-feedback" v-if="errors.driver_id">
                                            {{ Array.isArray(errors.driver_id) ? errors.driver_id[0] : errors.driver_id
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Berat Total <span class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.berattotal" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.berattotal }">
                                        <div class="invalid-feedback" v-if="errors.berattotal">
                                            {{ Array.isArray(errors.berattotal) ? errors.berattotal[0] :
                                                errors.berattotal }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Berat Kendaraan <span class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.beratkendaraan" type="text"
                                            class="form-control" :class="{ 'is-invalid': errors.beratkendaraan }">
                                        <div class="invalid-feedback" v-if="errors.beratkendaraan">
                                            {{ Array.isArray(errors.beratkendaraan) ? errors.beratkendaraan[0] :
                                                errors.beratkendaraan }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Berat Jenis <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formStoneCrusher.beratjenis_id" :options="beratjenisList"
                                            :searchable="true" placeholder="Pilih Berat Jenis"
                                            noOptionsText="Memuat data..."
                                            :class="{ 'is-invalid': errors.beratjenis_id }" />
                                        <div class="invalid-feedback d-block" v-if="errors.beratjenis_id">
                                            {{ Array.isArray(errors.beratjenis_id) ? errors.beratjenis_id[0] :
                                                errors.beratjenis_id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Suplier <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formStoneCrusher.suplier_id" :options="suplierList"
                                            :searchable="true" placeholder="Pilih Suplier"
                                            noOptionsText="Memuat data..."
                                            :class="{ 'is-invalid': errors.suplier_id }" />
                                        <div class="invalid-feedback d-block" v-if="errors.suplier_id">
                                            {{ Array.isArray(errors.suplier_id) ? errors.suplier_id[0] :
                                                errors.suplier_id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>KM Awal <span class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.jarakawal" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.jarakawal }">
                                        <div class="invalid-feedback" v-if="errors.jarakawal">
                                            {{ Array.isArray(errors.jarakawal) ? errors.jarakawal[0] :
                                                errors.jarakawal }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>KM Akhir <span class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.jarakakhir" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.jarakakhir }">
                                        <div class="invalid-feedback" v-if="errors.jarakakhir">
                                            {{ Array.isArray(errors.jarakakhir) ? errors.jarakakhir[0] :
                                                errors.jarakakhir }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Jarak <span
                                                class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.jarak" type="number" step="0.01" class="form-control"
                                            :class="{ 'is-invalid': errors.jarak }" readonly>
                                        <div class="invalid-feedback" v-if="errors.jarak">
                                            {{ Array.isArray(errors.jarak) ? errors.volume[0] : errors.jarak }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Volume ({{ selectedMaterialSatuan }}) <span
                                                class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.volume" type="number" step="0.01" class="form-control"
                                            :class="{ 'is-invalid': errors.volume }"
                                            :readonly="selectedMaterialSatuan === 'm3' || selectedMaterialSatuan === 'kg'">
                                        <div class="invalid-feedback" v-if="errors.volume">
                                            {{ Array.isArray(errors.volume) ? errors.volume[0] : errors.volume }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Berat Muatan <span class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.beratmuatan" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.beratmuatan }" readonly>
                                        <div class="invalid-feedback" v-if="errors.beratmuatan">
                                            {{ Array.isArray(errors.beratmuatan) ? errors.beratmuatan[0] :
                                            errors.beratmuatan }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group local-forms mb-3">
                                        <label>Jenis <span class="login-danger">*</span></label>
                                        <input v-model="formStoneCrusher.jenis" type="text" class="form-control"
                                            :class="{ 'is-invalid': errors.jenis }" readonly="">
                                        <div class="invalid-feedback" v-if="errors.jenis">
                                            {{ Array.isArray(errors.jenis) ? errors.jenis[0] :
                                                errors.jenis }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Stone Crusher' : 'Simpan Stone Crusher')
                            }}
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
import { useTimbanganSC } from '../composables/useTimbanganSC';

const {
    isEdit,
    formStoneCrusher,
    materialList,
    kendaraanList,
    driverList,
    suplierList,
    beratjenisList,
    errors,
    selectedMaterialSatuan,
    fetchMaterial,
    fetchKendaraan,
    fetchDriver,
    fetchSuplier,
    fetchBeratJenis,
    submitStoneCrusher,
    isLoading
} = useTimbanganSC();

const handleSubmit = async () => {
    await submitStoneCrusher();
}

onMounted(() => {
    fetchMaterial();
    fetchKendaraan();
    fetchDriver();
    fetchSuplier();
    fetchBeratJenis();
});
</script>
