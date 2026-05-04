<?php

namespace App\Services;

use App\Models\BeratJenis;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class BeratJenisService
{
    public function getAllActive(): Collection
    {
        return BeratJenis::where('status', 1)->get();
    }

    public function createBeratJenis(array $data): BeratJenis
    {
        return BeratJenis::create([
            'beratjenis' => $data['beratjenis'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateBeratJenis(int $id, array $data): ?BeratJenis
    {
        $beratjenis = BeratJenis::find($id);

        if (!$beratjenis) {
            return null;
        }

        $beratjenis->update([
            'beratjenis' => $data['beratjenis'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $beratjenis;
    }

    public function deleteBeratJenis(int $id): bool
    {
        $beratjenis = BeratJenis::find($id);

        if (!$beratjenis) {
            return false;
        }

        $beratjenis->status = 0;
        return $beratjenis->save();
    }
}
