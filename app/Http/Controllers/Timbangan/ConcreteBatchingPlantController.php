<?php

namespace App\Http\Controllers\Timbangan;

use App\Http\Controllers\Controller;
use App\Models\MenuJenisPlant;
use App\Services\TimbanganService;
// use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ConcreteBatchingPlantController extends Controller
{
    /**
     * Kita definisikan ID Master Plant di sini.
     * Misal di tabel masterplant, Stone Crusher memiliki ID = 1
     */
    protected int $plantId = 2;
    protected TimbanganService $timbanganService;

    public function __construct(TimbanganService $timbanganService)
    {
        $this->timbanganService = $timbanganService;
    }

    public function getTimbanganCBP(Request $request)
    {
        $request->validate([
            // Menggunakan 'query' validation jika datanya berasal dari URL parameter
            'menujenisplant_id' => 'integer'
        ]);

        $menuJenisPlantId = $request->input('menujenisplant_id');

        // Cari tab default jika di frontend belum terpilih
        if (!$menuJenisPlantId) {
            $defaultMenu = MenuJenisPlant::where('masterplant_id', $this->plantId)
                ->where('status', 1)
                ->oldest() // <-- Lebih clean dibanding orderBy('id', 'asc')
                ->first();

            $menuJenisPlantId = $defaultMenu ? $defaultMenu->id : null;
        }

        // Oper nilai $this->plantId dari Controller ke Service
        $data = $this->timbanganService->getFiltered($this->plantId, $menuJenisPlantId);

        if ($data->isEmpty()) {
            return response()->json([
                'status'  => 404,
                'success' => false,
                'message' => 'Data timbangan tidak ditemukan',
                'data'    => []
            ], 200);
        }

        return response()->json([
            'status'  => 200,
            'success' => true,
            'data' => $data
        ], 200);
    }

    public function getMenuJenisCBP()
    {
        $data = $this->timbanganService->getMenuJenisByPlant($this->plantId);

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
