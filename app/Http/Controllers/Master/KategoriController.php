<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\KategoriService;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    protected KategoriService $kategoriService;

    public function __construct(KategoriService $kategoriService)
    {
        $this->kategoriService = $kategoriService;
    }

    public function getKategori()
    {
        $data = $this->kategoriService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kategori tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kategori berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeKategori(Request $request)
    {
        $request->validate(['kategori' => 'required|max:255']);

        $kategori = $this->kategoriService->createKategori($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data kategori berhasil disimpan',
            'data'      => $kategori
        ], 201);
    }

    public function updateKategori(Request $request)
    {
        $request->validate(['kategori' => 'required|max:255']);

        $kategori = $this->kategoriService->updateKategori($request->id, $request->all());

        if (!$kategori) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kategori tidak ditemukan',
                'data'      => null
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kategori berhasil diupdate',
            'data'      => $kategori
        ], 200);
    }

    public function deleteKategori(Request $request)
    {
        $deleted = $this->kategoriService->deleteKategori($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kategori tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kategori berhasil dihapus',
        ], 200);
    }
}
