<?php

namespace App\Services;

use App\Models\JenisKendaraan;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class JenisKendaraanService
{
    public function getAllActive(): Collection
    {
        return JenisKendaraan::where('status', 1)->get();
    }

    public function createJenisKendaraan(array $data): JenisKendaraan
    {
        return JenisKendaraan::create([
            'jenis' => $data['jenis'],
            'indexperkm' => $data['indexperkm'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateJenisKendaraan(int $id, array $data): ?JenisKendaraan
    {
        $jenisKendaraan = JenisKendaraan::find($id);

        if (!$jenisKendaraan) {
            return null;
        }

        $jenisKendaraan->update([
            'jenis' => $data['jenis'],
            'indexperkm' => $data['indexperkm'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $jenisKendaraan;
    }

    public function deleteJenisKendaraan(int $id): bool
    {
        $jenisKendaraan = JenisKendaraan::find($id);

        if (!$jenisKendaraan) {
            return false;
        }

        $jenisKendaraan->status = 0;
        return $jenisKendaraan->save();
    }
}
