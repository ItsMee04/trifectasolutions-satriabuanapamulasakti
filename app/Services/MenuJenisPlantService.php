<?php

namespace App\Services;

use App\Models\MenuJenisPlant;
use Illuminate\Database\Eloquent\Collection;

class MenuJenisPlantService
{
    public function getAllActive(): Collection
    {
        return MenuJenisPlant::where('status', 1)->with('masterplant')->get();
    }

    public function createMenuJenisPlant(array $data): MenuJenisPlant
    {
        return MenuJenisPlant::create([
            'masterplant_id' => $data['masterplant_id'],
            'menujenis' => strtoupper($data['menujenis'])
        ]);
    }

    public function updateMenuJenisPlant(int $id, array $data): ?MenuJenisPlant
    {
        $menujenisplant = MenuJenisPlant::find($id);

        if (!$menujenisplant) {
            return null;
        }

        $menujenisplant->update([
            'masterplant_id' => $data['masterplant_id'],
            'menujenis' => strtoupper($data['menujenis'])
        ]);

        return $menujenisplant;
    }

    public function deleteMenuJenisPlant(int $id): bool
    {
        $menujenisplant = MenuJenisPlant::find($id);

        if (!$menujenisplant) {
            return false;
        }

        $menujenisplant->status = 0;
        return $menujenisplant->save();
    }
}
