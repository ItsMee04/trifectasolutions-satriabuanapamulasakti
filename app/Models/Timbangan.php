<?php

namespace App\Models;

use App\Models\BeratJenis;
use App\Models\Customer;
use App\Models\Kendaraan;
use App\Models\MasterPlant;
use App\Models\Material;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Timbangan extends Model
{
    use HasFactory;

    protected $table = 'timbangan';
    protected $fillable = [
        'nomor',
        'tanggal',
        'masterplant_id',
        'menujenisplant_id',
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
     * Get the menujenis that owns the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function menujenis(): BelongsTo
    {
        return $this->belongsTo(MenuJenisPlant::class, 'menujenisplant_id', 'id');
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

    /**
     * Get all of the timbanganmaterialsc for the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function timbanganmaterialsc(): HasMany
    {
        return $this->hasMany(TimbanganMaterialStoneCrusher::class, 'timbangan_id', 'id');
    }

    /**
     * Get all of the timbanganmaterialcbp for the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function timbanganmaterialcbp(): HasMany
    {
        return $this->hasMany(TimbanganMaterialConcreteBatchingPlant::class, 'timbangan_id', 'id');
    }

    /**
     * Get all of the timbangansemencbp for the Timbangan
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function timbangansemencbp(): HasMany
    {
        return $this->hasMany(TimbanganSemenConcreteBatchingPlant::class, 'timbangan_id', 'id');
    }
}
