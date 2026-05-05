<?php

namespace App\Services;

use App\Models\Material;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class MaterialService
{
    public static function generateKodeMaterial(): string
    {
        // Perbaikan: Panggil model Material, bukan self
        $lastMaterial = Material::orderBy('id', 'desc')->first();

        if (!$lastMaterial) {
            $number = 1;
        } else {
            // Mengambil angka setelah 'DRV-' (indeks ke-4)
            $lastCode = $lastMaterial->kode;
            $lastNumber = (int) substr($lastCode, 4);
            $number = $lastNumber + 1;
        }

        // Format angka menjadi 3 digit (contoh: 001)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'MTRL-' . $formattedNumber;
    }

    public function getAllActive(): Collection
    {
        return Material::with('kategori')->where('status', 1)->get();
    }

    public function createMaterial(array $data): Material
    {
        return Material::create([
            // Otomatis generate kode di sini jika tidak dikirim dari front-end
            'kode' => self::generateKodeMaterial(),
            'kategori_id' => $data['kategori_id'],
            'material' => strtoupper($data['material']),
            'satuan' => $data['satuan'],
            'oleh' => Auth::id()
        ]);
    }

    public function updateMaterial(int $id, array $data): ?Material
    {
        $material = Material::find($id);

        if (!$material) {
            return null;
        }

        $material->update([
            // Umumnya kode tidak diubah saat update,
            // tapi jika tetap ingin bisa diubah, gunakan $data['kode']
            'kode' => $data['kode'] ?? $material->kode,
            'kategori_id' => $data['kategori_id'],
            'material' => strtoupper($data['material']),
            'satuan' => $data['satuan'],
            'oleh' => Auth::id() // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $material;
    }

    public function deleteMaterial(int $id): bool
    {
        $material = Material::find($id);

        if (!$material) {
            return false;
        }

        $material->status = 0;
        return $material->save();
    }
}
