<?php

namespace App\Services;

use App\Models\MenuJenisPlant;

class TimbanganMaterialConcreteBatchingPlantService
{
    protected GenerateKodeService $generateKodeService;
    public function __construct()
    {
        $this->generateKodeService = new GenerateKodeService();
    }

    public function getMenuJenisByPlant(int $plantId)
    {
        return MenuJenisPlant::with('masterplant')
            ->where('masterplant_id', $plantId)
            ->where('status', 1)
            ->orderBy('id', 'asc')
            ->get();
    }
}
