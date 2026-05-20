<?php

namespace App\Services;

use App\Models\Suplier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class SuplierService
{
    public static function generateKodeSuplier(): string
    {
        // Perbaikan: Panggil model Suplier, bukan self
        $lastSuplier = Suplier::orderBy('id', 'desc')->first();

        if (!$lastSuplier) {
            $number = 1;
        } else {
            // Mengambil angka setelah 'SUP-' (indeks ke-4)
            $lastCode = $lastSuplier->kode;
            $lastNumber = (int) substr($lastCode, 4);
            $number = $lastNumber + 1;
        }

        // Format angka menjadi 3 digit (contoh: 001)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'SUP-' . $formattedNumber;
    }

    public function getAllActive(): Collection
    {
        return Suplier::where('status', 1)->get();
    }

    public function createSuplier(array $data): Suplier
    {
        return Suplier::create([
            // Otomatis generate kode di sini jika tidak dikirim dari front-end
            'kode' => self::generateKodeSuplier(),
            'nama' => strtoupper($data['nama']),
            'kontak' => $data['kontak'],
            'alamat' => strtoupper($data['alamat']),
            'oleh' => Auth::id()
        ]);
    }

    public function updateSuplier(int $id, array $data): ?Suplier
    {
        $suplier = Suplier::find($id);

        if (!$suplier) {
            return null;
        }

        $suplier->update([
            // Umumnya kode tidak diubah saat update,
            // tapi jika tetap ingin bisa diubah, gunakan $data['kode']
            'kode' => $data['kode'] ?? $suplier->kode,
            'nama' => strtoupper($data['nama']),
            'kontak' => $data['kontak'],
            'alamat' => strtoupper($data['alamat']),
            'oleh' => Auth::id() // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $suplier;
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
