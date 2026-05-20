<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('timbanganmaterial_stonecrusher', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('timbangan_id');
            $table->unsignedBigInteger('material_id');
            $table->unsignedBigInteger('kendaraan_id');
            $table->unsignedBigInteger('driver_id');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('suplier_id')->nullable();
            $table->string('pengambilan', 100)->nullable();
            $table->string('tujuan', 100)->nullable();
            $table->unsignedBigInteger('beratjenis_id');
            $table->decimal('volume', 15, 2);
            $table->decimal('berattotal', 15, 2);
            $table->decimal('beratkendaraan', 15, 2);
            $table->decimal('beratmuatan', 15, 2);
            $table->decimal('jarakawal', 15, 2);
            $table->decimal('jarakakhir', 15, 2);
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->unsigned()->default(1);
            $table->timestamps();

            $table->foreign('timbangan_id')->references('id')->on('timbangan')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('material')->onDelete('cascade');
            $table->foreign('kendaraan_id')->references('id')->on('kendaraan')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('driver')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customer')->onDelete('cascade');
            $table->foreign('suplier_id')->references('id')->on('suplier')->onDelete('cascade');
            $table->foreign('beratjenis_id')->references('id')->on('beratjenis')->onDelete('cascade');
            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timbanganmaterial_stonecrusher');
    }
};
