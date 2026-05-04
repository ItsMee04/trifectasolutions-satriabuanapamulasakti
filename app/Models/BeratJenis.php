<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BeratJenis extends Model
{
    use HasFactory;

    protected $table = 'beratjenis';
    protected $fillable = [
        'beratjenis',
        'status',
        'oleh',
    ];

    /**
     * Get the user that owns the BeratJenis
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
