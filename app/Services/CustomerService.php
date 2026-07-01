<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public static function generateKodeCustomer(): string
    {
        // Panggil model Customer untuk mengambil data terakhir berdasarkan ID terbesar
        $lastCustomer = Customer::orderBy('id', 'desc')->first();

        if (!$lastCustomer) {
            $number = 1;
        } else {
            // Mengambil angka setelah 'CS' (indeks ke-2)
            // Contoh: 'CS000001' akan dipotong dari karakter ke-2 sampai akhir, menghasilkan '000001'
            $lastCode = $lastCustomer->kode;
            $lastNumber = (int) substr($lastCode, 2);
            $number = $lastNumber + 1;
        }

        // Perbaikan format angka menjadi 6 digit (contoh: 000001)
        $formattedNumber = str_pad($number, 6, '0', STR_PAD_LEFT);

        // Menggabungkan prefix 'CS' dengan angka yang sudah di-format
        return 'CS' . $formattedNumber;
    }

    public function getAllActive(): Collection
    {
        return Customer::with(['masterplants'])->where('status', 1)->get();
    }

    public function createCustomer(array $data): Customer
    {
        // Menggunakan DB::transaction agar jika salah satu proses error, database tidak corupt
        return DB::transaction(function () use ($data) {

            // 1. Simpan data utama ke tabel customer
            $customer = Customer::create([
                'kode' => self::generateKodeCustomer(),
                'nama' => strtoupper($data['nama']),
                'email' => $data['email'],
                'kontak' => $data['kontak'],
                'alamat' => strtoupper($data['alamat']),
                'oleh' => Auth::id()
            ]);

            // 2. Otomatis input ke tabel groupcustomer (pivot) jika ada data masterplant_ids
            // Pastikan di front-end (Vue.js) Anda mengirimkan array ID seperti: masterplant_ids: [1, 2, 3]
            if (isset($data['masterplant_ids']) && is_array($data['masterplant_ids'])) {
                $customer->masterplants()->attach($data['masterplant_ids']);
            }

            return $customer;
        });
    }

    public function updateCustomer(int $id, array $data): ?Customer
    {
        // Menggunakan DB::transaction untuk memastikan data utama dan pivot aman ter-update bersamaan
        return DB::transaction(function () use ($id, $data) {
            $customer = Customer::find($id);

            if (!$customer) {
                return null;
            }

            // 1. Update data profil utama customer
            $customer->update([
                'kode' => $data['kode'] ?? $customer->kode, // Mempertahankan kode lama jika tidak diubah
                'nama' => strtoupper($data['nama']),
                'kontak' => $data['kontak'],
                'alamat' => strtoupper($data['alamat']),
                'oleh' => Auth::id()
            ]);

            // 2. OTOMATIS UPDATE TABLE PIVOT (groupcustomer)
            // Pastikan parameter yang dilempar dari controller membawa array 'masterplant_ids'
            if (isset($data['masterplant_ids']) && is_array($data['masterplant_ids'])) {
                // sync() akan menghapus relasi lama yang tidak terpilih dan menambah relasi baru yang dicentang
                $customer->masterplants()->sync($data['masterplant_ids']);
            } else {
                // Jika user mengosongkan semua checkbox masterplant (opsional, tergantung kebijakan bisnis)
                $customer->masterplants()->detach();
            }

            return $customer;
        });
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
