<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimbanganMaterialConcreteBatchingPlant extends Model
{
    use HasFactory;

    protected $table = 'timbanganmaterial_concretebatchingplant';
    protected $fillable = [
        'timbangan_id',
        'material_id',
        'kendaraan_id',
        'driver_id',
        'customer_id',
        'suplier_id',
        'pengambilan',
        'tujuan',
        'beratjenis_id',
        'volume',
        'berattotal',
        'beratkendaraan',
        'beratmuatan',
        'jarakawal',
        'jarakakhir',
        'oleh',
        'status',
    ];

    /**
     * Get the timbangan that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function timbangan(): BelongsTo
    {
        return $this->belongsTo(Timbangan::class, 'timbangan_id', 'id');
    }

    /**
     * Get the material that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id', 'id');
    }

    /**
     * Get the kendaraan that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_id', 'id');
    }

    /**
     * Get the driver that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'driver_id', 'id');
    }

    /**
     * Get the customer that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    /**
     * Get the suplier that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function suplier(): BelongsTo
    {
        return $this->belongsTo(Suplier::class, 'suplier_id', 'id');
    }

    /**
     * Get the beratjenis that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function beratjenis(): BelongsTo
    {
        return $this->belongsTo(BeratJenis::class, 'beratjenis_id', 'id');
    }

    /**
     * Get the oleh that owns the TimbanganMaterialConcreteBatchingPlant
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function oleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'oleh', 'id');
    }
}
