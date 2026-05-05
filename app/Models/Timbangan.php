<?php

namespace App\Models;

use App\Models\MasterPlant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timbangan extends Model
{
    use HasFactory;

    protected $table = 'timbangan';
    protected $fillable = [
        'nomor',
        'tanggal',
        'masterplant_id',
        'material_id',
        'kendaraan_id',
        'driver_id',
        'customer_id',
        'beratjenis_id',
        'jenis',
        'volume',
        'berattotal',
        'beratkendaraan',
        'beratmuatan',
        'jarakawal',
        'jarakakhir',
        'oleh',
        'status'
    ];

    /**
     * Get the masterplant that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function masterplant(): BelongsTo
    {
        return $this->belongsTo(MasterPlant::class, 'masterplant_id', 'id');
    }

    /**
     * Get the material that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'id');
    }

    /**
     * Get the kendaraan that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_id', 'id');
    }

    /**
     * Get the driver that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'id');
    }

    /**
     * Get the customer that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    /**
     * Get the beratjenis that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function beratjenis(): BelongsTo
    {
        return $this->belongsTo(BeratJenis::class, 'beratjenis_id', 'id');
    }

    /**
     * Get the user that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
