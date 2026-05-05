<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterPlant extends Model
{
    use HasFactory;

    protected $table = "masterplant";

    protected $fillable = [
        'plant',
        'status'
    ];
}
