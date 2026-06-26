<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\PegawaiService;
use Illuminate\Http\Request;

class PegawaiController extends Controller
{
    /**
     * Inisialisasi Service dengan Type Hinting agar tidak ada warning
     */
    protected PegawaiService $pegawaiService;

    public function __construct(PegawaiService $pegawaiService)
    {
        $this->pegawaiService = $pegawaiService;
    }

    public function getPegawai()
    {
        $data = $this->pegawaiService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pegawai tidak ditemukan',
                'data'      => []
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storePegawai(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'nama'   => 'required|string|max:100',
            'kontak' => 'required|string|max:100',
            'alamat' => 'required|string',
            'image'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 2. Panggil Service
        // Kirim $request->all() untuk data teks dan $request->file('image') untuk file
        $pegawai = $this->pegawaiService->createPegawai($request->all(), $request->file('image'));

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Pegawai Berhasil Ditambahkan',
            'data'      => $pegawai
        ], 201);
    }

    public function updatePegawai(Request $request)
    {
        // 1. Validasi (ID wajib ada)
        $request->validate([
            'id'     => 'required|integer',
            'nama'   => 'required|string|max:100',
            'kontak' => 'required|string|max:100',
            'alamat' => 'required|string',
            'image'  => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 2. Panggil Service dengan Type Casting (int)
        $pegawai = $this->pegawaiService->updatePegawai(
            (int) $request->id,
            $request->all(),
            $request->file('image')
        );

        if (!$pegawai) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pegawai tidak ditemukan'
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data pegawai berhasil diupdate',
            'data'      => $pegawai
        ], 200);
    }

    public function deletePegawai(Request $request)
    {
        $deleted = $this->pegawaiService->deletePegawai((int) $request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pegawai tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data pegawai berhasil dihapus'
        ], 200);
    }
}
