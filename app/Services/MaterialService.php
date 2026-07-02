<?php

namespace App\Services;

use App\Models\Material;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        return Material::with('masterplants')->where('status', 1)->get();
    }

    public function createMaterial(array $data): Material
    {
        // Menggunakan DB::transaction agar jika salah satu proses error, database tidak corupt
        return DB::transaction(function () use ($data) {

            // 1. Simpan data utama ke tabel material
            $material = Material::create([
                'kode' => strtoupper($data['kode']),
                'material' => strtoupper($data['material']),
                'satuan' => $data['satuan'],
                'oleh' => Auth::id()
            ]);

            // 2. Otomatis input ke tabel groupmaterial (pivot) jika ada data masterplant_ids
            // Pastikan di front-end (Vue.js) Anda mengirimkan array ID seperti: masterplant_ids: [1, 2, 3]
            if (isset($data['masterplant_ids']) && is_array($data['masterplant_ids'])) {
                $material->masterplants()->attach($data['masterplant_ids']);
            }

            return $material;
        });
    }

    public function updateMaterial(int $id, array $data): ?Material
    {
        // Menggunakan DB::transaction untuk memastikan data utama dan pivot aman ter-update bersamaan
        return DB::transaction(function () use ($id, $data) {
            $material = Material::find($id);

            if (!$material) {
                return null;
            }

            // 1. Update data profil utama customer
            $material->update([
                'kode' => $data['kode'] ?? $material->kode, // Mempertahankan kode lama jika tidak diubah
                'material' => strtoupper($data['material']),
                'satuan' => $data['satuan'],
                'oleh' => Auth::id()
            ]);

            // 2. OTOMATIS UPDATE TABLE PIVOT (groupmaterial)
            // Pastikan parameter yang dilempar dari controller membawa array 'masterplant_ids'
            if (isset($data['masterplant_ids']) && is_array($data['masterplant_ids'])) {
                // sync() akan menghapus relasi lama yang tidak terpilih dan menambah relasi baru yang dicentang
                $material->masterplants()->sync($data['masterplant_ids']);
            } else {
                // Jika user mengosongkan semua checkbox masterplant (opsional, tergantung kebijakan bisnis)
                $material->masterplants()->detach();
            }

            return $material;
        });
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
