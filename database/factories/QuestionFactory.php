<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Answer;
use App\Question;
use Faker\Generator as Faker;

$factory->define(Question::class, static function (Faker $faker) {
    $answer = ANSWER::query()->first();
    if (isset($answer)) {
        return [
            'wording' => 'Fin',
            'answer_id' => $answer->id,
        ];
    }
});
