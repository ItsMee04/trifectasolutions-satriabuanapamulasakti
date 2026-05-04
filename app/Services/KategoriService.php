<?php

namespace App\Services;

use App\Models\Kategori;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class KategoriService
{
    public function getAllActive(): Collection
    {
        return Kategori::where('status', 1)->get();
    }

    public function createKategori(array $data): Kategori
    {
        return Kategori::create([
            'kategori' => $data['kategori'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateKategori(int $id, array $data): ?Kategori
    {
        $kategori = Kategori::find($id);

        if (!$kategori) {
            return null;
        }

        $kategori->update([
            'kategori' => $data['kategori'],
            'oleh' => Auth::id(), // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $kategori;
    }

    public function deleteKategori(int $id): bool
    {
        $kategori = Kategori::find($id);

        if (!$kategori) {
            return false;
        }

        $kategori->status = 0;
        return $kategori->save();
    }
}
