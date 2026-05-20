<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\SuplierService;
use Illuminate\Http\Request;

class SuplierController extends Controller
{
    protected SuplierService $suplierService;

    public function __construct(SuplierService $suplierService)
    {
        $this->suplierService = $suplierService;
    }

    public function getSuplier()
    {
        $data = $this->suplierService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data suplier tidak ditemukan',
                'data'      => []
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data suplier berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeSuplier(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:255',
            'kontak' => 'required|max:255',
            'alamat' => 'required|max:255',
        ]);

        $suplier = $this->suplierService->createSuplier($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data suplier berhasil disimpan',
            'data'      => $suplier
        ], 201);
    }

    public function updateSuplier(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:255',
            'kontak' => 'required|max:255',
            'alamat' => 'required|max:255',
        ]);

        $suplier = $this->suplierService->updateSuplier($request->id, $request->all());

        if (!$suplier) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data suplier tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data suplier berhasil diupdate',
            'data'      => $suplier
        ], 200);
    }

    public function deleteSuplier(Request $request)
    {
        $deleted = $this->suplierService->deleteSuplier($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data suplier tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data suplier berhasil dihapus',
        ], 200);
    }
}
