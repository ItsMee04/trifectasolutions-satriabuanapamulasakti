<?php

namespace App\Services;

use App\Models\Timbangan;
use Carbon\Carbon;

class GenerateKodeService
{
    /**
     * Logic untuk generate nomor otomatis: YYMMDDXXXX
     */
    public function generateNomorTimbangan(): string
    {
        $today = Carbon::now()->format('Y-m-d');
        $prefix = Carbon::now()->format('ymd'); // Hasil: 260505

        // Cari nomor terakhir pada hari ini
        $lastRecord = Timbangan::whereDate('tanggal', $today)
            ->orderBy('nomor', 'desc')
            ->first();

        if (!$lastRecord) {
            // Jika belum ada data hari ini, mulai dari 0001
            return $prefix . '0001';
        }

        // Ambil 4 digit terakhir, tambah 1
        $lastNumber = substr($lastRecord->nomor, -4);
        $nextNumber = str_pad((int)$lastNumber + 1, 4, '0', STR_PAD_LEFT);

        return $prefix . $nextNumber;
    }
}
