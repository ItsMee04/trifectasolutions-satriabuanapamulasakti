<template>
    <div class="modal fade" id="modalMaterialCBP" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalEditLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT MATERIAL CBP' : 'TAMBAH MATERIAL CBP' }} || {{ currentTabName }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group mb-3">
                                        <label>Tanggal <span class="login-danger">*</span></label>
                                        <input v-model="formMaterialCBP.tanggal" type="date" class="form-control"
                                            :class="{ 'is-invalid': errors.tanggal }" readonly>
                                        <div class="invalid-feedback" v-if="errors.tanggal">
                                            {{ Array.isArray(errors.tanggal) ? errors.tanggal[0] : errors.tanggal }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group mb-3">
                                        <label> Material <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formMaterialCBP.material_id" :options="MaterialList"
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
                                    <div class="form-group mb-3">
                                        <label>No. Polisi <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formMaterialCBP.kendaraan_id" :options="KendaraanList"
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
                                    <div class="form-group mb-3">
                                        <label>Driver <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formMaterialCBP.driver_id" :options="DriverList"
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
                                    <div class="form-group mb-3">
                                        <label>Berat Total <span class="login-danger">*</span></label>
                                        <input v-model="formMaterialCBP.berattotal" type="text" class="form-control"
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
                                    <div class="form-group mb-3">
                                        <label>Berat Kendaraan <span class="login-danger">*</span></label>
                                        <input v-model="formMaterialCBP.beratkendaraan" type="text"
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
                                    <div class="form-group mb-3">
                                        <label>Berat Jenis <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formMaterialCBP.beratjenis_id" :options="BeratJenisList"
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
                            <div class="col-md-6" v-if="isMaterialOut">
                                <div class="mb-4">
                                    <div class="form-group mb-3">
                                        <label>Customer <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formMaterialCBP.customer_id" :options="CustomerList"
                                            :searchable="true" placeholder="Pilih Customer"
                                            noOptionsText="Memuat data..."
                                            :class="{ 'is-invalid': errors.customer_id }" />
                                        <div class="invalid-feedback d-block" v-if="errors.customer_id">
                                            {{ Array.isArray(errors.customer_id) ? errors.customer_id[0] :
                                                errors.customer_id }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6" v-if="isMaterialIn">
                                <div class="mb-4">
                                    <div class="form-group mb-3">
                                        <label>Suplier <span class="login-danger">*</span></label>
                                        <Multiselect v-model="formMaterialCBP.suplier_id" :options="SuplierList"
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
                        <div class="col-md-12" v-if="isMaterialOut">
                            <div class="mb-4">
                                <div class="form-group mb-3">
                                    <label>Tujuan <span class="login-danger">*</span></label>
                                    <input v-model="formMaterialCBP.tujuan" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.tujuan }">
                                    <div class="invalid-feedback" v-if="errors.tujuan">
                                        {{ Array.isArray(errors.tujuan) ? errors.tujuan[0] :
                                            errors.tujuan }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group mb-3">
                                        <label>KM Awal <span class="login-danger">*</span></label>
                                        <input v-model="formMaterialCBP.jarakawal" type="text" class="form-control"
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
                                    <div class="form-group mb-3">
                                        <label>KM Akhir <span class="login-danger">*</span></label>
                                        <input v-model="formMaterialCBP.jarakakhir" type="text" class="form-control"
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
                                    <div class="form-group mb-3">
                                        <label>Jarak <span class="login-danger">*</span></label>
                                        <input v-model="formMaterialCBP.jarak" type="number" step="0.01"
                                            class="form-control" :class="{ 'is-invalid': errors.jarak }" readonly>
                                        <div class="invalid-feedback" v-if="errors.jarak">
                                            {{ Array.isArray(errors.jarak) ? errors.volume[0] : errors.jarak }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-4">
                                    <div class="form-group mb-3">
                                        <label>Volume ({{ selectedMaterialSatuan }}) <span
                                                class="login-danger">*</span></label>
                                        <input v-model="formMaterialCBP.volume" type="number" step="0.01"
                                            class="form-control" :class="{ 'is-invalid': errors.volume }"
                                            :readonly="selectedMaterialSatuan === 'm3' || selectedMaterialSatuan === 'kg'">
                                        <div class="invalid-feedback" v-if="errors.volume">
                                            {{ Array.isArray(errors.volume) ? errors.volume[0] : errors.volume }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-4">
                                <div class="form-group mb-3">
                                    <label>Berat Muatan <span class="login-danger">*</span></label>
                                    <input v-model="formMaterialCBP.beratmuatan" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.beratmuatan }" readonly>
                                    <div class="invalid-feedback" v-if="errors.beratmuatan">
                                        {{ Array.isArray(errors.beratmuatan) ? errors.beratmuatan[0] :
                                            errors.beratmuatan }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Material CBP' : 'Simpan Material CBP')
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';

// Composables
import { useNavigationCBP } from '@/modules/timbangan/concretebatchingplant/composables/useNavigasiCBP';
import { useTimbanganMaterialCBP } from '@/modules/timbangan/concretebatchingplant/material/composables/useTimbanganMaterialCBP';

const {
    currentTab,
    currentTabName,
} = useNavigationCBP();

const {
    isEdit,
    formMaterialCBP,
    MaterialList,
    KendaraanList,
    DriverList,
    CustomerList,
    SuplierList,
    BeratJenisList,
    errors,
    selectedMaterialSatuan,
    fetchMaterial,
    fetchKendaraan,
    fetchDriver,
    fetchCustomer,
    fetchSuplier,
    fetchBeratJenis,
    submitMaterialCBP,
    isLoading,
} = useTimbanganMaterialCBP();

const isMaterialIn = computed(() => {
    return Number(currentTab.value) === 3;
});

const isMaterialOut = computed(() => {
    return Number(currentTab.value) === 4;
});

const handleSubmit = async () => {
    await submitMaterialCBP();
}

onMounted(() => {
    fetchMaterial();
    fetchKendaraan();
    fetchDriver();
    fetchCustomer();
    fetchSuplier();
    fetchBeratJenis();
});
</script>
