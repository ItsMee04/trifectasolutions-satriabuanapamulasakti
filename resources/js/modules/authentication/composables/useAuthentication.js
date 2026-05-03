import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { toastfy } from '../../../utilities/toast';

export function useAuthentication() {
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(false);
    const errors = ref({});
    const form = ref({
        email: '',
        password: '',
        remember: false
    });

    const validate = () => {
        errors.value = {};
        let isValid = true;

        if (!form.value.email) {
            errors.value.email = 'Email wajib diisi.';
            isValid = false;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(form.value.email)) {
                errors.value.email = 'Format email tidak valid.';
                isValid = false;
            }
        }
        if (!form.value.password) {
            errors.value.password = 'Password wajib diisi.';
            isValid = false;
        }
        return isValid;
    };

    const handleLogin = async () => {
        if (!validate()) {
            toastfy.error("Silakan lengkapi form login.");
            return;
        }

        loading.value = true;

        try {
            if (form.value.remember) {
                localStorage.setItem('remember_me', 'true');
            } else {
                localStorage.setItem('remember_me', 'false');
            }
            await authStore.loginUser(form.value);

            toastfy.success("Login Berhasil!");
        } catch (error) {
            console.error("Login Error:", error);
            const msg = error.response?.data?.message || "Email atau password salah";
            toastfy.error(msg);
        } finally {
            loading.value = false;
        }
    };

    return {
        form,
        loading,
        errors,
        handleLogin
    };
}
