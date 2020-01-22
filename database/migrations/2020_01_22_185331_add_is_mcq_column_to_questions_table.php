<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsMcqColumnToQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('questions', static function (Blueprint $table) {
            $table->boolean('is_mcq')->nullable();
        });

        Schema::table('answers', static function (Blueprint $table) {
            $table->text('additional_answers')->after('wording')->nullable();
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
            $table->dropColumn('is_mcq');
        });

        Schema::table('answers', static function (Blueprint $table) {
            $table->dropColumn('additional_answers');
        });
    }
}
