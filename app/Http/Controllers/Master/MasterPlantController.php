<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\MasterPlantService;
use Illuminate\Http\Request;

class MasterPlantController extends Controller
{
    protected MasterPlantService $masterplantService;

    public function __construct(MasterPlantService $masterplantService)
    {
        $this->masterplantService = $masterplantService;
    }

    public function getMasterPlant()
    {
        $data = $this->masterplantService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data plant tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data plant berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeMasterPlant(Request $request)
    {
        $request->validate(['plant' => 'required|max:255']);

        $masterplant = $this->masterplantService->createMasterPlant($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data plant berhasil disimpan',
            'data'      => $masterplant
        ], 201);
    }

    public function updateMasterPlant(Request $request)
    {
        $request->validate(['plant' => 'required|max:255']);

        $masterplant = $this->masterplantService->updateMasterPlant($request->id, $request->all());

        if (!$masterplant) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data plant tidak ditemukan',
                'data'      => null
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data plant berhasil diupdate',
            'data'      => $masterplant
        ], 200);
    }

    public function deleteMasterPlant(Request $request)
    {
        $deleted = $this->masterplantService->deleteMasterPlant($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data plant tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data plant berhasil dihapus',
        ], 200);
    }
}
