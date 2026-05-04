<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\BeratJenisService;
use Illuminate\Http\Request;

class BeratJenisController extends Controller
{
    protected BeratJenisService $beratjenisService;

    public function __construct(BeratJenisService $beratjenisService)
    {
        $this->beratjenisService = $beratjenisService;
    }

    public function getBeratJenis()
    {
        $data = $this->beratjenisService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data berat jenis tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berat jenis berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeBeratJenis(Request $request)
    {
        $request->validate([
            'beratjenis' => 'required|integer',
        ]);

        $beratjenis = $this->beratjenisService->createBeratJenis($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data berat jenis berhasil disimpan',
            'data'      => $beratjenis
        ], 201);
    }

    public function updateBeratJenis(Request $request)
    {
        $request->validate([
            'beratjenis' => 'required|integer',
        ]);

        $beratjenis = $this->beratjenisService->updateBeratJenis($request->id, $request->all());

        if (!$beratjenis) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data berat jenis tidak ditemukan',
                'data'      => null
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berat jenis berhasil diupdate',
            'data'      => $beratjenis
        ], 200);
    }

    public function deleteBeratJenis(Request $request)
    {
        $deleted = $this->beratjenisService->deleteBeratJenis($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data berat jenis tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berat jenis berhasil dihapus',
        ], 200);
    }
}
