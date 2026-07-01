<?php

namespace App\Models;

use App\Models\MasterPlant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Suplier extends Model
{
    use HasFactory;

    protected $table = 'suplier';
    protected $fillable = [
        'kode',
        'nama',
        'email',
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

    /**
     * The masterplants that belong to the Suplier
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function masterplants(): BelongsToMany
    {
        return $this->belongsToMany(MasterPlant::class, 'groupsuplier', 'suplier_id', 'masterplant_id');
    }
}
