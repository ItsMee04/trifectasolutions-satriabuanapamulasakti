<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\KendaraanService;
use Illuminate\Http\Request;

class KendaraanController extends Controller
{
    protected KendaraanService $kendaraanService;

    public function __construct(KendaraanService $kendaraanService)
    {
        $this->kendaraanService = $kendaraanService;
    }

    public function getKendaraan()
    {
        $data = $this->kendaraanService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kendaraan tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kendaraan berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeKendaraan(Request $request)
    {
        $request->validate(['jenis' => 'required|max:255', 'jeniskendaraan_id' => 'exists:jeniskendaraan,id|numeric']);

        $kendaraan = $this->kendaraanService->createKendaraan($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data kendaraan berhasil disimpan',
            'data'      => $kendaraan
        ], 201);
    }

    public function updateKendaraan(Request $request)
    {
        $request->validate(['jenis' => 'required|max:255', 'jeniskendaraan_id' => 'exists:jeniskendaraan,id|numeric']);

        $kendaraan = $this->kendaraanService->updateKendaraan($request->id, $request->all());

        if (!$kendaraan) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kendaraan tidak ditemukan',
                'data'      => null
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kendaraan berhasil diupdate',
            'data'      => $kendaraan
        ], 200);
    }

    public function deleteKendaraan(Request $request)
    {
        $deleted = $this->kendaraanService->deleteKendaraan($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kendaraan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kendaraan berhasil dihapus',
        ], 200);
    }
}
