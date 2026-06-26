<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\ShiloService;
use Illuminate\Http\Request;

class ShiloController extends Controller
{
    protected ShiloService $shiloService;

    public function __construct(ShiloService $shiloService)
    {
        $this->shiloService = $shiloService;
    }

    public function getShilo()
    {
        $data = $this->shiloService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data shilo tidak ditemukan',
                'data'      => []
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data shilo berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeShilo(Request $request)
    {
        $request->validate([
            'shilo' => 'required|integer',
        ]);

        $shilo = $this->shiloService->createShilo($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data shilo berhasil disimpan',
            'data'      => $shilo
        ], 201);
    }
}
