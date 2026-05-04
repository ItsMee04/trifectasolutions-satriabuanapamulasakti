import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import store
import LoginView from '../modules/authentication/views/LoginView.vue';

const routes = [
    {
        path: "/",
        redirect: "/login",
        meta: { guestOnly: true } // Tandai bahwa ini hanya untuk yang belum login
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: { guestOnly: true } // Tandai bahwa ini hanya untuk yang belum login
    },
    {
        path: "/",
        // MainLayout sebagai pembungkus utama
        component: () => import("../layouts/MainLayout.vue"),
        meta: { requiresAuth: true },
        // Semua halaman di bawah ini akan muncul di dalam <router-view v-slot="{ Component }"> milik MainLayout
        children: [
            {
                path: "",
                redirect: { name: "dashboard" },
            },
            {
                path: "dashboard",
                name: "dashboard",
                component: () =>
                    import("@/modules/dashboard/views/DashboardView.vue"),
            },
            {
                path: "role",
                name: "role",
                component: () =>
                    import("@/modules/role/views/RoleView.vue"),
            },
            {
                path: "pegawai",
                name: "pegawai",
                component: () =>
                    import("@/modules/pegawai/views/PegawaiView.vue"),
            },
            {
                path: "users",
                name: "users",
                component: () =>
                    import("@/modules/users/views/UserView.vue"),
            },
            {
                path: "driver",
                name: "driver",
                component: () =>
                    import("@/modules/driver/views/DriverView.vue"),
            },
            {
                path: "customer",
                name: "customer",
                component: () =>
                    import("@/modules/customer/views/CustomerView.vue"),
            },
            {
                path: "jeniskendaraan",
                name: "jeniskendaraan",
                component: () =>
                    import("@/modules/jeniskendaraan/views/JenisKendaraanView.vue"),
            },
            {
                path: "kendaraan",
                name: "kendaraan",
                component: () =>
                    import("@/modules/kendaraan/views/KendaraanView.vue"),
            },
            // {
            //     path: "kategori",
            //     name: "kategori",
            //     component: () =>
            //         import("@/modules/kategori/views/KategoriView.vue"),
            // },
            // {
            //     path: "material",
            //     name: "material",
            //     component: () =>
            //         import("@/modules/material/views/MaterialView.vue"),
            // },
            // {
            //     path: "beratjenis",
            //     name: "beratjenis",
            //     component: () =>
            //         import("@/modules/beratjenis/views/BeratJenisView.vue"),
            // },
            // {
            //     path: "stonecrusher",
            //     name: "stonecrusher",
            //     component: () =>
            //         import("@/modules/sc/views/SCView.vue"),
            // },
            // {
            //     path: "concretebatchingplant",
            //     name: "concretebatchingplant",
            //     component: () =>
            //         import("@/modules/cbp/views/CBPView.vue"),
            // },
            // {
            //     path: "asphaltmixingplant",
            //     name: "asphaltmixingplant",
            //     component: () =>
            //         import("@/modules/amp/views/AMPView.vue"),
            // },
            // {
            //     path: "/jarakdanharga/:type",
            //     name: "jarakdanharga",
            //     component: () =>
            //         import("@/modules/jarakdanharga/views/JarakHargaView.vue"),
            //     props: true,
            // },
            // {
            //     path: "kegiatanarmada",
            //     name: "kegiatanarmada",
            //     component: () =>
            //         import("@/modules/kegiatanarmada/views/KegiatanArmadaView.vue"),
            // },
            // {
            //     path: "invoice",
            //     name: "invoice",
            //     component: () =>
            //         import("@/modules/invoice/views/InvoiceView.vue"),
            // },
            // {
            //     path: "upahtruckmixer",
            //     name: "upahtruckmixer",
            //     component: () =>
            //         import("@/modules/truckmixer/views/TruckMixerView.vue"),
            // },
            // {
            //     path: "penjualan",
            //     name: "penjualan",
            //     component: () =>
            //         import("@/modules/penjualan/views/PenjualanView.vue"),
            // },
            // Tambahkan rute modular lainnya di sini
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// --- TAMBAHKAN LOGIKA INI ---
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const token = localStorage.getItem('token');

    // 1. Jika ada token tapi Pinia kosong (kasus Tab Baru / Refresh)
    if (token && !authStore.isAuthenticated) {
        try {
            await authStore.checkAuth(); // Ambil data user dari API
        } catch (error) {
            console.error("Token tidak valid");
        }
    }

    // 2. Proteksi rute yang butuh Login
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login' });
    }
    // 3. Proteksi rute Guest (Login/Register) agar tidak bisa diakses jika sudah login
    else if (to.meta.guestOnly && authStore.isAuthenticated) {
        next({ name: 'dashboard' });
    }
    // 4. Lanjutkan perjalanan
    else {
        next();
    }
});

export default router;
