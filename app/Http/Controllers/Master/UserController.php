<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getUsers()
    {
        $data = $this->userService->getAllActive();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pengguna tidak ditemukan',
                'data'      => []
            ], 404);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data berhasil ditemukan',
            'data'      => $data
        ], 200);
    }

    public function updateUser(Request $request)
    {
        // 1. Validasi Input Dasar
        $request->validate([
            'id'       => 'required|integer',
            'email'    => 'required|email|unique:users,email,' . $request->id,
            'password' => 'nullable|min:6',
            'role_id'  => 'nullable|integer',
        ], [
            'required' => ':attribute wajib diisi !!!',
            'unique'   => ':attribute sudah digunakan',
            'min'      => ':attribute minimal :min karakter'
        ]);

        // 2. Panggil Service
        // Jika di dalam service terjadi ValidationException,
        // Laravel otomatis mengembalikan response 422.
        $user = $this->userService->updateUser((int) $request->id, $request->all());

        return response()->json([
            'success' => true,
            'message' => "Data user berhasil diupdate",
            'data'    => $user
        ], 200);
    }
}
