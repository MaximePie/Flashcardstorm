<?php

namespace App\Helpers;

use App\Answer;

/**
 * Class AnswerHelper Provides helpful methods for seeding and testing purposes
 */
class AnswerHelper
{
    /**
     * This method is just a syntactic helper for a more intuitive name
     * @return Answer
     */
    public static function newAnswer(): Answer
    {
        return factory(Answer::class)->create();
    }

    /**
     * Creates an answer with additional choices
     * @return Answer
     */
    public static function newAnswerWithMultipleChoices(): Answer
    {
        return factory(Answer::class, 'MCQ')->create();
    }
}
