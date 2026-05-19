<?php

namespace App\Modules\Authentication\Services;

use App\Modules\Authentication\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticationService
{
    /**
     * Handle API Login
     */
    public function login(array $credentials)
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Email belum terdaftar.'],
            ]);
        }

        if (!Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Kata sandi salah.'],
            ]);
        }

        if ($user->status !== 1) {
            throw ValidationException::withMessages([
                'status' => ['Akun Anda sudah tidak aktif.'],
            ]);
        }

        // AMBIL DATA MODUL DAN PERMISSIONS
        $modules = $this->getModulesForUser($user);
        $permissions = $this->getPermissionsForUser($user);

        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'status' => 'success',
            'data'   => [
                'user'        => $user->load(['pegawai.jabatan', 'role']),
                'modules'     => $modules,
                'permissions' => $permissions,
            ],
            'token'  => $token,
        ];
    }

    /**
     * Ambil daftar MODUL (Grup Besar)
     */
    public function getModulesForUser(User $user): array
    {
        return $user->permissions()
            ->where('permission.status', 1)
            ->with(['module' => function ($query) {
                $query->where('status', 1);
            }])
            ->get()
            ->filter(fn($p) => $p->module !== null)
            ->pluck('module.module')
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Ambil daftar PERMISSION (Nama Menu Detail)
     */
    public function getPermissionsForUser(User $user): array
    {
        return $user->permissions()
            ->where('permission.status', 1)
            ->pluck('nama_permission')
            ->toArray();
    }

    /**
     * Handle logout - delete user tokens
     */
    public function logout(User $user)
    {
        $token = $user->currentAccessToken();
        if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
            return $token->delete();
        }
        return $user->tokens()->delete();
    }
}
