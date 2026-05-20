<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Suplier extends Model
{
    use HasFactory;

    protected $table = 'suplier';
    protected $fillable = [
        'kode',
        'nama',
        'kontak',
        'alamat',
        'oleh',
        'status',
    ];

    /**
     * Get the oleh that owns the Suplier
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
