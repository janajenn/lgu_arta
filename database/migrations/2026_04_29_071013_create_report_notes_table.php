<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('report_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('report_type');          // e.g., 'preview'
            $table->string('section_key');          // matches the note field name
            $table->text('content')->nullable();
            $table->timestamps();

            // Ensures one note per user, per report type, per section
            $table->unique(['user_id', 'report_type', 'section_key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('report_notes');
    }
};
