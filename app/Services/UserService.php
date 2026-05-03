<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function getAllActive(): Collection
    {
        return User::with(['role', 'pegawai','permissions'])->where('status', 1)->get();
    }

    /**
     * Update data user dengan ValidationException
     */
    public function updateUser(int $id, array $data): User
    {
        $user = User::find($id);

        if (!$user) {
            // Jika user tidak ditemukan, lempar error validasi pada field 'id'
            throw ValidationException::withMessages([
                'id' => ['User tidak ditemukan.'],
            ]);
        }

        // Cek Password Baru vs Password Lama
        if (!empty($data['password'])) {
            try {
                // Gunakan Hash::check hanya jika format di DB adalah hash valid
                if (Hash::info($user->password)['algoName'] !== 'unknown') {
                    if (Hash::check($data['password'], $user->password)) {
                        throw ValidationException::withMessages([
                            'password' => ['Password baru tidak boleh sama dengan password lama.'],
                        ]);
                    }
                }
            } catch (\Exception $e) {
                // Jika error karena 'Password sama', lempar ke atas
                if ($e instanceof ValidationException) throw $e;
                // Selain itu (misal data lama plain text), biarkan proses lanjut
            }

            $user->password = Hash::make($data['password']);
        }

        // Update data lainnya
        $user->email = $data['email'] ?? $user->email;
        $user->role_id = $data['role_id'] ?? $user->role_id;
        $user->status = 1;
        $user->save();

        return $user;
    }
}
