<template>
    <div class="content container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-12">
                    <div class="page-sub-header">
                        <h3 class="page-title">Halaman Customer</h3>
                        <ul class="breadcrumb">
                            <li class="breadcrumb-item">Master</li>
                            <li class="breadcrumb-item active">Customer</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <CustomerTable />
            </div>
        </div>

        <CustomerModal />
    </div>
</template>

<script setup>
import CustomerTable from '../components/CustomerTable.vue';
import CustomerModal from '../components/CustomerModal.vue';
</script>
