<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetNextStepColumnToTextToIncreaseSizeOnChangelogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('changelogs', function (Blueprint $table) {
            $table->text('nextstep')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('changelogs', function (Blueprint $table) {
            $table->string('nextstep')->change();
        });
    }
}
