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
        Schema::create('kendaraan', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 100);
            $table->string('kendaraan', 100);
            $table->unsignedBigInteger('jeniskendaraan_id');
            $table->string('nomor', 100);
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->unsigned()->default(1);
            $table->timestamps();

            $table->foreign('jeniskendaraan_id')->references('id')->on('jeniskendaraan')->onDelete('cascade');
            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraan');
    }
};
