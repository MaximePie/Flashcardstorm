<?php

namespace App\Helpers;

use App\Question;

/**
 * Class Question Provides helpful methods for seeding and testing purposes
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
}
