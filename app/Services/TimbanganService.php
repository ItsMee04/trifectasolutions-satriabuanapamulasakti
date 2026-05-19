<?php

namespace App\Services;

use App\Models\MenuJenisPlant;
use App\Models\Timbangan;
use App\Models\TimbanganMaterial;
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

    public function getMenuJenisByPlant(int $plantId)
    {
        return MenuJenisPlant::with('masterplant')
            ->where('masterplant_id', $plantId)
            ->where('status', 1)
            ->orderBy('id', 'asc')
            ->get();
    }

    /**
     * Mengambil data berdasarkan filter plant dan jenis (IN/OUT)
     */
    public function getFiltered(int $plantId, ?int $menuJenisPlantId = null): Collection
    {
        return Timbangan::with([
            'timbanganmaterial',
            'timbanganmaterial.material',
            'timbanganmaterial.kendaraan',
            'timbanganmaterial.driver',
            'timbanganmaterial.customer'
        ])
            ->where('masterplant_id', $plantId) // <--- Menggunakan parameter dinamis
            ->when($menuJenisPlantId, function ($query) use ($menuJenisPlantId) {
                return $query->where('menujenisplant_id', $menuJenisPlantId);
            })
            ->where('status', 1)
            ->latest()
            ->get();
    }

    /**
     * Update pada fungsi Create
     */
    public function createTimbangan(array $data, int $plantId, int $menuJenisPlantId): Timbangan
    {
        DB::beginTransaction();

        try {

            // Bersihkan angka
            $beratTotal = (float) str_replace(',', '', $data['berattotal'] ?? 0);
            $beratKendaraan = (float) str_replace(',', '', $data['beratkendaraan'] ?? 0);
            $beratMuatan = $beratTotal - $beratKendaraan;

            /**
             * HEADER
             */
            $timbangan = Timbangan::create([
                'nomor'          => $this->generateNomor(),
                'tanggal'        => $data['tanggal'],
                'masterplant_id' => $plantId,
                'menujenisplant_id' => $menuJenisPlantId,
                'oleh'           => auth()->id(),
                'status'         => 1,
            ]);

            /**
             * VALIDASI BISNIS
             */
            if ($beratMuatan <= 0) {
                throw new \Exception('Berat muatan tidak valid');
            }

            /**
             * DETAIL
             */
            TimbanganMaterial::create([
                'timbangan_id'    => $timbangan->id,
                'material_id'     => $data['material'],
                'kendaraan_id'    => $data['kendaraan'],
                'driver_id'       => $data['driver'],
                'customer_id'     => $data['suplier'],
                'beratjenis_id'   => $data['beratjenis'] ?? null,
                'menujenisplant_id' => $data['menujenisplant_id'] ?? null,
                'volume'          => $data['volume'] ?? 0,
                'berattotal'      => $beratTotal,
                'beratkendaraan'  => $beratKendaraan,
                'beratmuatan'     => $beratMuatan,
                'jarakawal'       => $data['jarakawal'] ?? 0,
                'jarakakhir'      => $data['jarakakhir'] ?? 0,
                'oleh'            => auth()->id(),
                'status'          => 1,
            ]);

            DB::commit();

            return $timbangan;
        } catch (\Throwable $e) {

            DB::rollBack();

            throw $e;
        }
    }

    public function updateTimbangan(int $id, array $data, int $plantId, int $menuJenisPlantId): Timbangan
    {
        return DB::transaction(function () use ($id, $data, $plantId, $menuJenisPlantId) {
            // Cari data berdasarkan ID dan Plant agar tidak salah sasaran
            $timbangan = Timbangan::where('id', $id)
                ->where('masterplant_id', $plantId)
                ->firstOrFail();

            // Bersihkan format angka
            $beratTotal = (float) str_replace(',', '', $data['berattotal'] ?? 0);
            $beratKendaraan = (float) str_replace(',', '', $data['beratkendaraan'] ?? 0);
            $beratMuatan = $beratTotal - $beratKendaraan;

            $timbangan->update([
                'tanggal'         => $data['tanggal'] ?? $timbangan->tanggal,
                'menujenisplant_id' => $menuJenisPlantId,
                'material_id'     => $data['material'],
                'kendaraan_id'    => $data['kendaraan'],
                'driver_id'       => $data['driver'],
                'customer_id'     => $data['suplier'],
                'beratjenis_id'   => $data['beratjenis'],
                'berattotal'      => $beratTotal,
                'beratkendaraan'  => $beratKendaraan,
                'beratmuatan'     => $beratMuatan,
                'jarakawal'       => $data['jarakawal'] ?? 0,
                'jarakakhir'      => $data['jarakakhir'] ?? 0,
                'jarak'           => $data['jarak'] ?? 0,
                'volume'          => $data['volume'] ?? 0,
                // 'nomor' TIDAK diupdate agar history tetap terjaga
            ]);

            return $timbangan;
        });
    }

    /**
     * Soft delete atau ubah status jadi tidak aktif
     */
    public function deleteTimbangan(int $id): bool
    {
        $timbangan = Timbangan::find($id);

        if (!$timbangan) {
            return false;
        }

        $timbangan->status = 0;
        return $timbangan->save();
    }
}
