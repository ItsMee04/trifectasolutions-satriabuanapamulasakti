<?php

namespace App\Models;

use App\Models\Timbangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimbanganSemenConcreteBatchingPlant extends Model
{
    use HasFactory;

    protected $table = 'timbangansemen_concretebatchingplant';
    protected $fillable = [
        'timbangan_id',
        'material_id',
        'kendaraan_id',
        'driver_id',
        'suplier_id',
        'beratjenis_id',
        'datang',
        'bongkar',
        'suratjalan',
        'shilo',
        'volume',
        'berattotal',
        'beratkendaraan',
        'beratmuatan',
        'beratmuatansuratjalan',
        'selisih',
        'jarakawal',
        'jarakakhir',
        'oleh',
        'status',
    ];

    /**
     * Get the timbangan that owns the TimbanganSemenConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function timbangan(): BelongsTo
    {
        return $this->belongsTo(Timbangan::class, 'timbangan_id');
    }

    /**
     * Get the material that owns the TimbanganSemenConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id');
    }

    /**
     * Get the kendaraan that owns the TimbanganSemenConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_id');
    }

    /**
     * Get the driver that owns the TimbanganSemenConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    /**
     * Get the suplier that owns the TimbanganSemenConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function suplier(): BelongsTo
    {
        return $this->belongsTo(Suplier::class, 'suplier_id');
    }

    /**
     * Get the beratjenis that owns the TimbanganSemenConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function beratjenis(): BelongsTo
    {
        return $this->belongsTo(BeratJenis::class, 'beratjenis_id');
    }

    /**
     * Get the oleh that owns the TimbanganSemenConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
