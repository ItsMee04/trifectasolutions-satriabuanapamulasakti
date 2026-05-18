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
        Schema::create('timbangandetail', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('timbangan_id');
            $table->unsignedBigInteger('menujenisplant_id');
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->unsigned()->default(1);
            $table->timestamps();

            $table->foreign('timbangan_id')->references('id')->on('timbangan')->onDelete('cascade');
            $table->foreign('menujenisplant_id')->references('id')->on('menujenisplant')->onDelete('cascade');
            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timbangandetail');
    }
};
