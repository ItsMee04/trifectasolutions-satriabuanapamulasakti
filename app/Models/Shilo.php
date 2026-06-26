<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shilo extends Model
{
    use HasFactory;

    protected $table = 'shilo';
    protected $fillable = [
        'shilo',
        'status',
    ];
}
