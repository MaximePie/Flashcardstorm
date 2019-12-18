<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReverseColumnToQuestionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('questions', static function (Blueprint $table) {
            $table->unsignedBigInteger('reverse_question_id')->nullable();
            $table->foreign('reverse_question_id')
                ->references('id')
                ->on('questions')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', static function (Blueprint $table) {
            $table->dropForeign(['reverse_question_id']);
            $table->dropColumn('reverse_question_id');
        });
    }
}
