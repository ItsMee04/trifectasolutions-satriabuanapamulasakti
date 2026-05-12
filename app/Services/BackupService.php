<?php

namespace App\Services;

use App\Models\Backup;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupService
{
    protected string $backupPath;

    public function __construct()
    {
        $this->backupPath = storage_path('app/backups');

        if (!File::exists($this->backupPath)) {
            File::makeDirectory($this->backupPath, 0755, true);
        }
    }

    public function generate(): Backup
    {
        $filename = 'backup-' . now()->format('Y-m-d-H-i-s') . '.sql';

        $path = $this->backupPath . DIRECTORY_SEPARATOR . $filename;

        $mysqldump = '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe"';

        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $host = env('DB_HOST');

        $command = sprintf(
            '%s --user=%s --password=%s --host=%s %s --result-file="%s"',
            $mysqldump,
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($host),
            escapeshellarg($database),
            $path
        );

        $output = [];
        $resultCode = null;

        exec($command, $output, $resultCode);

        if (!File::exists($path)) {

            throw new \Exception(
                'Backup gagal dibuat.'
            );
        }

        return Backup::create([
            'filename' => $filename,
            'path' => $path,
            'size' => $this->formatBytes(File::size($path)),
            'backup_date' => Carbon::now(),
            'created_by' => auth()->id(),
        ]);
    }

    public function getAll()
    {
        return Backup::with('user', 'user.pegawai')
            ->latest('backup_date')
            ->get();
    }

    public function download(string $filename): BinaryFileResponse
    {
        $path = $this->backupPath . DIRECTORY_SEPARATOR . $filename;

        if (!File::exists($path)) {
            throw new \Exception(
                'File backup tidak ditemukan.'
            );
        }

        return response()->download($path);
    }

    public function delete(string $id): bool
    {
        $backup = Backup::findOrFail($id);

        if (File::exists($backup->path)) {
            File::delete($backup->path);
        }

        return $backup->delete();
    }


    protected function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];

        $bytes = max($bytes, 0);

        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));

        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
