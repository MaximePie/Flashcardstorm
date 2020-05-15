<?php

/** @var Factory $factory */

use App\Mnemonic;
use App\Question_user;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Mnemonic::class, function (Faker $faker) {
    return [
        'wording' => implode(' ', $faker->words),
        'question_user_id' => Question_user::query()->inRandomOrder()->first()->id,
    ];
});
