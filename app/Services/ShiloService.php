<?php

namespace App\Services;

use App\Models\Shilo;
use Illuminate\Database\Eloquent\Collection;

class ShiloService
{
    public function getAllActive(): Collection
    {
        return Shilo::where('status', 1)->get();
    }

    public function createShilo(array $data): Shilo
    {
        return Shilo::create([
            'shilo' => strtoupper($data['shilo']),
        ]);
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateShilo(int $id, array $data): ?Shilo
    {
        $shilo = Shilo::find($id);

        if (!$shilo) {
            return null;
        }

        $shilo->update([
            'role' => strtoupper($data['shilo'])
        ]);

        return $shilo;
    }

    public function deleteShilo(int $id): bool
    {
        $shilo = Shilo::find($id);

        if (!$shilo) {
            return false;
        }

        $shilo->status = 0;
        return $shilo->save();
    }
}
