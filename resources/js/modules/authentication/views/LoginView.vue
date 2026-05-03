<template>
    <div class="main-wrapper login-body">
        <div class="login-wrapper">
            <div class="container">
                <div class="loginbox">
                    <div class="login-left">
                        <img class="img-fluid" src="/assets/img/login.png" alt="Logo">
                    </div>
                    <div class="login-right">
                        <div class="login-right-wrap">
                            <h1>Welcome to Trifecta</h1>
                            <h2 class="text-primary">Sign in</h2>

                            <form @submit.prevent="handleLogin">
                                <div class="form-group">
                                    <label>Email <span class="login-danger">*</span></label>
                                    <input v-model="form.email" class="form-control"
                                        :class="{ 'is-invalid': errors.email }" type="email">
                                    <span class="profile-views"><i class="fas fa-user-circle"></i></span>
                                </div>
                                <div class="form-group">
                                    <label>Password <span class="login-danger">*</span></label>
                                    <div class="pass-group">
                                        <input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'"
                                            class="form-control pass-input" :class="{ 'is-invalid': errors.password }"
                                            :disabled="loading">

                                        <span class="profile-views toggle-password" @click="togglePasswordVisibility">
                                            <i :class="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="forgotpass">
                                    <div class="remember-me">
                                        <label class="custom_check mr-2 mb-0 d-inline-flex remember-me"> Remember me
                                            <input type="checkbox" name="radio" v-model="form.remember">
                                            <span class="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-primary btn-block" type="submit" :disabled="loading">
                                        <span v-if="loading">Memuat data...</span>
                                        <span v-else>Login</span>
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// import
import { ref } from 'vue';
import { useAuthentication } from '../composables/useAuthentication';

// state
const { form, loading, errors, remember, handleLogin } = useAuthentication();
const isPasswordVisible = ref(false);

// logic
const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
}
</script>
<style scoped>
/* Menghilangkan ikon silang/peringatan bawaan Bootstrap pada is-invalid */
.form-control.is-invalid {
    background-image: none !important;
    padding-right: 12px;
    /* Kembalikan padding normal jika tidak ingin ada jarak ekstra */
}

/* Pastikan ikon mata tidak tertutup oleh elemen lain */
.profile-views {
    z-index: 5;
}
</style>
