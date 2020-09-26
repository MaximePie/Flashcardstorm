<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMentalColumnsToQuestionUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('question_users', function (Blueprint $table) {
            $table->date('next_mental_question_at')->nullable()->default(now());
            $table->integer('Q')->default(1);
            $table->boolean('is_mentally_memorized')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('question_users', function (Blueprint $table) {
            $table->dropColumn('next_mental_question_at');
            $table->dropColumn('current_mental_delay');
            $table->dropColumn('is_mentally_memorized');
        });
    }
}
