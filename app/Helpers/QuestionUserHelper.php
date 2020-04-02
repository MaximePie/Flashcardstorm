<?php

namespace App\Helpers;

use App\Question;
use App\Question_user;
use App\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * Class QuestionUserHelper Provides helpful methods for seeding purposes
 */
class QuestionUserHelper
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
     * Create a new Question, assign it to the user
     * make sure it's INCOMING for this user
     * @param User $user The user we want to assign the question
     * @return Question_user
     */
    public static function createIncomingQuestionForUser(User $user): Question_user
    {
        $incomingQuestion = $user->addQuestion(self::newQuestion());
        $incomingQuestion->current_delay = 3;
        $incomingQuestion->next_question_at = Carbon::now()->addDays(3);

        $incomingQuestion->save();

        return $incomingQuestion;
    }


    /**
     * Create 3 questions assigned to the user and return them as Collection
     * make sure they are MEMORIZED by the user
     * @param User $user The user we want to assign the memorized question
     * @return Collection
     */
    public static function createMemorizedQuestionsForUser(User $user): Collection
    {
        /** @var Question_user $memorizedQuestion */

        $questions = collect();
        for ($questionPlacement = 0; $questionPlacement < 3; $questionPlacement ++)
        {
            $memorizedQuestion = $user->addQuestion(self::newQuestion());
            $memorizedQuestion->current_delay = 10;
            $memorizedQuestion->full_score = 100;
            $memorizedQuestion->isMemorized = true;
            $memorizedQuestion->next_question_at = Carbon::now()->addDays(10);
            $memorizedQuestion->last_answered_at = Carbon::now()->subDays($questionPlacement + 1);

            $memorizedQuestion->save();
            $questions->add($memorizedQuestion);
        }

        return $questions;
    }

    public static function removeAllQuestionsForUser(User $user) {
        return Question_user::query()->whereIn('question_id', $user->questions())->forceDelete();
    }
}
