<template>
    <div class="card card-table">
        <div class="card-body">
            <div class="page-header">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="card-title">Daftar Kendaraan</h5>
                    </div>

                    <div class="col-auto d-flex align-items-center flex-wrap">
                        <div class="top-nav-search me-2 mb-2 mb-sm-0">
                            <div class="input-group" style="max-width: 200px;">
                                <span class="input-group-text bg-transparent border-end-0">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input v-model="searchQuery" type="text" class="form-control border-start-0 ps-0"
                                    placeholder="Cari...">
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-2">
                            <a class="btn btn-primary btn-sm p-2 d-flex align-items-center" @click="handleRefresh"
                                :class="{ 'disabled': isLoading }">
                                <i class="feather-rotate-cw" :class="{ 'fa-spin': isLoading }"></i>
                            </a>

                            <a class="btn btn-primary btn-sm p-2 d-flex align-items-center" @click="handleCreate">
                                <i class="feather-plus"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-nowrap table-hover mb-0">
                    <thead class="bg-light">
                        <tr class="text-center">
                            <th style="width: 5%">#</th>
                            <th style="width: 20%">Kode Kendaraan</th>
                            <th style="width: 20%">Kendaraan</th>
                            <th style="width: 20%">Jenis</th>
                            <th style="width: 20%">Nomor</th>
                            <th style="width: 20%">Status</th>
                            <th style="width: 20%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="7" class="text-center p-5">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="mt-2 mb-0">Memuat data...</p>
                            </td>
                        </tr>

                        <tr v-else-if="!paginatedKendaraan || paginatedKendaraan.length === 0">
                            <td colspan="7" class="text-center p-5">Tidak ada data.</td>
                        </tr>

                        <template v-else>
                            <tr v-for="(item, index) in paginatedKendaraan" :key="item.id" class="text-center">
                                <td>{{ ((currentPage - 1) * 10) + (index + 1) }}</td>
                                <td>{{ item.kode }}</td>
                                <td>{{ item.kendaraan }}</td>
                                <td>{{ item.jeniskendaraan?.jenis }}</td>
                                <td>{{ item.nomor }}</td>
                                <td>
                                    <span v-if="item.status == 1" class="badge bg-success">
                                        ACTIVE
                                    </span>
                                    <span v-else class="badge bg-danger">
                                        INACTIVE
                                    </span>
                                </td>
                                <td>
                                    <div class="actions d-flex justify-content-center">
                                        <a @click="handleEdit(item)" class="btn btn-sm bg-success-light me-2">
                                            <i class="feather-edit"></i>
                                        </a>
                                        <a @click="handleDelete(item)" class="btn btn-sm bg-danger-light">
                                            <i class="feather-trash"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div v-if="filteredKendaraan.length > 0" class="d-flex justify-content-between align-items-center p-3">

                <div class="text-muted small">
                    Showing {{ ((currentPage - 1) * 10) + 1 }}
                    to {{ Math.min(currentPage * 10, filteredKendaraan.length) }}
                    of {{ filteredKendaraan.length }} entries
                </div>

                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = 1">
                            <i class="fas fa-angle-double-left"></i>
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage > 1 && currentPage--">
                            Previous
                        </a>
                    </li>

                    <li v-for="page in displayedPages" :key="page" class="page-item"
                        :class="{ active: currentPage === page }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = page">
                            {{ page }}
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="javascript:void(0);"
                            @click="currentPage < totalPages && currentPage++">
                            Next
                        </a>
                    </li>

                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="javascript:void(0);" @click="currentPage = totalPages">
                            <i class="fas fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useKendaraan } from '../composables/useKendaraan';
// Destructure semua yang dibutuhkan dari composable
const {
    handleCreate,
    handleEdit,
    handleDelete,
    handleRefresh,

    displayedPages,
    filteredKendaraan,
    paginatedKendaraan,
    searchQuery,
    isLoading,
    currentPage,
    totalPages
} = useKendaraan();
</script>
