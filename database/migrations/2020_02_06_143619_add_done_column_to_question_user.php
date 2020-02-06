<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDoneColumnToQuestionUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('question_users', static function (Blueprint $table) {
            //
            $table->boolean('isMemorized')->nullable()->after('full_score');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('question_users', static function (Blueprint $table) {
            $table->dropColumn('isMemorized');
        });
    }
}
