<?php

namespace App\Http\Controllers\Setting;

use App\Http\Controllers\Controller;
use App\Services\BackupService;
// use Illuminate\Http\Request;

class BackupController extends Controller
{
    protected BackupService $backupService;

    public function __construct(BackupService $backupService)
    {
        $this->backupService = $backupService;
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => $this->backupService->getAll()
        ]);
    }

    public function generate()
    {
        $backup = $this->backupService->generate();

        return response()->json([
            'success' => true,
            'message' => 'Backup berhasil dibuat',
            'data' => $backup
        ]);
    }

    public function download(string $filename)
    {
        return $this->backupService->download($filename);
    }

    public function destroy(string $id)
    {
        $this->backupService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Backup berhasil dihapus.'
        ]);
    }
}
