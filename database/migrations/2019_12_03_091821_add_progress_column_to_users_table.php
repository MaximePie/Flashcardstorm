<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProgressColumnToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('users', static function (Blueprint $table) {
            $table->integer('daily_objective')->nullable();
            $table->integer('daily_progress')->nullable();
            $table->dateTime('last_daily_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('users', static function (Blueprint $table) {
            $table->dropColumn('daily_objective');
            $table->dropColumn('daily_progress');
            $table->dropColumn('last_daily_updated_at');
        });
    }
}
