<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Services\AuthenticationService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Menambahkan tipe data AuthenticationService agar Intelephense mengenalinya
     */
    protected AuthenticationService $authService;

    public function __construct(AuthenticationService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle Login Request
     */
    public function login(Request $request)
    {
        // 1. Validasi Input
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // 2. Panggil Service
        // Service akan melempar ValidationException jika login gagal
        $result = $this->authService->login($credentials);

        // 3. Response JSON
        return response()->json($result, 200);
    }

    /**
     * Get Authenticated User Data (Check Session)
     * Digunakan saat Vue Refresh halaman/Check Auth di App.vue
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'user'        => $user->load(['pegawai.jabatan', 'role']),
                'modules'     => $this->authService->getModulesForUser($user),
                'permissions' => $this->authService->getPermissionsForUser($user), // <--- Tambahkan ini
            ]
        ], 200);
    }

    /**
     * Handle Logout Request
     */
    public function logout(Request $request)
    {
        // Ambil user dari request yang sudah terautentikasi
        $this->authService->logout($request->user());

        return response()->json([
            'status'  => 'success',
            'message' => 'Berhasil keluar, token telah dihapus.'
        ], 200);
    }
}
