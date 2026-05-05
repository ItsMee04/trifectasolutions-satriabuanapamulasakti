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
        Schema::create('timbangan', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('nomor');
            $table->date('tanggal');
            $table->unsignedBigInteger('masterplant_id');
            $table->unsignedBigInteger('material_id');
            $table->unsignedBigInteger('kendaraan_id');
            $table->unsignedBigInteger('driver_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('beratjenis_id')->nullable();
            $table->enum('jenis', ['IN', 'OUT']);
            $table->decimal('volume', 8, 2)->default(0.0);
            $table->integer('berattotal')->unsigned()->default(0);
            $table->integer('beratkendaraan')->unsigned()->default(0);
            $table->integer('beratmuatan')->unsigned()->default(0);
            $table->decimal('jarakawal', 8, 2)->nullable()->default(0.0);
            $table->decimal('jarakakhir', 8, 2)->nullable()->default(0.0);
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->unsigned()->default(1);
            $table->timestamps();

            $table->foreign('masterplant_id')->references('id')->on('masterplant')->onDelete('cascade');
            $table->foreign('material_id')->references('id')->on('material')->onDelete('cascade');
            $table->foreign('kendaraan_id')->references('id')->on('kendaraan')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('driver')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customer')->onDelete('cascade');
            $table->foreign('beratjenis_id')->references('id')->on('beratjenis')->onDelete('cascade');
            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timbangan');
    }
};
