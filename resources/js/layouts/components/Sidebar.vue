<template>
    <div class="sidebar" id="sidebar">
        <div class="sidebar-inner">
            <div id="sidebar-menu" class="sidebar-menu">
                <ul>
                    <li class="menu-title"><span>Main Menu</span></li>

                    <!-- Dashboard (Selalu Muncul untuk semua user yang terautentikasi) -->
                    <li :class="{ active: $route.name === 'dashboard' }">
                        <router-link to="/dashboard">
                            <i class="fas fa-home"></i> <span>Dashboard</span>
                        </router-link>
                    </li>

                    <!-- Management User Submenu -->
                    <li v-if="managementUserItems.length > 0" class="submenu" :class="{ active: isManagementActive }">
                        <a href="javascript:void(0);" @click="toggleMenu('management')"
                            :class="{ 'subdrop': openMenu === 'management' }">
                            <i class="fas fa-user-shield"></i> <span> Management User</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'management' }]">
                            <li v-for="item in managementUserItems" :key="item.path">
                                <router-link :to="item.path" :class="{ active: $route.path === item.path }">
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!-- Master Submenu -->
                    <li v-if="masterItems.length > 0" class="submenu" :class="{ active: isMasterActive }">
                        <a href="javascript:void(0);" @click="toggleMenu('master')"
                            :class="{ 'subdrop': openMenu === 'master' }">
                            <i class="fas fa-server"></i> <span> Master Data</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'master' }]">
                            <li v-for="item in masterItems" :key="item.path">
                                <router-link :to="item.path" :class="{ active: $route.path === item.path }">
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!-- Timbangan Submenu -->
                    <li v-if="timbanganItems.length > 0" class="submenu" :class="{ active: isTimbanganActive }">
                        <a href="javascript:void(0);" @click="toggleMenu('timbangan')"
                            :class="{ 'subdrop': openMenu === 'timbangan' }">
                            <i class="fas fa-balance-scale"></i> <span> Timbangan</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'timbangan' }]">
                            <li v-for="item in timbanganItems" :key="item.path">
                                <router-link :to="item.path" :class="{ active: $route.path === item.path }">
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!-- Jarak & Harga Submenu -->
                    <li v-if="jarakdanhargaItems.length > 0" class="submenu" :class="{ active: isJarakDanHargaActive }">
                        <a href="javascript:void(0);" @click="toggleMenu('jarakdanharga')"
                            :class="{ 'subdrop': openMenu === 'jarakdanharga' }">
                            <i class="fas fa-route"></i> <span> Jarak & Harga</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'jarakdanharga' }]">
                            <li v-for="item in jarakdanhargaItems" :key="item.path">
                                <router-link :to="item.path" :class="{ active: $route.path === item.path }">
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!-- Kegiatan Armada (Single Menu) -->
                    <li v-if="authStore.modules.includes('kegiatanarmada')"
                        :class="{ active: $route.name === 'kegiatanarmada' }">
                        <router-link to="/kegiatanarmada">
                            <i class="fas fa-truck"></i> <span> Kegiatan Armada</span>
                        </router-link>
                    </li>

                    <!-- Invoice Submenu -->
                    <li v-if="invoiceItems.length > 0" class="submenu" :class="{ active: isInvoiceActive }">
                        <a href="javascript:void(0);" @click="toggleMenu('invoice')"
                            :class="{ 'subdrop': openMenu === 'invoice' }">
                            <i class="fas fa-file-invoice"></i> <span> Invoice</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <ul :class="['submenu-list', { 'is-open': openMenu === 'invoice' }]">
                            <li v-for="item in invoiceItems" :key="item.path">
                                <router-link :to="item.path" :class="{ active: $route.path === item.path }">
                                    {{ item.name }}
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!-- Penjualan (Single Menu) -->
                    <li v-if="authStore.modules.includes('penjualan')" :class="{ active: $route.name === 'penjualan' }">
                        <router-link to="/penjualan">
                            <i class="fas fa-coins"></i> <span> Penjualan</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const openMenu = ref(null);
const hasModule = (moduleName) => authStore.modules.includes(moduleName);
const hasPermission = (permName) => authStore.permissions.includes(permName);

const managementUserItems = computed(() => {
    if (!hasModule('management')) return [];
    const list = [
        { name: 'Role', path: '/role', perm: 'menu-role' },
        { name: 'Pegawai', path: '/pegawai', perm: 'menu-pegawai' },
        { name: 'Users', path: '/users', perm: 'menu-users' },
    ];
    return list.filter(item => hasPermission(item.perm));
});

