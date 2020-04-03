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
     * Expected : 1 question scheduled for in 1 day
     * Unwanted : 1 question scheduled for in 3 day
     * @group user
     * @group question_user
     * @group nextQuestion
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
     * @group nextQuestion
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
     * @group nextQuestion
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
     * @group scheduledRandomQuestion
     * @group user
     * @test
     */
    public function dailyQuestionDoesNotReturnIncomingQuestions()
    {
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
     * @group dailyQuestion
     * @group user
     * @test
     */
    public function dailyQuestionDoesNotReturnMemorizedQuestions()
    {
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
     * @group dailyQuestion
     * @group user
     * @test
     */
    public function dailyQuestionReturnsQuestion()
    {
        $expectedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $dailyQuestions = $this->user->dailyQuestions()->get();

        $this->assertTrue($dailyQuestions->contains($expectedQuestion));
    }

    /**
     * Scheduled random question returns one or more questions
     * Expected : 2 Scheduled questions
     * @group question_user
     * @group scheduledRandomQuestion
     * @group user
     * @test
     */
    public function scheduledRandomQuestion()
    {
        $expectedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $randomQuestions = $this->user->scheduledRandomQuestion();

        $this->assertTrue($randomQuestions->contains($expectedQuestion));
    }

    /**
     * A scheduled random question takes an empty array as parameters and returns all questions
     * Expected : 2 scheduled questions
     * Unexpected : More or less questions
     * @group question_user
     * @group scheduledRandomQuestion
     * @group scheduledRandomQuestionAlreadyInBag
     * @group user
     * @test
     */
    public function scheduledRandomQuestionWithEmptyBag() {
        $expectedQuestion1 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $expectedQuestion2 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();

        $questionsList = $this->user->scheduledRandomQuestion([]);

        $this->assertTrue($questionsList->contains($expectedQuestion1));
        $this->assertTrue($questionsList->contains($expectedQuestion2));
    }


    /**
     * A scheduled random question takes an array of already loaded questions and doesn't return it but
     * returns other questions
     * Expected : 2 scheduled questions
     * Unexpected : 1 scheduled question whose id is in the array
     * @group question_user
     * @group scheduledRandomQuestion
     * @group scheduledRandomQuestionAlreadyInBag
     * @group user
     * @test
     */
    public function scheduledRandomQuestionWithNonEmptyBag() {
        $expectedQuestion1 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $expectedQuestion2 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $unexpectedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();

        $questionsList = $this->user->scheduledRandomQuestion([$unexpectedQuestion->id]);

        $this->assertTrue($questionsList->contains($expectedQuestion1));
        $this->assertTrue($questionsList->contains($expectedQuestion2));

        $this->assertFalse($questionsList->contains($unexpectedQuestion));
    }


    /**
     * ScheduledRandomQuestions returns nothing if provided array contains all questions ids
     * Expected : 2 scheduled questions
     * Unexpected : 1 scheduled question whose id is in the array
     * @group question_user
     * @group scheduledRandomQuestion
     * @group scheduledRandomQuestionAlreadyInBag
     * @group user
     * @test
     */
    public function scheduledRandomQuestionWithSelfsameBag() {
        $unexpectedQuestion1 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $unexpectedQuestion2 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();

        $questionsList = $this->user->scheduledRandomQuestion([$unexpectedQuestion1->id, $unexpectedQuestion2->id]);

        $this->assertFalse($questionsList->contains($questionsList));
        $this->assertEmpty($questionsList);
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        User::query()->forceDelete();
        $this->question = $this->question();
        $this->user = $this->user();
        QuestionUserHelper::removeAllQuestionsForUser($this->user);
    }
}
