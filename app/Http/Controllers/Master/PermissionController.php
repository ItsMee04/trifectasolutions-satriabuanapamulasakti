<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Exception;

class PermissionController extends Controller
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Mendapatkan daftar modul dan permission (untuk checklist)
     */
    public function getPermissions()
    {
        try {
            $data = $this->permissionService->getMasterPermissions();
            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data permission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update hak akses untuk user tertentu
     */
    public function updatePermissions(Request $request, int $userId)
    {
        $request->validate([
            'permissions' => 'present|array',
        ]);

        try {
            $this->permissionService->updateUserPermissions($userId, $request->permissions);
            return response()->json([
                'success' => true,
                'message' => 'Hak akses user berhasil diperbarui'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui hak akses: ' . $e->getMessage()
            ], 500);
        }
    }
}