const masterItems = computed(() => {
    if (!hasModule('master')) return [];
    const list = [
        { name: 'Driver', path: '/driver', perm: 'menu-driver' },
        { name: 'Customer', path: '/customer', perm: 'menu-customer' },
        { name: 'Jenis Kendaraan', path: '/jeniskendaraan', perm: 'menu-jeniskendaraan' },
        { name: 'Kendaraan', path: '/kendaraan', perm: 'menu-kendaraan' },
        { name: 'Kategori', path: '/kategori', perm: 'menu-kategori' },
        { name: 'Material', path: '/material', perm: 'menu-material' },
        { name: 'Berat Jenis', path: '/beratjenis', perm: 'menu-beratjenis' },
        { name: 'Master Plant', path: '/masterplant', perm: 'menu-masterplant' },
    ];
    return list.filter(item => hasPermission(item.perm));
});

const timbanganItems = computed(() => {
    if (!hasModule('timbangan')) return [];
    const list = [
        { name: 'SC', path: '/stonecrusher', perm: 'menu-sc' },
        { name: 'CBP', path: '/concretebatchingplant', perm: 'menu-cbp' },
        { name: 'AMP', path: '/asphaltmixingplant', perm: 'menu-amp' },
    ];
    return list.filter(item => hasPermission(item.perm));
});

const jarakdanhargaItems = computed(() => {
    if (!hasModule('jarakdanharga')) return [];
    const list = [
        { name: 'Jarak & Harga AMP', path: '/jarakdanharga/amp', perm: 'menu-jarak-amp' },
        { name: 'Jarak & Harga CBP', path: '/jarakdanharga/cbp', perm: 'menu-jarak-cbp' },
        { name: 'Jarak & Harga SC', path: '/jarakdanharga/sc', perm: 'menu-jarak-sc' },
    ];
    return list.filter(item => hasPermission(item.perm));
});

const invoiceItems = computed(() => {
    if (!hasModule('invoice')) return [];
    const list = [
        { name: 'Invoice & Upah', path: '/invoice', perm: 'menu-invoice' },
        { name: 'Upah TM', path: '/upahtruckmixer', perm: 'menu-upah-tm' },
    ];
    return list.filter(item => hasPermission(item.perm));
});

const isManagementActive = computed(() => managementUserItems.value.some(item => route.path === item.path));
const isMasterActive = computed(() => masterItems.value.some(item => route.path === item.path));
const isTimbanganActive = computed(() => timbanganItems.value.some(item => route.path === item.path));
const isJarakDanHargaActive = computed(() => jarakdanhargaItems.value.some(item => route.path === item.path));
const isInvoiceActive = computed(() => invoiceItems.value.some(item => route.path === item.path));

const updateMenuState = () => {
    if (isManagementActive.value) {
        openMenu.value = 'management';
    } else if (isMasterActive.value) {
        openMenu.value = 'master';
    } else if (isTimbanganActive.value) {
        openMenu.value = 'timbangan';
    } else if (isJarakDanHargaActive.value) {
        openMenu.value = 'jarakdanharga';
    } else if (isInvoiceActive.value) {
        openMenu.value = 'invoice';
    } else {
        openMenu.value = null;
    }
};

watch(() => route.path, updateMenuState);
onMounted(updateMenuState);

const toggleMenu = (menuName) => {
    openMenu.value = openMenu.value === menuName ? null : menuName;
};
</script>

<style scoped>
.sidebar-menu ul ul {
    display: block !important;
}

.submenu-list {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    opacity: 0;
    list-style: none;
    padding: 0;
    margin: 0;
}

.is-open {
    max-height: 1000px;
    opacity: 1;
}

.sidebar-menu ul ul li a {
    padding: 10px 15px 10px 45px !important;
    display: block;
    font-size: 14px;
    color: #6c757d;
    transition: all 0.2s ease;
    border-radius: 10px;
    margin: 2px 15px 2px 25px;
}

.sidebar-menu ul ul li a:hover,
.sidebar-menu ul ul li a.active {
    background-color: #3d5ee1 !important;
    color: #ffffff !important;
}

.menu-arrow {
    transition: transform 0.3s ease-in-out !important;
}

.subdrop .menu-arrow {
    transform: rotate(90deg) !important;
}

.sidebar-inner {
    height: calc(100vh - 60px);
    overflow-y: auto;
}
</style>
