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
    public function nextQuestionReturnsTheClosestNextQuestion()
    {
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
     *
     * Unwanted : 1 question for the next day but memorized
     * @group user
     * @group question_user
     * @test
     */
    public function nextQuestionIgnoresMemorizedQuestions()
    {

        $expectedNextQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $expectedNextQuestion->next_question_at = now()->addDays(3);
        $expectedNextQuestion->save();
        $expectedNextQuestion = Question_user::find($expectedNextQuestion->id);

        $unwantedQuestions = QuestionUserHelper::createMemorizedQuestionsForUser($this->user);


        $nextQuestion = $this->user->nextQuestion();

        $this->assertEquals($expectedNextQuestion, $nextQuestion);
        foreach ($unwantedQuestions as $question) {
            $this->assertNotEquals($question, $nextQuestion);
        }
    }

    /**
     * Delete users questions before going further
     * Expected : No question
     *
     * Unwanted : One question but next question at has already passed
     * @group user
     * @group question_user
     * @test
     */
    public function nextQuestionIsNullWhenNoQuestionIsScheduled()
    {

        $unwantedNextQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $unwantedNextQuestion->next_question_at = now()->subDays(1);
        $unwantedNextQuestion->save();

        $this->assertNull($this->user->nextQuestion());
    }

    /**
     * DailyQuestion does not return incoming questions
     * Expected : Empty
     *
     * Unwanted : A question with next_question_at scheduled for later than now
     * @group question_user
     * @group user
     * @test
     */
    public function dailyQuestionDoesNotReturnIncomingQuestions()
    {
        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        $unwantedIncomingQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $dailyQuestions = $this->user->dailyQuestions()->get();

        $this->assertFalse($dailyQuestions->contains($unwantedIncomingQuestion));
    }

    /**
     * DailyQuestion does not return memorizedQuestions
     * Expected : Empty
     *
     * Unwanted : A memorized question
     * @group question_user
     * @group user
     * @test
     */
    public function dailyQuestionDoesNotReturnMemorizedQuestions()
    {
        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        $unwantedMemorizedQuestion = QuestionUserHelper::createMemorizedQuestionsForUser($this->user);
        $dailyQuestions = $this->user->dailyQuestions()->get();

        $this->assertFalse($dailyQuestions->contains($unwantedMemorizedQuestion));
    }

    /**
     * DailyQuestion returns non memorized and scheduled for now questions
     * Expected : A scheduled question non memorized
     *
     * Unwanted : A memorized question
     * @group question_user
     * @group user
     * @test
     */
    public function dailyQuestionReturnsQuestion()
    {
        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        $expectedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $dailyQuestions = $this->user->dailyQuestions()->get();

        $this->assertTrue($dailyQuestions->contains($expectedQuestion));
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
