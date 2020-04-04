<?php

namespace App\Helpers;

use App\Question;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class QuestionHelper Provides helpful methods for seeding purposes
 */
class QuestionHelper
{
    /**
     * This method is just a syntactic helper for a more intuitive name
     * @return Question
     */
    public static function newQuestion(): Question
    {
        return factory(Question::class)->create();
    }

    /**
     * This method is just a syntactic helper for a more intuitive name
     * Creates a defined amount of questions
     * @param int $desiredAmount
     * @return Question
     */
    public static function newQuestions(int $desiredAmount): Collection
    {
        return factory(Question::class)->times($desiredAmount)->create();
    }
}
