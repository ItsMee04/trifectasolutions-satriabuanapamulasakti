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
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->unsigned()->default(1);
            $table->timestamps();

            $table->foreign('masterplant_id')->references('id')->on('masterplant')->onDelete('cascade');
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
