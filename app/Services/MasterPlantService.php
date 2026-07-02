<?php

namespace App\Services;

use App\Models\MasterPlant;
use Illuminate\Database\Eloquent\Collection;

class MasterPlantService
{
    public function getAllActive(): Collection
    {
        return MasterPlant::where('status', 1)->get();
    }

    public function createMasterPlant(array $data): MasterPlant
    {
        return MasterPlant::create([
            'kode'  => strtoupper($data['kode']),
            'plant' => strtoupper($data['plant'])
        ]);
    }

    public function updateMasterPlant(int $id, array $data): ?MasterPlant
    {
        $masterplant = MasterPlant::find($id);

        if (!$masterplant) {
            return null;
        }

        $masterplant->update([
            'kode'  => strtoupper($data['kode']),
            'plant' => strtoupper($data['plant']),

        ]);

        return $masterplant;
    }

    public function deleteMasterPlant(int $id): bool
    {
        $masterplant = MasterPlant::find($id);

        if (!$masterplant) {
            return false;
        }

        $masterplant->status = 0;
        return $masterplant->save();
    }
}
