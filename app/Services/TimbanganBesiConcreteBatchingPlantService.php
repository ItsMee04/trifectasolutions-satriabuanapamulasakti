<?php

namespace App\Services;

use App\Models\MenuJenisPlant;
use App\Models\Timbangan;
use Illuminate\Database\Eloquent\Collection;

class TimbanganBesiConcreteBatchingPlantService
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

    /**
     * Mengambil data berdasarkan filter plant dan jenis (IN/OUT)
     */
    public function getFiltered(int $plantId, ?int $menuJenisPlantId = null): Collection
    {
        return Timbangan::with([
            'timbanganbesi.material',
            'timbanganbesi.kendaraan',
            'timbanganbesi.driver',
            'timbanganbesi.customer',
            'timbanganbesi.suplier',
        ])
            ->where('masterplant_id', $plantId) // <--- Menggunakan parameter dinamis
            ->when($menuJenisPlantId, function ($query) use ($menuJenisPlantId) {
                return $query->where('menujenisplant_id', $menuJenisPlantId);
            })
            ->where('status', 1)
            ->oldest()
            ->get();
    }
}
