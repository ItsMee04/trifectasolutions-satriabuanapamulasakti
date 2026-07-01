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
        Schema::create('groupsuplier', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('suplier_id');
            $table->unsignedBigInteger('masterplant_id');
            $table->timestamps();

            $table->foreign('suplier_id')->references('id')->on('suplier')->onDelete('cascade');
            $table->foreign('masterplant_id')->references('id')->on('masterplant')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groupsuplier');
    }
};
