<?php

namespace App\Services;

use App\Models\Kendaraan;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class KendaraanService
{
    public function getAllActive(): Collection
    {
        return Kendaraan::where('status', 1)->get();
    }

    public function createKendaraan(array $data): Kendaraan
    {
        return Kendaraan::create([
            'kode' => $data['kode'],
            'kendaraan' => $data['kendaraan'],
            'jeniskendaraan_id' => $data['jeniskendaraan_id'],
            'nomor' => $data['nomor'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateKendaraan(int $id, array $data): ?Kendaraan
    {
        $kendaraan = Kendaraan::find($id);

        if (!$kendaraan) {
            return null;
        }

        $kendaraan->update([
            'kode' => $data['kode'],
            'kendaraan' => $data['kendaraan'],
            'jeniskendaraan_id' => $data['jeniskendaraan_id'],
            'nomor' => $data['nomor'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $kendaraan;
    }

    public function deleteKendaraan(int $id): bool
    {
        $kendaraan = Kendaraan::find($id);

        if (!$kendaraan) {
            return false;
        }

        $kendaraan->status = 0;
        return $kendaraan->save();
    }
}
