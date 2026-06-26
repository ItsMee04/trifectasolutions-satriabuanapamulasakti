<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function getRole()
    {
        $data = $this->roleService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data role tidak ditemukan',
                'data'      => []
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data role berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeRole(Request $request)
    {
        $request->validate(['role' => 'required|max:255']);

        $role = $this->roleService->createRole($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data role berhasil disimpan',
            'data'      => $role
        ], 201);
    }

    public function updateRole(Request $request)
    {
        $request->validate(['role' => 'required|max:255']);

        $role = $this->roleService->updateRole($request->id, $request->all());

        if (!$role) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data role tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data role berhasil diupdate',
            'data'      => $role
        ], 200);
    }

    public function deleteRole(Request $request)
    {
        $deleted = $this->roleService->deleteRole($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data role tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data role berhasil dihapus',
        ], 200);
    }
}
