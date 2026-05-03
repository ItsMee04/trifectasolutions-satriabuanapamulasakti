<template>
    <div class="modal fade" id="modalPegawai" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-primary">
                        {{ isEdit ? 'EDIT PEGAWAI' : 'TAMBAH PEGAWAI' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body p-4">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Nama <span class="login-danger">*</span></label>
                                    <input v-model="formPegawai.nama" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.nama }">
                                    <div class="invalid-feedback" v-if="errors.nama">
                                        {{ Array.isArray(errors.nama) ? errors.nama[0] : errors.nama }}
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Kontak <span class="login-danger">*</span></label>
                                    <input v-model="formPegawai.kontak" type="text" class="form-control"
                                        :class="{ 'is-invalid': errors.kontak }">
                                    <div class="invalid-feedback" v-if="errors.kontak">
                                        {{ Array.isArray(errors.kontak) ? errors.kontak[0] : errors.kontak }}
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Alamat <span class="login-danger">*</span></label>
                                    <textarea v-model="formPegawai.alamat" rows="4" class="form-control"
                                        :class="{ 'is-invalid': errors.alamat }"></textarea>
                                    <div class="invalid-feedback" v-if="errors.alamat">
                                        {{ Array.isArray(errors.alamat) ? errors.alamat[0] : errors.alamat }}
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group local-forms mb-3">
                                    <label>Image</label>
                                    <input type="file" class="form-control" id="imageInput" @change="handleFileChange"
                                        accept="image/jpeg,image/png">
                                    <div class="invalid-feedback" v-if="errors.image">{{ errors.image[0] }}</div>
                                </div>

                                <div v-if="imagePreview" class="mt-2">
                                    <label class="d-block mb-2">Preview:</label>
                                    <img :src="imagePreview" alt="Preview" class="img-thumbnail"
                                        style="max-height: 150px;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Memuat data...' : (isEdit ? 'Update Pegawai' : 'Simpan Pegawai') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { usePegawai } from '../composables/usePegawai';

const { isEdit, formPegawai, isLoading, errors, resetForm, getImageUrl, submitPegawai } = usePegawai();

// State lokal untuk menampung URL preview
const imagePreview = ref(null);

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        formPegawai.image = file; // Simpan file fisik untuk diupload

        // Ganti preview ke file lokal yang baru dipilih
        if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview.value); // Bersihkan memori blob lama jika ada
        }
        imagePreview.value = URL.createObjectURL(file);
    }
};

// Pantau perubahan ID untuk mengisi preview saat EDIT
watch(() => formPegawai.id, (newId) => {
    // Jika ada ID dan isEdit aktif
    if (newId && isEdit.value) {
        // Jika image berupa string (dari database), buatkan URL lengkapnya
        if (typeof formPegawai.image === 'string' && formPegawai.image !== '') {
            imagePreview.value = getImageUrl(formPegawai.image);
        } else {
            imagePreview.value = null;
        }
    } else if (!newId) {
        // Jika tambah baru (ID kosong), pastikan preview bersih
        imagePreview.value = null;
    }
}, { immediate: true });

const handleSubmit = async () => {
    const success = await submitPegawai();
    if (success) {
        imagePreview.value = null;
    }
};

onMounted(() => {
    const modalElement = document.getElementById('modalPegawai');

    modalElement.addEventListener('hidden.bs.modal', () => {
        // 1. Reset data di Composable [cite: 2025-10-25]
        resetForm();

        // 2. Reset preview (Cukup ubah statenya, Vue akan hapus elemennya dari DOM)
        imagePreview.value = null;

        // 3. Reset input file (ini tetap harus manual DOM)
        const inputFile = document.getElementById('imageInput');
        if (inputFile) inputFile.value = '';
    });
});
</script>
