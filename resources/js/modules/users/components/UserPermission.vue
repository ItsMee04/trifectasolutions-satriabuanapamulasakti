<template>
    <div class="modal fade" id="modalPermission" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalPermissionLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <b>
                        <h5 class="modal-title text-primary">
                            HAK AKSES USER: {{ selectedUser?.pegawai?.nama || 'N/A' }}
                        </h5>
                    </b>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <form @submit.prevent="handleSubmitPermission">
                    <div class="modal-body p-4" style="max-height: 70vh; overflow-y: auto;">

                        <!-- State: Memuat Data (Hanya muncul saat request pertama) -->
                        <div v-if="isLoading && masterPermissions.length === 0" class="text-center p-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2 text-muted">Memuat daftar hak akses...</p>
                        </div>

                        <!-- State: Data Kosong -->
                        <div v-else-if="masterPermissions.length === 0" class="text-center p-5 text-muted">
                            <i class="fas fa-exclamation-circle fa-2x mb-3"></i>
                            <p>Data permission tidak ditemukan.</p>
                        </div>

                        <!-- State: Data Tersedia -->
                        <div v-else class="row">
                            <div v-for="mod in masterPermissions" :key="mod.id" class="col-md-12 mb-3">
                                <div class="card border border-light-subtle shadow-sm">
                                    <!-- Header Module (Parent) -->
                                    <div
                                        class="card-header bg-light d-flex justify-content-between align-items-center py-2">
                                        <div class="form-check mb-0">
                                            <input class="form-check-input" type="checkbox" :id="'mod-' + mod.id"
                                                :checked="isModuleFull(mod)" @change="toggleModule(mod)">
                                            <label class="form-check-label fw-bold text-dark" :for="'mod-' + mod.id">
                                                {{ mod.label }}
                                            </label>
                                        </div>
                                        <span class="badge bg-primary-subtle text-primary rounded-pill">
                                            {{ mod.permissions?.length || 0 }} Akses
                                        </span>
                                    </div>

                                    <!-- Body Permissions (Child) -->
                                    <div class="card-body py-3">
                                        <div class="row">
                                            <div v-for="perm in mod.permissions" :key="perm.id" class="col-md-4 mb-2">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" type="checkbox"
                                                        :id="'perm-' + perm.id" :value="Number(perm.id)"
                                                        v-model="userPermissions">
                                                    <label class="form-check-label small text-secondary"
                                                        :for="'perm-' + perm.id">
                                                        {{ formatPermissionName(perm.nama_permission) }}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            <i class="fas fa-save me-1"></i>
                            {{ isLoading ? 'Memproses...' : 'Simpan Hak Akses' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useUser } from '../composables/useUser';

const {
    selectedUser,
    masterPermissions,
    userPermissions,
    submitPermissions,
    isLoading
} = useUser();

/**
 * Format string agar lebih rapi (e.g., menu-user-create -> CREATE)
 */
const formatPermissionName = (name) => {
    if (!name) return '';
    // Menghapus prefix 'menu-' dan mengambil kata terakhir atau merapikan semuanya
    return name.replace('menu-', '').replace(/-/g, ' ').toUpperCase();
};

/**
 * Logika "Select All" per Module
 */
const isModuleFull = (mod) => {
    if (!mod.permissions || mod.permissions.length === 0) return false;
    return mod.permissions.every(p => userPermissions.value.includes(p.id));
};

const toggleModule = (mod) => {
    const permIds = mod.permissions.map(p => Number(p.id));
    if (isModuleFull(mod)) {
        // Uncheck all dalam satu module
        userPermissions.value = userPermissions.value.filter(id => !permIds.includes(id));
    } else {
        // Check all yang belum ada
        permIds.forEach(id => {
            if (!userPermissions.value.includes(id)) {
                userPermissions.value.push(id);
            }
        });
    }
};

const handleSubmitPermission = async () => {
    await submitPermissions();
};
</script>

<style scoped>
/* Menghilangkan outline biru saat card diklik untuk estetika */
.card {
    transition: transform 0.2s ease-in-out;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}
</style>
