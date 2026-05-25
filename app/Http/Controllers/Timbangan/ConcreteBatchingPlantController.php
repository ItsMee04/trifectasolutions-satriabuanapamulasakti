<?php

namespace App\Http\Controllers\Timbangan;

use App\Http\Controllers\Controller;
use App\Models\MenuJenisPlant;
use App\Services\TimbanganBahanBakarConcreteBatchingPlantService;
use App\Services\TimbanganBesiConcreteBatchingPlantService;
use App\Services\TimbanganKarsoUditchConcreteBatchingPlantService;
use App\Services\TimbanganMaterialConcreteBatchingPlantService;
use App\Services\TimbanganMaterialRenovasiPlantConcreteBatchingPlantService;
use App\Services\TimbanganObatConcreteBatchingPlantService;
use App\Services\TimbanganReadyMixConcreteBatchingPlantService;
use App\Services\TimbanganSemenConcreteBatchingPlantService;
use App\Services\TimbanganUditchKanstinConcreteBatchingPlantService;
use Illuminate\Http\Request;

class ConcreteBatchingPlantController extends Controller
{
    /**
     * Kita definisikan ID Master Plant di sini.
     * Misal di tabel masterplant, Stone Crusher memiliki ID = 1
     */
    protected int $plantId = 2;
    protected TimbanganMaterialConcreteBatchingPlantService $timbanganmaterialconcretebatchingplantService;
    protected TimbanganSemenConcreteBatchingPlantService $timbangansemenconcretebatchingplantService;
    protected TimbanganBahanBakarConcreteBatchingPlantService $timbanganbahanbakarconcretebatchingplantService;
    protected TimbanganObatConcreteBatchingPlantService $timbanganobatconcretebatchingplantService;
    protected TimbanganReadyMixConcreteBatchingPlantService $timbanganreadymixconcretebatchingplantService;
    protected TimbanganUditchKanstinConcreteBatchingPlantService $timbanganuditchkanstinconcretebatchingplantService;
    protected TimbanganKarsoUditchConcreteBatchingPlantService $timbanganKarsoUditchConcreteBatchingPlantService;
    protected TimbanganBesiConcreteBatchingPlantService $timbanganBesiConcreteBatchingPlantService;
    protected TimbanganMaterialRenovasiPlantConcreteBatchingPlantService $timbanganMaterialRenovasiPlantConcreteBatchingPlantService;

    public function __construct(
        TimbanganMaterialConcreteBatchingPlantService $timbanganmaterialconcretebatchingplantService,
        TimbanganSemenConcreteBatchingPlantService $timbangansemenconcretebatchingplantService,
        TimbanganBahanBakarConcreteBatchingPlantService $timbanganbahanbakarconcretebatchingplantService,
        TimbanganObatConcreteBatchingPlantService $timbanganobatconcretebatchingplantService,
        TimbanganReadyMixConcreteBatchingPlantService $timbanganreadymixconcretebatchingplantService,
        TimbanganUditchKanstinConcreteBatchingPlantService $timbanganuditchkanstinconcretebatchingplantService,
        TimbanganKarsoUditchConcreteBatchingPlantService $timbanganKarsoUditchConcreteBatchingPlantService,
        TimbanganBesiConcreteBatchingPlantService $timbanganBesiConcreteBatchingPlantService,
        TimbanganMaterialRenovasiPlantConcreteBatchingPlantService $timbanganMaterialRenovasiPlantConcreteBatchingPlantService
    ) {
        $this->timbanganmaterialconcretebatchingplantService = $timbanganmaterialconcretebatchingplantService;
        $this->timbangansemenconcretebatchingplantService = $timbangansemenconcretebatchingplantService;
        $this->timbanganbahanbakarconcretebatchingplantService = $timbanganbahanbakarconcretebatchingplantService;
        $this->timbanganobatconcretebatchingplantService = $timbanganobatconcretebatchingplantService;
        $this->timbanganreadymixconcretebatchingplantService = $timbanganreadymixconcretebatchingplantService;
        $this->timbanganuditchkanstinconcretebatchingplantService = $timbanganuditchkanstinconcretebatchingplantService;
        $this->timbanganKarsoUditchConcreteBatchingPlantService = $timbanganKarsoUditchConcreteBatchingPlantService;
        $this->timbanganBesiConcreteBatchingPlantService = $timbanganBesiConcreteBatchingPlantService;
        $this->timbanganMaterialRenovasiPlantConcreteBatchingPlantService = $timbanganMaterialRenovasiPlantConcreteBatchingPlantService;
    }

    public function getTimbanganMaterialCBP(Request $request)
    {
        $request->validate([
            'menujenisplant_id' => 'required|integer'
        ]);

        $menuJenisPlantId = $request->menujenisplant_id;

        // Ambil data menu jenis
        $menuJenisPlant = MenuJenisPlant::find($menuJenisPlantId);

        if (!$menuJenisPlant) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Menu jenis plant tidak ditemukan',
                'data' => []
            ], 200);
        }

        /**
         * Mapping service berdasarkan menujenisplant_id
         * atau bisa juga berdasarkan nama/kode menu
         */
        switch ($menuJenisPlantId) {

            case 3:
                $data = $this->timbanganmaterialconcretebatchingplantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 4:
                $data = $this->timbanganmaterialconcretebatchingplantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 5:
                $data = $this->timbangansemenconcretebatchingplantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 6:
                $data = $this->timbanganbahanbakarconcretebatchingplantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 7:
                $data = $this->timbanganobatconcretebatchingplantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 8:
                $data = $this->timbanganreadymixconcretebatchingplantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 9:
                $data = $this->timbanganuditchkanstinconcretebatchingplantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 10:
                $data = $this->timbanganKarsoUditchConcreteBatchingPlantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 11:
                $data = $this->timbanganBesiConcreteBatchingPlantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            case 12:
                $data = $this->timbanganMaterialRenovasiPlantConcreteBatchingPlantService
                    ->getFiltered($this->plantId, $menuJenisPlantId);
                break;

            default:
                return response()->json([
                    'status' => 400,
                    'success' => false,
                    'message' => 'Menu jenis plant tidak valid',
                    'data' => []
                ], 200);
        }

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data timbangan tidak ditemukan',
                'data' => []
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function getMenuJenisCBP()
    {
        $data = $this->timbanganmaterialconcretebatchingplantService->getMenuJenisByPlant($this->plantId);

        if ($data->isEmpty()) {
            return response()->json([
                'status'  => 404,
                'success' => false,
                'message' => 'Data menu jenis tidak ditemukan',
                'data'    => []
            ], 200);
        }

        return response()->json([
            'status'  => 200,
            'success' => true,
            'message' => 'Data menu jenis berhasil ditemukan',
            'data'    => $data
        ], 200);
    }
}
