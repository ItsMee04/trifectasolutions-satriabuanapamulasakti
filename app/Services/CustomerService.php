<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class CustomerService
{
    public static function generateKodeCustomer(): string
    {
        // Perbaikan: Panggil model Customer, bukan self
        $lastCustomer = Customer::orderBy('id', 'desc')->first();

        if (!$lastCustomer) {
            $number = 1;
        } else {
            // Mengambil angka setelah 'CUS-' (indeks ke-4)
            $lastCode = $lastCustomer->kode;
            $lastNumber = (int) substr($lastCode, 4);
            $number = $lastNumber + 1;
        }

        // Format angka menjadi 3 digit (contoh: 001)
        $formattedNumber = str_pad($number, 3, '0', STR_PAD_LEFT);

        return 'CUS-' . $formattedNumber;
    }

    public function getAllActive(): Collection
    {
        return Customer::where('status', 1)->get();
    }

    public function createCustomer(array $data): Customer
    {
        return Customer::create([
            // Otomatis generate kode di sini jika tidak dikirim dari front-end
            'kode' => self::generateKodeCustomer(),
            'nama' => strtoupper($data['nama']),
            'kontak' => $data['kontak'],
            'alamat' => strtoupper($data['alamat']),
            'oleh' => Auth::id()
        ]);
    }

    public function updateCustomer(int $id, array $data): ?Customer
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return null;
        }

        $customer->update([
            // Umumnya kode tidak diubah saat update,
            // tapi jika tetap ingin bisa diubah, gunakan $data['kode']
            'kode' => $data['kode'] ?? $customer->kode,
            'nama' => strtoupper($data['nama']),
            'kontak' => $data['kontak'],
            'alamat' => strtoupper($data['alamat']),
            'oleh' => Auth::id() // Pastikan Anda menggunakan ID user yang sedang login sebagai 'oleh'
        ]);

        return $customer;
    }

    public function deleteCustomer(int $id): bool
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return false;
        }

        $customer->status = 0;
        return $customer->save();
    }
}
