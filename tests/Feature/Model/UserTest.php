<?php

namespace Tests\Feature;

use App\Question;
use App\Question_user;
use App\User;
use App\Helpers\QuestionUserHelper;
use Tests\TestCase;

/**
 * @property Question question
 * @property User user
 */
class UserTest extends TestCase
{
    /***************************
     * CUSTOM METHODS TESTS
     ***************************
     */

    /**
     * @group user
     * @group question_user
     * Expected : 1 question scheduled for in 1 day
     * Unwanted : 1 question scheduled for in 3 day
     * @test
     */
    public function nextQuestionReturnsTheClosestNextQuestion() {
        $expectedNextQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $expectedNextQuestion->next_question_at = now()->addDays(1);
        $expectedNextQuestion->save();
        $expectedNextQuestion = Question_user::find($expectedNextQuestion->id);

        $unwantedNextQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $unwantedNextQuestion->next_question_at = now()->addDays(3);
        $unwantedNextQuestion->save();
        $unwantedNextQuestion = Question_user::find($unwantedNextQuestion->id);

        $this->assertEquals($expectedNextQuestion, $this->user->nextQuestion());
        $this->assertNotEquals($unwantedNextQuestion, $this->user->nextQuestion());
    }

    /**
     * Expected : 1 question for in 3 days but not memorzed
     * Unwanted : 1 question for the next day but memorized
     * @group user
     * @group question_user
     * @test
     */
    public function nextQuestionIgnoresMemorizedQuestions() {

        $expectedNextQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $expectedNextQuestion->next_question_at = now()->addDays(3);
        $expectedNextQuestion->save();
        $expectedNextQuestion = Question_user::find($expectedNextQuestion->id);

        $unwantedQuestions = QuestionUserHelper::createMemorizedQuestionsForUser($this->user);


        $nextQuestion = $this->user->nextQuestion();

        $this->assertEquals($expectedNextQuestion,$nextQuestion);
        foreach($unwantedQuestions as $question) {
            $this->assertNotEquals($question, $nextQuestion);
        }
    }

    /**
     * Delete users questions before going further
     * Expected : No question
     * Unwanted : One question but next question at has already passed
     * @group user
     * @group question_user
     * @test
     */
    public function nextQuestionIsNullWhenNoQuestionIsScheduled() {

        $unwantedNextQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $unwantedNextQuestion->next_question_at = now()->subDays(1);
        $unwantedNextQuestion->isMemorized = true;
        $unwantedNextQuestion->save();

        $this->assertNull($this->user->nextQuestion());
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        User::query()->forceDelete();
        $this->question = $this->question();
        $this->user = $this->user();
    }
}
