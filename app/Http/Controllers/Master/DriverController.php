<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\DriverService;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    protected DriverService $driverService;

    public function __construct(DriverService $driverService)
    {
        $this->driverService = $driverService;
    }

    public function getDriver()
    {
        $data = $this->driverService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data driver tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data driver berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeDriver(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:255',
            'kontak' => 'required|max:255',
            'alamat' => 'required|max:255',
            'rekening' => 'required|max:255'
        ]);

        $driver = $this->driverService->createDriver($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data driver berhasil disimpan',
            'data'      => $driver
        ], 201);
    }

    public function updateDriver(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:255',
            'kontak' => 'required|max:255',
            'alamat' => 'required|max:255',
            'rekening' => 'required|max:255'
        ]);

        $driver = $this->driverService->updateDriver($request->id, $request->all());

        if (!$driver) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data driver tidak ditemukan',
                'data'      => null
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data driver berhasil diupdate',
            'data'      => $driver
        ], 200);
    }

    public function deleteDriver(Request $request)
    {
        $deleted = $this->driverService->deleteDriver($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data driver tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data driver berhasil dihapus',
        ], 200);
    }
}
