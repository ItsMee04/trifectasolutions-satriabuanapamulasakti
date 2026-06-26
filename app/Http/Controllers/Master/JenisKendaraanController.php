<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\JenisKendaraanService;
use Illuminate\Http\Request;

class JenisKendaraanController extends Controller
{
    protected JenisKendaraanService $jenisKendaraanService;

    public function __construct(JenisKendaraanService $jenisKendaraanService)
    {
        $this->jenisKendaraanService = $jenisKendaraanService;
    }

    public function getJenisKendaraan()
    {
        $data = $this->jenisKendaraanService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jenis kendaraan tidak ditemukan',
                'data'      => []
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis kendaraan berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeJenisKendaraan(Request $request)
    {
        $request->validate(['jenis' => 'required|max:255', 'indexperkm' => 'required|numeric']);

        $jenisKendaraan = $this->jenisKendaraanService->createJenisKendaraan($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data jenis kendaraan berhasil disimpan',
            'data'      => $jenisKendaraan
        ], 201);
    }

    public function updateJenisKendaraan(Request $request)
    {
        $request->validate(['jenis' => 'required|max:255', 'indexperkm' => 'required|numeric']);

        $jenisKendaraan = $this->jenisKendaraanService->updateJenisKendaraan($request->id, $request->all());

        if (!$jenisKendaraan) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jenis kendaraan tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis kendaraan berhasil diupdate',
            'data'      => $jenisKendaraan
        ], 200);
    }

    public function deleteJenisKendaraan(Request $request)
    {
        $deleted = $this->jenisKendaraanService->deleteJenisKendaraan($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jenis kendaraan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis kendaraan berhasil dihapus',
        ], 200);
    }
}
