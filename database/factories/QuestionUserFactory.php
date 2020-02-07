<?php

/** @var Factory $factory */

use App\Question;
use App\Question_user;
use App\User;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Question_user::class, static function (Faker $faker) {
    return [
        'question_id' => Question::query()->inRandomOrder()->first()->id,
        'user_id' => User::query()->inRandomOrder()->first()->id,
    ];
});
