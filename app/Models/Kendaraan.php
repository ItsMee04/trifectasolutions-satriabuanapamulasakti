<?php

namespace App\Models;

use App\Models\JenisKendaraan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kendaraan extends Model
{
    use HasFactory;

    protected $table = 'kendaraan';
    protected $fillable = [
        'kode',
        'kendaraan',
        'jeniskendaraan_id',
        'nomor',
        'oleh',
        'status'
    ];

    /**
     * Get the jeniskendaraan that owns the Kendaraan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function jeniskendaraan(): BelongsTo
    {
        return $this->belongsTo(JenisKendaraan::class, 'jeniskendaraan_id', 'id');
    }

    /**
     * Get the user that owns the Kendaraan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }

}
