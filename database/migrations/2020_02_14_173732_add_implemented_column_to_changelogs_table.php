<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddImplementedColumnToChangelogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('changelogs', static function (Blueprint $table) {
            $table->boolean('is_implemented')->nullable()->default(false);
            $table->text('nextstep')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('changelogs', static function (Blueprint $table) {
            $table->dropColumn('is_implemented');
            $table->text('nextstep')->change();
        });
    }
}
