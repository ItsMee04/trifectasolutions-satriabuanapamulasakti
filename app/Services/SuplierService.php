<?php

namespace App\Services;

use App\Models\Suplier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SuplierService
{
    public static function generateKodeSuplier(): string
    {
        // Panggil model Suplier untuk mengambil data terakhir berdasarkan ID terbesar
        $lastSuplier = Suplier::orderBy('id', 'desc')->first();

        if (!$lastSuplier) {
            $number = 1;
        } else {
            // Mengambil angka setelah 'SUP-' (indeks ke-4)
            // Contoh: 'SUP-001' akan dipotong dari karakter ke-4 sampai akhir, menghasilkan '001'
            $lastCode = $lastSuplier->kode;
            $lastNumber = (int) substr($lastCode, 4);
            $number = $lastNumber + 1;
        }

        // Perbaikan format angka menjadi 6 digit (contoh: 000001)
        $formattedNumber = str_pad($number, 6, '0', STR_PAD_LEFT);

        // Menggabungkan prefix 'SP' dengan angka yang sudah di-format
        return 'SP' . $formattedNumber;
    }

    public function getAllActive(): Collection
    {
        return Suplier::with(['masterplants'])->where('status', 1)->get();
    }

    public function createSuplier(array $data): Suplier
    {
        // Menggunakan DB::transaction agar jika salah satu proses error, database tidak corupt
        return DB::transaction(function () use ($data) {

            // 1. Simpan data utama ke tabel suplier
            $suplier = Suplier::create([
                'kode' => self::generateKodeSuplier(),
                'nama' => strtoupper($data['nama']),
                'email' => $data['email'],
                'kontak' => $data['kontak'],
                'alamat' => strtoupper($data['alamat']),
                'oleh' => Auth::id()
            ]);

            // 2. Otomatis input ke tabel groupsuplier (pivot) jika ada data masterplant_ids
            // Pastikan di front-end (Vue.js) Anda mengirimkan array ID seperti: masterplant_ids: [1, 2, 3]
            if (isset($data['masterplant_ids']) && is_array($data['masterplant_ids'])) {
                $suplier->masterplants()->attach($data['masterplant_ids']);
            }

            return $suplier;
        });
    }

    public function updateSuplier(int $id, array $data): ?Suplier
    {
        // Menggunakan DB::transaction untuk memastikan data utama dan pivot aman ter-update bersamaan
        return DB::transaction(function () use ($id, $data) {
            $suplier = Suplier::find($id);

            if (!$suplier) {
                return null;
            }

            // 1. Update data profil utama customer
            $suplier->update([
                'kode' => $data['kode'] ?? $suplier->kode, // Mempertahankan kode lama jika tidak diubah
                'nama' => strtoupper($data['nama']),
                'email' => $data['email'],
                'kontak' => $data['kontak'],
                'alamat' => strtoupper($data['alamat']),
                'oleh' => Auth::id()
            ]);

            // 2. OTOMATIS UPDATE TABLE PIVOT (groupcustomer)
            // Pastikan parameter yang dilempar dari controller membawa array 'masterplant_ids'
            if (isset($data['masterplant_ids']) && is_array($data['masterplant_ids'])) {
                // sync() akan menghapus relasi lama yang tidak terpilih dan menambah relasi baru yang dicentang
                $suplier->masterplants()->sync($data['masterplant_ids']);
            } else {
                // Jika user mengosongkan semua checkbox masterplant (opsional, tergantung kebijakan bisnis)
                $suplier->masterplants()->detach();
            }

            return $suplier;
        });
    }

    public function deleteSuplier(int $id): bool
    {
        $suplier = Suplier::find($id);

        if (!$suplier) {
            return false;
        }

        $suplier->status = 0;
        return $suplier->save();
    }
}
