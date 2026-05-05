<?php

namespace App\Http\Controllers\Timbangan;

use App\Http\Controllers\Controller;
use App\Services\TimbanganService;
use Illuminate\Http\Request;

class StoneCrusherController extends Controller
{
    /**
     * Kita definisikan ID Master Plant di sini.
     * Misal di tabel masterplant, Stone Crusher memiliki ID = 1
     */
    protected int $plantId = 1;
    protected TimbanganService $timbanganService;

    public function __construct(TimbanganService $timbanganService)
    {
        $this->timbanganService = $timbanganService;
    }

    public function getTimbanganSC(Request $request)
    {
        // Jenis diambil dari request (?jenis=IN)
        $data = $this->timbanganService->getFiltered($this->plantId, $request->jenis);

        if ($data->isEmpty()) {
            return response()->json([
                'status'  => 404,
                'success' => false,
                'message' => 'Data timbangan tidak ditemukan',
                'data'    => []
            ], 404);
        }

        return response()->json([
            'status'  => 200,
            'success' => true,
            'message' => 'Data timbangan berhasil ditemukan',
            'data'    => $data
        ], 200);
    }
}
