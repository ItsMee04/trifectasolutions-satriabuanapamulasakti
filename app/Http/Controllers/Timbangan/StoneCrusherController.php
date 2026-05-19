<?php

namespace App\Http\Controllers\Timbangan;

use App\Http\Controllers\Controller;
use App\Models\MenuJenisPlant;
use App\Services\TimbanganService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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

    public function getMenuJenisSC()
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

    public function storeTimbanganSC(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'tanggal'        => 'required|date',
            'material'       => 'required|integer',
            'kendaraan'      => 'required|integer',
            'driver'         => 'required|integer',
            'suplier'        => 'required|integer',
            'menujenisplant_id' => 'required|integer',
            'berattotal'     => 'required',
            'beratkendaraan' => 'required',
        ]);

        try {
            // 2. Panggil Service
            $timbangan = $this->timbanganService->createTimbangan($request->all(), $this->plantId, $request->menujenisplant_id);

            // 3. Response Berhasil
            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => 'Data timbangan berhasil disimpan',
                'data'    => $timbangan
            ], 200);
        } catch (\Exception $e) {
            // 4. Response Gagal
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateTimbanganSC(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'id'             => 'required|integer|exists:timbangan,id',
            'tanggal'        => 'required|date',
            'material'       => 'required|integer',
            'kendaraan'      => 'required|integer',
            'driver'         => 'required|integer',
            'suplier'        => 'required|integer',
            'menujenisplant_id' => 'required|integer',
            'berattotal'     => 'required',
            'beratkendaraan' => 'required',
        ]);

        try {
            // 2. Panggil Service Update
            $timbangan = $this->timbanganService->updateTimbangan(
                $request->id,
                $request->all(),
                $this->plantId,
                $request->menujenisplant_id
            );

            // 3. Response
            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => 'Data timbangan berhasil diperbarui',
                'data'    => $timbangan
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status'  => 404,
                'success' => false,
                'message' => 'Data tidak ditemukan atau Anda tidak memiliki akses.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteTimbanganSC(Request $request)
    {
        // 1. Validasi untuk memastikan 'id' ada dan berupa angka
        // Ini juga mencegah 'null' terkirim ke Service
        $request->validate([
            'id' => 'required|integer'
        ]);

        try {
            // 2. Ambil ID dan paksa menjadi integer (casting)
            $id = (int) $request->input('id');

            $deleted = $this->timbanganService->deleteTimbangan($id);

            if (!$deleted) {
                return response()->json([
                    'status'    => 404,
                    'success'   => false,
                    'message'   => 'Data timbangan tidak ditemukan atau sudah tidak aktif',
                ], 404);
            }

            return response()->json([
                'status'    => 200,
                'success'   => true,
                'message'   => 'Data timbangan berhasil dihapus',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'    => 500,
                'success'   => false,
                'message'   => 'Gagal menghapus data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
