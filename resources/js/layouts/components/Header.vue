<template>
    <div class="header">
        <div class="header-left">
            <router-link to="/" class="logo">
                <img src="/assets/img/logo.png" alt="Logo">
            </router-link>
            <router-link to="/" class="logo logo-small">
                <img src="/assets/img/logo-small.png" alt="Logo" width="30" height="30">
            </router-link>
        </div>

        <div class="menu-toggle">
            <a href="javascript:void(0);" id="toggle_btn" @click="handleToggleSidebar">
                <i class="fas fa-bars"></i>
            </a>
        </div>

        <div class="top-nav-search d-none d-md-flex">
            <div class="d-flex align-items-center" style="height: 60px; min-width: 350px; white-space: nowrap;">
                <div class="header-datetime text-primary fw-bold">
                    <i class="fas fa-calendar-alt me-2"></i>
                    <span class="mx-2 text-muted">|</span>
                    <i class="fas fa-clock me-2"></i>
                    <span>{{ currentDateTime }}</span>
                </div>
            </div>
        </div>

        <a class="mobile_btn" id="mobile_btn" @click="handleMobileMenu">
            <i class="fas fa-bars"></i>
        </a>

        <ul class="nav user-menu">
            <li class="nav-item zoom-screen me-2">
                <a href="javascript:void(0);" class="nav-link header-nav-list" @click="handleFullscreen">
                    <img src="/assets/img/icons/header-icon-04.svg" alt="">
                </a>
            </li>

            <li class="nav-item dropdown has-arrow new-user-menus" :class="{ show: isProfileOpen }">
                <a href="javascript:void(0);" class="dropdown-toggle nav-link" @click.stop="toggleProfile">
                    <span class="user-img">
                        <img class="rounded-circle" :src="userAvatar" width="31" :alt="authStore.user?.nama">
                        <div class="user-text">
                            <h6>{{ authStore.user?.pegawai?.nama || 'Memuat...' }}</h6>
                            <p class="text-muted mb-0">{{ authStore.user?.role?.role || 'User' }}</p>
                        </div>
                    </span>
                </a>

                <div class="dropdown-menu dropdown-menu-end" :class="{ show: isProfileOpen }"
                    style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(0px, 60px, 0px);">
                    <div class="user-header">
                        <div class="avatar avatar-sm">
                            <img :src="userAvatar" alt="User Image" class="avatar-img rounded-circle">
                        </div>
                        <div class="user-text">
                            <h6>{{ authStore.user?.pegawai?.nama }}</h6>
                            <p class="text-muted mb-0">{{ authStore.user?.role?.role }}</p>
                        </div>
                    </div>
                    <a class="dropdown-item" @click="handleLogout" style="cursor: pointer;">Logout</a>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import router from '../../router';

const authStore = useAuthStore();
const currentDateTime = ref('');
const isProfileOpen = ref(false);

const toggleProfile = () => {
    isProfileOpen.value = !isProfileOpen.value;
};

const userAvatar = computed(() => {
    const image = authStore.user?.image;
    if (!image || image === 'default.png') {
        return '/assets/img/profiles/avatar-01.jpg';
    }
    const timestamp = new Date().getTime();
    return `/storage/pegawai/image/${image}?t=${timestamp}`;
});

const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.new-user-menus');
    if (dropdown && !dropdown.contains(event.target)) {
        isProfileOpen.value = false;
    }
};

/**
 * Fitur Hover Expand
 */
const onMouseEnter = () => {
    if (document.body.classList.contains('mini-sidebar')) {
        document.body.classList.add('expand-menu');
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.add('expand-menu');
    }
};

const onMouseLeave = () => {
    if (document.body.classList.contains('mini-sidebar')) {
        document.body.classList.remove('expand-menu');
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.remove('expand-menu');
    }
};

const handleToggleSidebar = () => {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');

    if (body.classList.contains('mini-sidebar')) {
        body.classList.remove('mini-sidebar');
        // Hapus listeners jika sidebar dibuka penuh
        if (sidebar) {
            sidebar.removeEventListener('mouseenter', onMouseEnter);
            sidebar.removeEventListener('mouseleave', onMouseLeave);
            sidebar.classList.remove('expand-menu');
            sidebar.style.overflow = 'auto';
        }
    } else {
        body.classList.add('mini-sidebar');
        // Tambahkan listeners untuk fitur hover expand
        if (sidebar) {
            sidebar.addEventListener('mouseenter', onMouseEnter);
            sidebar.addEventListener('mouseleave', onMouseLeave);
            sidebar.style.setProperty('overflow', 'visible', 'important');
        }
    }
    return false;
};

const handleMobileMenu = () => {
    const wrapper = document.querySelector('.main-wrapper');
    if (wrapper) {
        wrapper.classList.toggle('slide-nav');
        document.body.classList.toggle('menu-opened');
    }
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.toggle('opened');
    return false;
};

const handleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
};

const handleLogout = async () => {
    isProfileOpen.value = false;
    try {
        await authStore.logout();
        router.push('/login');
    } catch (error) {
        console.error("Gagal Logout:", error);
    }
};

const updateTime = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const datePart = now.toLocaleDateString('id-ID', options);
    const timePart = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    currentDateTime.value = `${datePart} | ${timePart}`;
};

let timer;

onMounted(() => {
    updateTime();
    timer = setInterval(updateTime, 1000);
    window.addEventListener('click', handleClickOutside);
    if (window.feather) window.feather.replace();

    // Inisialisasi listener jika halaman dimuat dalam kondisi mini-sidebar
    const sidebar = document.querySelector('.sidebar');
    if (document.body.classList.contains('mini-sidebar') && sidebar) {
        sidebar.addEventListener('mouseenter', onMouseEnter);
        sidebar.addEventListener('mouseleave', onMouseLeave);
    }
});

onUnmounted(() => {
    clearInterval(timer);
    window.removeEventListener('click', handleClickOutside);
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.removeEventListener('mouseenter', onMouseEnter);
        sidebar.removeEventListener('mouseleave', onMouseLeave);
    }
});
</script>

<style scoped>
.dropdown-menu.show {
    display: block;
}
</style>
