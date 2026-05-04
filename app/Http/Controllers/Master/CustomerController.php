<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\CustomerService;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected CustomerService $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function getCustomer()
    {
        $data = $this->customerService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data customer tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data customer berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function storeCustomer(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:255',
            'kontak' => 'required|max:255',
            'alamat' => 'required|max:255',
        ]);

        $customer = $this->customerService->createCustomer($request->all());

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data customer berhasil disimpan',
            'data'      => $customer
        ], 201);
    }

    public function updateCustomer(Request $request)
    {
        $request->validate([
            'nama' => 'required|max:255',
            'kontak' => 'required|max:255',
            'alamat' => 'required|max:255',
        ]);

        $customer = $this->customerService->updateCustomer($request->id, $request->all());

        if (!$customer) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data customer tidak ditemukan',
                'data'      => null
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data customer berhasil diupdate',
            'data'      => $customer
        ], 200);
    }

    public function deleteCustomer(Request $request)
    {
        $deleted = $this->customerService->deleteCustomer($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data customer tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data customer berhasil dihapus',
        ], 200);
    }
}
