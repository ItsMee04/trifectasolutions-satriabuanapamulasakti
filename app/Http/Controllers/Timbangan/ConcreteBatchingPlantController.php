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
use Illuminate\Database\Eloquent\ModelNotFoundException;
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

    public function getTimbanganCBP(Request $request)
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

    public function storeTimbanganCBP(Request $request)
    {
        // 1. Validasi awal untuk memastikan ID menu dikirim dan berupa angka
        $request->validate([
            'menujenisplant_id' => 'required|integer'
        ]);

        $menuJenisPlantId = $request->menujenisplant_id;

        // Ambil data menu jenis plant untuk memastikan menu tersebut terdaftar
        $menuJenisPlant = MenuJenisPlant::find($menuJenisPlantId);
        if (!$menuJenisPlant) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Menu jenis plant tidak ditemukan',
                'data' => []
            ], 200); // Mengikuti pola response error project kamu (200 OK dengan status 404 didalam body)
        }

        try {
            // 2. Mapping Service & Validasi Spesifik Berdasarkan menujenisplant_id
            switch ($menuJenisPlantId) {

                case 3: // MATERIAL IN
                case 4: // MATERIAL OUT
                    // Validasi khusus untuk rumpun timbangan material
                    $payload = $request->validate([
                        'tanggal'           => 'required|date',
                        'material'          => 'required|integer',
                        'kendaraan'         => 'required|integer',
                        'driver'            => 'required|integer',
                        'customer'          => 'nullable|integer',
                        'suplier'           => 'nullable|integer',
                        'berattotal'        => 'required',
                        'beratkendaraan'    => 'required',
                    ]);

                    $timbangan = $this->timbanganmaterialconcretebatchingplantService
                        ->createTimbanganMaterial($request->all(), $this->plantId, $menuJenisPlantId);
                    break;

                // case 5: // SEMEN
                //     // Contoh jika validasi semen berbeda (misal: butuh silo / vendor khusus)
                //     $payload = $request->validate([
                //         'tanggal'   => 'required|date',
                //         'semen_id'  => 'required|integer',
                //         // tambahkan field semen lainnya disini...
                //     ]);

                //     $timbangan = $this->timbangansemenconcretebatchingplantService
                //         ->createTimbanganSemen($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 6: // BAHAN BAKAR
                //     $timbangan = $this->timbanganbahanbakarconcretebatchingplantService
                //         ->createTimbanganBahanBakar($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 7: // OBAT
                //     $timbangan = $this->timbanganobatconcretebatchingplantService
                //         ->createTimbanganObat($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 8: // READY MIX
                //     $timbangan = $this->timbanganreadymixconcretebatchingplantService
                //         ->createTimbanganReadyMix($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 9: // U-DITCH & KANSTIN
                //     $timbangan = $this->timbanganuditchkanstinconcretebatchingplantService
                //         ->createTimbanganUDitchKanstin($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 10: // KARSO & U-DITCH
                //     $timbangan = $this->timbanganKarsoUditchConcreteBatchingPlantService
                //         ->createTimbanganKarsoUditch($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 11: // BESI
                //     $timbangan = $this->timbanganBesiConcreteBatchingPlantService
                //         ->createTimbanganBesi($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 12: // MATERIAL RENOVASI PLANT
                //     $timbangan = $this->timbanganMaterialRenovasiPlantConcreteBatchingPlantService
                //         ->createTimbanganRenovasi($request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                default:
                    return response()->json([
                        'status' => 400,
                        'success' => false,
                        'message' => 'Menu jenis plant tidak valid untuk menyimpan data',
                        'data' => []
                    ], 200);
            }

            // 3. Response Berhasil
            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => 'Data timbangan ' . $menuJenisPlant->menujenis . ' berhasil disimpan',
                'data'    => $timbangan
            ], 200);
        } catch (\Exception $e) {
            // 4. Response Gagal Interal Server
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateTimbanganCBP(Request $request)
    {
        // 1. Validasi awal untuk memastikan ID Data dan ID Menu dikirim
        $request->validate([
            'id'                => 'required|integer|exists:timbangan,id',
            'menujenisplant_id' => 'required|integer'
        ]);

        $menuJenisPlantId = $request->menujenisplant_id;

        // Ambil data menu jenis plant untuk memastikan menu tersebut terdaftar
        $menuJenisPlant = MenuJenisPlant::find($menuJenisPlantId);
        if (!$menuJenisPlant) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Menu jenis plant tidak ditemukan',
                'data' => []
            ], 200);
        }

        try {
            // 2. Mapping Service & Validasi Spesifik Berdasarkan menujenisplant_id
            switch ($menuJenisPlantId) {

                case 3: // MATERIAL IN
                case 4: // MATERIAL OUT
                    // Validasi khusus rumpun timbangan material
                    $payload = $request->validate([
                        'tanggal'        => 'required|date',
                        'material'       => 'required|integer',
                        'kendaraan'      => 'required|integer',
                        'driver'         => 'required|integer',
                        'suplier'        => 'nullable|integer',
                        'customer'       => 'nullable|integer',
                        'berattotal'     => 'required',
                        'beratkendaraan' => 'required',
                    ]);

                    $timbangan = $this->timbanganmaterialconcretebatchingplantService
                        ->updateTimbanganMaterial($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                    break;

                // case 5: // SEMEN
                //     $payload = $request->validate([
                //         'tanggal'  => 'required|date',
                //         'semen_id' => 'required|integer',
                //         // field semen lainnya...
                //     ]);

                //     $timbangan = $this->timbangansemenconcretebatchingplantService
                //         ->updateTimbanganSemen($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 6: // BAHAN BAKAR
                //     $timbangan = $this->timbanganbahanbakarconcretebatchingplantService
                //         ->updateTimbanganBahanBakar($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 7: // OBAT
                //     $timbangan = $this->timbanganobatconcretebatchingplantService
                //         ->updateTimbanganObat($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 8: // READY MIX
                //     $timbangan = $this->timbanganreadymixconcretebatchingplantService
                //         ->updateTimbanganReadyMix($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 9: // U-DITCH & KANSTIN
                //     $timbangan = $this->timbanganuditchkanstinconcretebatchingplantService
                //         ->updateTimbanganUDitchKanstin($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 10: // KARSO & U-DITCH
                //     $timbangan = $this->timbanganKarsoUditchConcreteBatchingPlantService
                //         ->updateTimbanganKarsoUditch($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 11: // BESI
                //     $timbangan = $this->timbanganBesiConcreteBatchingPlantService
                //         ->updateTimbanganBesi($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                // case 12: // MATERIAL RENOVASI PLANT
                //     $timbangan = $this->timbanganMaterialRenovasiPlantConcreteBatchingPlantService
                //         ->updateTimbanganRenovasi($request->id, $request->all(), $this->plantId, $menuJenisPlantId);
                //     break;

                default:
                    return response()->json([
                        'status' => 400,
                        'success' => false,
                        'message' => 'Menu jenis plant tidak valid untuk memperbarui data',
                        'data' => []
                    ], 200);
            }

            // 3. Response Berhasil
            return response()->json([
                'status'  => 200,
                'success' => true,
                'message' => 'Data timbangan ' . $menuJenisPlant->menujenis . ' berhasil diperbarui',
                'data'    => $timbangan
            ], 200);
        } catch (ModelNotFoundException $e) {
            // Response jika data ID timbangan tidak ditemukan di database/service
            return response()->json([
                'status'  => 404,
                'success' => false,
                'message' => 'Data tidak ditemukan atau Anda tidak memiliki akses.',
            ], 404);
        } catch (\Exception $e) {
            // Response jika terjadi kesalahan sistem/query internal
            return response()->json([
                'status'  => 500,
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteTimbanganCBP(Request $request)
    {
        // 1. Validasi awal untuk memastikan ID data dan ID menu dikirim
        $request->validate([
            'id'                => 'required|integer',
            'menujenisplant_id' => 'required|integer'
        ]);

        $menuJenisPlantId = $request->menujenisplant_id;
        $id = (int) $request->input('id');

        // Ambil data menu jenis plant untuk memastikan menu tersebut valid
        $menuJenisPlant = MenuJenisPlant::find($menuJenisPlantId);
        if (!$menuJenisPlant) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Menu jenis plant tidak ditemukan',
            ], 200);
        }

        try {
            // 2. Mapping Service Penghapusan Berdasarkan menujenisplant_id
            switch ($menuJenisPlantId) {

                case 3: // MATERIAL IN
                case 4: // MATERIAL OUT
                    $deleted = $this->timbanganmaterialconcretebatchingplantService
                        ->deleteTimbanganMaterial($id);
                    break;

                // case 5: // SEMEN
                //     $deleted = $this->timbangansemenconcretebatchingplantService
                //         ->deleteTimbanganSemen($id);
                //     break;

                // case 6: // BAHAN BAKAR
                //     $deleted = $this->timbanganbahanbakarconcretebatchingplantService
                //         ->deleteTimbanganBahanBakar($id);
                //     break;

                // case 7: // OBAT
                //     $deleted = $this->timbanganobatconcretebatchingplantService
                //         ->deleteTimbanganObat($id);
                //     break;

                // case 8: // READY MIX
                //     $deleted = $this->timbanganreadymixconcretebatchingplantService
                //         ->deleteTimbanganReadyMix($id);
                //     break;

                // case 9: // U-DITCH & KANSTIN
                //     $deleted = $this->timbanganuditchkanstinconcretebatchingplantService
                //         ->deleteTimbanganUDitchKanstin($id);
                //     break;

                // case 10: // KARSO & U-DITCH
                //     $deleted = $this->timbanganKarsoUditchConcreteBatchingPlantService
                //         ->deleteTimbanganKarsoUditch($id);
                //     break;

                // case 11: // BESI
                //     $deleted = $this->timbanganBesiConcreteBatchingPlantService
                //         ->deleteTimbanganBesi($id);
                //     break;

                // case 12: // MATERIAL RENOVASI PLANT
                //     $deleted = $this->timbanganMaterialRenovasiPlantConcreteBatchingPlantService
                //         ->deleteTimbanganRenovasi($id);
                //     break;

                default:
                    return response()->json([
                        'status' => 400,
                        'success' => false,
                        'message' => 'Menu jenis plant tidak valid untuk menghapus data',
                    ], 200);
            }

            // 3. Cek apakah baris data berhasil dihapus/diubah statusnya oleh service
            if (!$deleted) {
                return response()->json([
                    'status'    => 404,
                    'success'   => false,
                    'message'   => 'Data timbangan ' . $menuJenisPlant->menujenis . ' tidak ditemukan atau sudah tidak aktif',
                ], 404);
            }

            // 4. Response Berhasil
            return response()->json([
                'status'    => 200,
                'success'   => true,
                'message'   => 'Data timbangan ' . $menuJenisPlant->menujenis . ' berhasil dihapus',
            ], 200);
        } catch (\Exception $e) {
            // 5. Response Gagal Sistem
            return response()->json([
                'status'    => 500,
                'success'   => false,
                'message'   => 'Gagal menghapus data: ' . $e->getMessage(),
            ], 500);
        }
    }
}
