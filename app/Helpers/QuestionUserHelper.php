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
     * Create a new Question, assign it to the user
     * make sure it's INCOMING for this user
     * @param User $user The user we want to assign the question
     * @return Question_user
     */
    public static function createIncomingQuestionForUser(User $user): Question_user
    {
        $incomingQuestion = $user->addQuestion(QuestionHelper::newQuestion());
        $incomingQuestion->current_delay = 3;
        $incomingQuestion->next_question_at = Carbon::now()->addDays(3);

        $incomingQuestion->save();

        return $incomingQuestion;
    }


    /**
     * Create and return a scheduled question for the given user
     * @param User $user
     * @return Question_user
     */
    public static function createScheduledQuestionForUser(User $user)
    {
        $question = $user->addQuestion(QuestionHelper::newQuestion());
        $question->save();
        return $question;
    }

    /**
     * Create 3 questions assigned to the user and return them as Collection
     * make sure they are MEMORIZED by the user
     * @param User $user The user we want to assign the memorized question
     * @return Question_user
     */
    public static function createMemorizedQuestionsForUser(User $user): Question_user
    {
        $memorizedQuestion = $user->addQuestion(QuestionHelper::newQuestion());
        $memorizedQuestion->current_delay = 10;
        $memorizedQuestion->full_score = 100;
        $memorizedQuestion->isMemorized = true;
        $memorizedQuestion->last_answered_at = Carbon::now()->subDays(1);
        $memorizedQuestion->save();

        return $memorizedQuestion;
    }

    /**
     * Remove and hard delete all question attached to the given user
     * @param User $user
     * @return Question_User
     */
    public static function removeAllQuestionsForUser(User $user)
    {
        $deletedQuestions = $user->questions()->forceDelete();
        $user->save();
        return $deletedQuestions;
    }
}
