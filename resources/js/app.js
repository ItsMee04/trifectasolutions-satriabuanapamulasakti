import './bootstrap';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { createApp, Transition } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import * as bootstrap from 'bootstrap'; // Import JS
window.bootstrap = bootstrap; // Jadikan global agar useRole.js bisa baca

const app = createApp(App);
const pinia = createPinia();

const options = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,
    timeout: 2000,
};

app.use(pinia);
app.use(router);
app.use(Toast, options)
app.mount('#app');
