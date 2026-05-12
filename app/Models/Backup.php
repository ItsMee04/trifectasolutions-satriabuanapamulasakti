<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Backup extends Model
{
    use HasFactory;
    protected $table = 'backup';
    protected $fillable = [
        'filename',
        'path',
        'size',
        'backup_date',
        'created_by',
    ];

    protected $casts = [
        'backup_date' => 'datetime',
    ];

    /**
     * Get the user that owns the Backup
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
