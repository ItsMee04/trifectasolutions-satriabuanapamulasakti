<?php

namespace App\Services;

use App\Models\Driver;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class DriverService
{
    public static function generateKodeDriver(): string
    {
        // Perbaikan: Panggil model Driver, bukan self
        $lastDriver = Driver::orderBy('id', 'desc')->first();

        if (!$lastDriver) {
            $number = 1;
        } else {
            // Mengambil angka setelah 'DRV-' (indeks ke-4)
            $lastCode = $lastDriver->kode;
            $lastNumber = (int) substr($lastCode, 4);
            $number = $lastNumber + 1;
        }

        // Format angka menjadi 3 digit (contoh: 001)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'DRV-' . $formattedNumber;
    }

    public function getAllActive(): Collection
    {
        return Driver::where('status', 1)->get();
    }

    public function createDriver(array $data): Driver
    {
        return Driver::create([
            // Otomatis generate kode di sini jika tidak dikirim dari front-end
            'kode' => self::generateKodeDriver(),
            'nama' => strtoupper($data['nama']),
            'kontak' => $data['kontak'],
            'alamat' => strtoupper($data['alamat']),
            'rekening' => $data['rekening'] ?? null,
            'oleh' => Auth::id()
        ]);
    }

    public function updateDriver(int $id, array $data): ?Driver
    {
        $driver = Driver::find($id);

        if (!$driver) {
            return null;
        }

        $driver->update([
            // Umumnya kode tidak diubah saat update,
            // tapi jika tetap ingin bisa diubah, gunakan $data['kode']
            'kode' => $data['kode'] ?? $driver->kode,
            'nama' => strtoupper($data['nama']),
            'kontak' => $data['kontak'],
            'alamat' => strtoupper($data['alamat']),
            'rekening' => $data['rekening'] ?? null,
            'oleh' => Auth::id() // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $driver;
    }

    public function deleteDriver(int $id): bool
    {
        $driver = Driver::find($id);

        if (!$driver) {
            return false;
        }

        $driver->status = 0;
        return $driver->save();
    }
}
