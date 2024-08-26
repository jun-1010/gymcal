<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('elements', function (Blueprint $table) {
            $table->unsignedSmallInteger('id'); // 0~65535
            $table->string('code');
            $table->unsignedTinyInteger('event'); // 0~255
            $table->unsignedTinyInteger('element_group');
            $table->string('name');
            $table->string('alias');
            $table->unsignedTinyInteger('difficulty');
            $table->unsignedTinyInteger('row_number');
            $table->unsignedTinyInteger('column_number');
            $table->unsignedTinyInteger('start_direction');
            $table->unsignedTinyInteger('end_direction');
            $table->string('element_type');

            // 複合主キーを設定
            $table->primary(['id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('elements');
    }
};
