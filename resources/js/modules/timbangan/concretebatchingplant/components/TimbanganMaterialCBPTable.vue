<template>
    <div class="card card-table">
        <div class="card-body">
            <div class="page-header">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="card-title">Daftar Concrete Batching Plant / <span class="text-danger">{{
                                currentTabName
                                }}</span></h5>
                    </div>

                    <div class="col-auto d-flex align-items-center flex-wrap gap-2">
                        <div class="d-flex align-items-center gap-1">
                            <div class="input-group input-group-sm shadow-sm" style="width: 320px;">
                                <span class="input-group-text bg-white border-end-0">
                                    <i class="fas fa-calendar-alt text-muted small"></i>
                                </span>

                                <input v-model="startDate" type="date"
                                    class="form-control border-start-0 border-end-0 ps-0" title="Tanggal Mulai">

                                <span
                                    class="input-group-text bg-white border-start-0 border-end-0 px-1 text-muted">-</span>

                                <input v-model="endDate" type="date" class="form-control border-start-0 ps-0"
                                    title="Tanggal Selesai">
                            </div>

                            <button v-if="startDate || endDate" @click="resetDateFilter"
                                class="btn btn-light btn-sm border shadow-sm">
                                <i class="fas fa-times text-danger"></i>
                            </button>
                        </div>

                        <div class="top-nav-search">
                            <div class="input-group">
                                <span class="input-group-text bg-transparent border-end-0 py-1">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input v-model="searchQuery" type="text"
                                    class="form-control form-control-sm border-start-0 ps-0" placeholder="Cari..."
                                    style="max-width: 150px;">
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-primary btn-sm p-2 d-flex align-items-center shadow-sm"
                                @click="handleRefresh" :class="{ 'disabled': isLoading }">
                                <i class="feather-rotate-cw" :class="{ 'fa-spin': isLoading }"></i>
                            </button>

                            <button class="btn btn-primary btn-sm p-2 d-flex align-items-center shadow-sm"
                                @click="handleCreate(currentTab)">
                                <i class="feather-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-nowrap table-hover mb-0">
                    <thead class="bg-light">
                        <tr class="text-center">
                            <th style="width: 5%">#</th>
                            <th>Material</th>
                            <th>Tanggal</th>
                            <th>Kode</th>
                            <th>No. Polisi</th>
                            <th>Driver</th>
                            <th>
                                {{ isMaterialIn ? 'Suplier' : 'Customer' }}
                            </th>
                            <th>Volume</th>
                            <th>Berat Total</th>
                            <th>Berat Kendaraan</th>
                            <th>Berat Muatan</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        <tr class="text-center bg-white">
                            <td></td>
                            <td><input v-model="columnFilters.material" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.tanggal" type="date" class="form-control form-control-sm">
                            </td>
                            <td><input v-model="columnFilters.nomor" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.kendaraan" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.driver" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.customer" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.suplier" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.volume" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.berattotal" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.beratkendaraan" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td><input v-model="columnFilters.beratmuatan" class="form-control form-control-sm"
                                    placeholder="Filter..."></td>
                            <td></td>
                            <td>
                                <button @click="resetColumnFilters" class="btn btn-outline-danger btn-sm"
                                    title="Reset Filter">
                                    <i class="fas fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading">
                            <td colspan="13" class="text-center p-5">
                                <div class="spinner-border text-primary" users="status"></div>
                                <p class="mt-2 mb-0">Memuat data...</p>
                            </td>
                        </tr>

                        <tr v-else-if="!paginatedConcreteBatchingPlant || paginatedConcreteBatchingPlant.length === 0">
                            <td colspan="13" class="text-center p-5">Tidak ada data.</td>
                        </tr>

                        <template v-else>
                            <tr v-for="(item, index) in paginatedConcreteBatchingPlant" :key="item.id"
                                class="text-center">
                                <td>{{ ((currentPage - 1) * 10) + (index + 1) }}</td>

                                <!-- Perbaikan: Ubah timbandandetail menjadi timbangaonmaterial -->
                                <td>{{ item.timbanganmaterialcbp?.[0]?.material?.material }}</td>

                                <td>{{ item.tanggal }}</td>

                                <td>{{ item.nomor }}</td>

                                <td>{{ item.timbanganmaterialcbp?.[0]?.kendaraan?.nomor }}</td>

                                <td>{{ item.timbanganmaterialcbp?.[0]?.driver?.nama }}</td>

                                <td v-if="isMaterialIn">
                                    {{ item.timbanganmaterialcbp?.[0]?.suplier?.nama }}
                                </td>

                                <td v-if="isMaterialOut">
                                    {{ item.timbanganmaterialcbp?.[0]?.customer?.nama }}
                                </td>

                                <td>{{ item.timbanganmaterialcbp?.[0]?.volume }}</td>

                                <td>{{ formatNumber(item.timbanganmaterialcbp?.[0]?.berattotal) }}</td>

                                <td>{{ formatNumber(item.timbanganmaterialcbp?.[0]?.beratkendaraan) }}</td>

                                <td>{{ formatNumber(item.timbanganmaterialcbp?.[0]?.beratmuatan) }}</td>

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

                    <tfoot v-if="!isLoading && paginatedConcreteBatchingPlant.length > 0">
                        <tr class="text-center fw-bold bg-light">
                            <td colspan="8" class="text-end">TOTAL</td>
                            <td>{{ formatNumber(totalFooter.volumeTotal, 2) }}</td>
                            <td>{{ formatNumber(totalFooter.beratTotal) }}</td>
                            <td>{{ formatNumber(totalFooter.beratKendaraan) }}</td>
                            <td>{{ formatNumber(totalFooter.beratMuatan) }}</td>
                            <td colspan="2"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div v-if="filteredConcreteBatchingPlant.length > 0"
                class="d-flex justify-content-between align-items-center p-3">

                <div class="text-muted small">
                    Showing {{ ((currentPage - 1) * 10) + 1 }}
                    to {{ Math.min(currentPage * 10, filteredConcreteBatchingPlant.length) }}
                    of {{ filteredConcreteBatchingPlant.length }} entries
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
import { computed } from 'vue';
import { useTimbanganCBP } from '../composables/useTimbanganCBP';
// Destructure semua yang dibutuhkan dari composable
const {
    handleCreate,
    handleEdit,
    handleDelete,
    handleRefresh,
    formatNumber,
    resetColumnFilters,
    resetDateFilter,

    columnFilters,
    displayedPages,
    startDate,
    endDate,
    totalFooter,
    currentTabName,
    filteredConcreteBatchingPlant,
    paginatedConcreteBatchingPlant,
    searchQuery,
    isLoading,
    currentPage,
    totalPages,
} = useTimbanganCBP();

const isMaterialIn = computed(() => {
    return currentTabName.value?.toLowerCase() === 'material in';
});

const isMaterialOut = computed(() => {
    return currentTabName.value?.toLowerCase() === 'material out';
});
</script>
