<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToQuestions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('questions', static function (Blueprint $table) {
            $table->integer('current_delay')->default(0);
            $table->integer('score')->default(10);
            $table->integer('full_score')->nullable();
            $table->integer('number_of_successful_answer')->default(0);
            $table->integer('number_of_unsuccessful_answer')->default(0);
            $table->date('last_answered_at')->nullable();
            $table->date('next_question_at')->nullable()->default(now());
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('questions', static function (Blueprint $table) {
            $table->dropColumn('current_delay');
            $table->dropColumn('score');
            $table->dropColumn('full_score');
            $table->dropColumn('number_of_successful_answer');
            $table->dropColumn('number_of_unsuccessful_answer');
            $table->dropColumn('last_answered_at');
            $table->dropColumn('next_question_at');
        });
    }
}
