<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Material extends Model
{
    use HasFactory;

    protected $table = 'material';
    protected $fillable = [
        'kode',
        'material',
        'satuan',
        'oleh',
        'status',
    ];

    /**
     * Get the user that owns the Material
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'foreign_key', 'other_key');
    }

    /**
     * The masterplants that belong to the Material
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function masterplants(): BelongsToMany
    {
        return $this->belongsToMany(MasterPlant::class, 'groupmaterial', 'material_id', 'masterplant_id');
    }
}
