<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Kategori</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Kategori</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <KategoriTable />
            </div>
        </div>

        <KategoriModal />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useKategori } from '../composables/useKategori';
import KategoriTable from '../components/KategoriTable.vue';
import KategoriModal from '../components/KategoriModal.vue';

const { fetchKategori } = useKategori();

onMounted(() => {
    fetchKategori();
});
</script>
