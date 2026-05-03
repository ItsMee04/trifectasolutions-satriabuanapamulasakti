<?php

namespace App\Services;

use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;

class RoleService
{
    public function getAllActive(): Collection
    {
        return Role::where('status', 1)->get();
    }

    public function createRole(array $data): Role
    {
        return Role::create([
            'role' => strtoupper($data['role'])
        ]);
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateRole(int $id, array $data): ?Role
    {
        $role = Role::find($id);

        if (!$role) {
            return null;
        }

        $role->update([
            'role' => strtoupper($data['role'])
        ]);

        return $role;
    }

    public function deleteRole(int $id): bool
    {
        $role = Role::find($id);

        if (!$role) {
            return false;
        }

        $role->status = 0;
        return $role->save();
    }
}
