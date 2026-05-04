<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\MaterialService;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    protected MaterialService $materialService;

    public function __construct(MaterialService $materialService)
    {
        $this->materialService = $materialService;
    }

    public function getMaterial()
    {
        $data = $this->materialService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data material tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data material berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeMaterial(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori,id',
            'material' => 'required|max:255',
            'satuan' => 'required|max:255'
        ]);

        $material = $this->materialService->createMaterial($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data material berhasil disimpan',
            'data'      => $material
        ], 201);
    }

    public function updateMaterial(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori,id',
            'material' => 'required|max:255',
            'satuan' => 'required|max:255'
        ]);

        $material = $this->materialService->updateMaterial($request->id, $request->all());

        if (!$material) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data material tidak ditemukan',
                'data'      => null
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data material berhasil diupdate',
            'data'      => $material
        ], 200);
    }

    public function deleteMaterial(Request $request)
    {
        $deleted = $this->materialService->deleteMaterial($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data material tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data material berhasil dihapus',
        ], 200);
    }
}
