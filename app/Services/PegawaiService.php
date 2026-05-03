<?php

namespace App\Services;

use App\Models\Pegawai;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;

class PegawaiService
{
    public function getAllActive()
    {
        return Pegawai::where('status', 1)->get();
    }

    public function createPegawai(array $data, UploadedFile $imageFile)
    {
        return DB::transaction(function () use ($data, $imageFile) {
            // 1. Proses Image dengan Kompresi
            $imageName = $this->uploadAndCompress($imageFile);

            // 2. Simpan Pegawai
            $pegawai = Pegawai::create([
                'nama'   => strtoupper($data['nama']),
                'kontak' => $data['kontak'],
                'alamat' => strtoupper($data['alamat']),
                'image'  => $imageName,
                'status' => 1,
            ]);

            // 3. Simpan User terkait
            User::create([
                'pegawai_id' => $pegawai->id,
                'status'     => 2, // Status default user pegawai
            ]);

            return $pegawai;
        });
    }

    public function updatePegawai(int $id, array $data, ?UploadedFile $imageFile = null)
    {
        return DB::transaction(function () use ($id, $data, $imageFile) {
            $pegawai = Pegawai::find($id);
            if (!$pegawai) return null;

            if ($imageFile) {
                // Hapus foto lama
                $this->deleteOldImage($pegawai->image);
                // Upload & Kompres foto baru
                $pegawai->image = $this->uploadAndCompress($imageFile);
            }

            $pegawai->update([
                'nama'   => strtoupper($data['nama']),
                'kontak' => $data['kontak'],
                'alamat' => strtoupper($data['alamat']),
            ]);

            return $pegawai;
        });
    }

    public function deletePegawai(int $id): bool
    {
        $pegawai = Pegawai::find($id);
        if (!$pegawai) return false;

        $pegawai->status = 0;
        return $pegawai->save();
    }

    /**
     * Helper: Upload & Kompres Gambar
     */
    private function uploadAndCompress(UploadedFile $file): string
    {
        // 1. Ganti ekstensi menjadi .png
        $imageName = time() . '.png';

        $manager = new ImageManager(new Driver());
        $image = $manager->read($file);

        // 2. Resize tetap sama (opsional)
        $image->scale(width: 800);

        // 3. Encode ke format PNG
        // Anda bisa menambahkan kompresi (0-100), namun PNG biasanya lossless
        $encoded = $image->toPng();

        // 4. Simpan ke storage
        Storage::disk('public')->put('pegawai/image/' . $imageName, (string) $encoded);

        return $imageName;
    }

    private function deleteOldImage(?string $fileName)
    {
        if ($fileName && Storage::disk('public')->exists('pegawai/image/' . $fileName)) {
            Storage::disk('public')->delete('pegawai/image/' . $fileName);
        }
    }
}
