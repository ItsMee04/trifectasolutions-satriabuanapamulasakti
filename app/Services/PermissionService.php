<?php

namespace App\Services;

use App\Models\Module;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PermissionService
{
    /**
     * Mengambil Master Module & Permission untuk daftar checklist
     */
    public function getMasterPermissions()
    {
        return Module::with(['permissions' => function ($q) {
            $q->where('status', 1);
        }])
            ->where('status', 1)
            ->get();
    }

    /**
     * Update Hak Akses per User
     */
    public function updateUserPermissions(int $userId, array $permissionIds)
    {
        DB::beginTransaction();
        try {
            $user = User::findOrFail($userId);

            // Menggunakan sync() untuk tabel user_permission
            // Pastikan di Model User sudah ada method permissions() belongsToMany
            $user->permissions()->sync($permissionIds);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
