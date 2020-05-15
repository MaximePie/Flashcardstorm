<?php

namespace App\Helpers;

use App\Mnemonic;
use App\Question;
use App\Question_user;
use App\User;
use Carbon\Carbon;

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
        $question = $user->addQuestion(self::newQuestion());
        $question->current_delay = 3;
        $question->next_question_at = Carbon::now()->addDays(3);

        $question->save();

        return $question;
    }


    /**
     * Create and return a scheduled question for the given user
     * @param User $user
     * @return Question_user
     */
    public static function createScheduledQuestionForUser(User $user)
    {
        $question = $user->addQuestion(self::newQuestion());
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
        $question = $user->addQuestion(self::newQuestion());
        $question->current_delay = 10;
        $question->full_score = 100;
        $question->isMemorized = true;
        $question->last_answered_at = Carbon::now()->subDays(1);
        $question->isInitiated = true;
        $question->save();

        return $question;
    }

    /**
     * Creates an uninitiated question for the given user
     * @param User $user
     * @return Question_user
     */
    public static function createNotInitiatedQuestionForUser(User $user)
    {
        $question = $user->addQuestion(self::newQuestion());
        $question->isInitiated = false;
        $question->save();
        return $question;
    }

    /**
     * Remove and hard delete all question attached to the given user
     * @param User $user
     * @return Question_User
     */
    public static function removeAllQuestionsForUser(User $user)
    {
        $question = $user->questions()->forceDelete();
        $user->save();
        return $question;
    }

    /**
     * Create a mnemonic for Question User
     * @param Question_user $questionUser
     * @return Mnemonic
     */
    public static function createMnemonicForQuestionUser(Question_user $questionUser)
    {
        /** @var Mnemonic $mnemonic */
        $mnemonic = factory(Mnemonic::class)->create();
        $mnemonic->question_user_id = $questionUser->id;
        $mnemonic->save();

        return $mnemonic;
    }
}
