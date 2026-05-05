<?php

namespace App\Services;

use App\Models\Timbangan;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TimbanganService
{
    /**
     * Logic untuk generate nomor otomatis: YYMMDDXXXX
     */
    private function generateNomor(): string
    {
        $today = Carbon::now()->format('Y-m-d');
        $prefix = Carbon::now()->format('ymd'); // Hasil: 260505

        // Cari nomor terakhir pada hari ini
        $lastRecord = Timbangan::whereDate('tanggal', $today)
            ->orderBy('nomor', 'desc')
            ->first();

        if (!$lastRecord) {
            // Jika belum ada data hari ini, mulai dari 0001
            return $prefix . '0001';
        }

        // Ambil 4 digit terakhir, tambah 1
        $lastNumber = substr($lastRecord->nomor, -4);
        $nextNumber = str_pad((int)$lastNumber + 1, 4, '0', STR_PAD_LEFT);

        return $prefix . $nextNumber;
    }

    /**
     * Mengambil data berdasarkan filter plant dan jenis (IN/OUT)
     */
    public function getFiltered(int $plantId, ?string $jenis = null): Collection
    {
        return Timbangan::with(['material', 'kendaraan', 'driver', 'customer'])
            ->where('masterplant_id', $plantId)
            ->when($jenis, function ($query) use ($jenis) {
                return $query->where('jenis', $jenis);
            })
            ->where('status', 1) // Hanya data aktif
            ->latest()
            ->get();
    }

    /**
     * Update pada fungsi Create
     */
    public function createTimbangan(array $data, int $plantId): Timbangan
    {
        return DB::transaction(function () use ($data, $plantId) {
            return Timbangan::create([
                'nomor'           => $this->generateNomor(), // Otomatis di sini
                'tanggal'         => Carbon::now()->format('Y-m-d'),
                'masterplant_id'  => $plantId,
                'material_id'     => $data['material_id'],
                'kendaraan_id'    => $data['kendaraan_id'],
                'driver_id'       => $data['driver_id'],
                'customer_id'     => $data['customer_id'],
                'jenis'           => $data['jenis'],
                'berattotal'      => $data['berattotal'] ?? 0,
                'beratkendaraan'  => $data['beratkendaraan'] ?? 0,
                'beratmuatan'     => ($data['berattotal'] ?? 0) - ($data['beratkendaraan'] ?? 0),
                'oleh'            => auth()->id(),
                'status'          => 1
            ]);
        });
    }

    /**
     * Soft delete atau ubah status jadi tidak aktif
     */
    public function deleteTimbangan(int $id): bool
    {
        $timbangan = Timbangan::find($id);
        if (!$timbangan) return false;

        $timbangan->status = 0;
        return $timbangan->save();
    }
}
