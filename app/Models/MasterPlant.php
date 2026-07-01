<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MasterPlant extends Model
{
    use HasFactory;

    protected $table = "masterplant";

    protected $fillable = [
        'plant',
        'status'
    ];

    /**
     * The customer that belong to the MasterPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function customer(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'groupcustomer', 'masterplant_id', 'customer_id');
    }
}
