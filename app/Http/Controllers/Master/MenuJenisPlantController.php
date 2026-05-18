<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\MenuJenisPlantService;
use Illuminate\Http\Request;

class MenuJenisPlantController extends Controller
{
    protected MenuJenisPlantService $menujenisplantService;

    public function __construct(MenuJenisPlantService $menujenisplantService)
    {
        $this->menujenisplantService = $menujenisplantService;
    }

    public function getMenuJenisPlant()
    {
        $menujenisplants = $this->menujenisplantService->getAllActive();

        if ($menujenisplants->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data menu jenis plant tidak ditemukan',
                'data'      => []
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data menu jenis plant berhasil ditemukan',
            'data'      => $menujenisplants
        ], 200);
    }

    public function storeMenuJenisPlant(Request $request)
    {
        $data = $request->validate([
            'masterplant_id' => 'required|exists:masterplant,id',
            'menujenis' => 'required|string|max:100'
        ]);

        $menujenisplant = $this->menujenisplantService->createMenuJenisPlant($data);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data menu jenis plant berhasil disimpan',
            'data'      => $menujenisplant
        ], 201);
    }

    public function updateMenuJenisPlant(Request $request)
    {
        $data = $request->validate([
            'masterplant_id' => 'required|exists:masterplant,id',
            'menujenis' => 'required|string|max:100'
        ]);

        $menujenisplant = $this->menujenisplantService->updateMenuJenisPlant($request->id, $data);

        if (!$menujenisplant) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data menu jenis plant tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data menu jenis plant berhasil diperbarui',
            'data'      => $menujenisplant
        ], 200);
    }

    public function deleteMenuJenisPlant(Request $request)
    {
        $result = $this->menujenisplantService->deleteMenuJenisPlant($request->id);

        if (!$result) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data menu jenis plant tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data menu jenis plant berhasil dihapus'
        ], 200);
    }
}
