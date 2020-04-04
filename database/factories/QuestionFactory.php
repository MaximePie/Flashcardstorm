<?php

/** @var Factory $factory */
use App\Answer;
use App\Category;
use App\Helpers\AnswerHelper;
use App\Helpers\CategoryHelper;
use App\Question;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Question::class, static function (Faker $faker) {
    $answer = ANSWER::query()->inRandomOrder()->first();
    $category = Category::query()->inRandomOrder()->first();
    $question = [
        'wording' => implode(' ', $faker->words),
    ];

    if (isset($answer)) {
        $question['answer_id'] = $answer->id;
    }

    if (isset($category)) {
        $question['category_id'] = $category->id;
    }

    return $question;
});

$factory->define(Question::class, static function (Faker $faker) {
    $answer = AnswerHelper::newAnswerWithMultipleChoices();
    $category = CategoryHelper::newCategory();
    $question = [
        'wording' => implode(' ', $faker->words),
    ];

    if (isset($answer)) {
        $question['answer_id'] = $answer->id;
    }

    if (isset($category)) {
        $question['category_id'] = $category->id;
    }

    return $question;
}, 'MCQ');
