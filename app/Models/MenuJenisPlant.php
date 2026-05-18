<?php

namespace App\Models;

use App\Models\MasterPlant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuJenisPlant extends Model
{
    use HasFactory;

    protected $table = "menujenisplant";

    protected $fillable = [
        'masterplant_id',
        'menujenis',
        'status'
    ];

    /**
     * Get the masterplant that owns the MenuJenisPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function masterplant(): BelongsTo
    {
        return $this->belongsTo(MasterPlant::class, 'masterplant_id', 'id');
    }
}
