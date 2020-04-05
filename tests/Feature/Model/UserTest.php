<?php

namespace Tests\Feature;

use App\Helpers\QuestionHelper;
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
    private const IS_QUESTIONS_LIST_EMPTY = true;

    /**
     * Expected : 1 question scheduled for in 1 day
     * Unwanted : 1 question scheduled for in 3 day
     * @group user
     * @group question_user
     * @group nextQuestion
     * @test
     */
    public function nextQuestionReturnsTheClosestNextQuestion(): void
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
    public function nextQuestionIgnoresMemorizedQuestions(): void
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
    public function nextQuestionIsNullWhenNoQuestionIsScheduled(): void
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
     * @group randomQuestion
     * @group user
     * @test
     */
    public function dailyQuestionDoesNotReturnIncomingQuestions(): void
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
    public function dailyQuestionDoesNotReturnMemorizedQuestions(): void
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
    public function dailyQuestionReturnsQuestion(): void
    {
        $expectedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $dailyQuestions = $this->user->dailyQuestions()->get();

        $this->assertTrue($dailyQuestions->contains($expectedQuestion));
    }

    /**
     * Scheduled random question returns one or more questions
     * Expected : 2 Scheduled questions
     * @group question_user
     * @group randomQuestion
     * @group user
     * @test
     */
    public function randomQuestion(): void
    {
        $expectedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $randomQuestions = $this->user->randomUserQuestion();

        $this->assertTrue($randomQuestions->contains($expectedQuestion));
    }

    /**
     * A scheduled random question takes an empty array as parameters and returns all questions
     * Expected : 2 scheduled questions
     * Unexpected : More or less questions
     * @group question_user
     * @group randomQuestion
     * @group randomQuestionAlreadyInBag
     * @group user
     * @test
     */
    public function randomQuestionWithEmptyBag(): void
    {
        $expectedQuestion1 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $expectedQuestion2 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();

        $questionsList = $this->user->randomUserQuestion('soft', []);

        $this->assertTrue($questionsList->contains($expectedQuestion1));
        $this->assertTrue($questionsList->contains($expectedQuestion2));
    }


    /**
     * A scheduled random question takes an array of already loaded questions and doesn't return it but
     * returns other questions
     * Expected : 2 scheduled questions
     * Unexpected : 1 scheduled question whose id is in the array
     * @group question_user
     * @group randomQuestion
     * @group randomQuestionAlreadyInBag
     * @group user
     * @test
     */
    public function randomQuestionWithNonEmptyBag(): void
    {
        $expectedQuestion1 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $expectedQuestion2 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $unexpectedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();

        $questionsList = $this->user->randomUserQuestion('soft', [$unexpectedQuestion->id]);

        $this->assertTrue($questionsList->contains($expectedQuestion1));
        $this->assertTrue($questionsList->contains($expectedQuestion2));

        $this->assertFalse($questionsList->contains($unexpectedQuestion));
    }


    /**
     * RandomQuestion returns nothing if provided array contains all questions ids
     * Expected : 2 scheduled questions
     * Unexpected : 1 scheduled question whose id is in the array
     * @group question_user
     * @group randomQuestion
     * @group randomQuestionAlreadyInBag
     * @group user
     * @test
     */
    public function randomQuestionWithSelfsameBag(): void
    {
        $unexpectedQuestion1 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();
        $unexpectedQuestion2 = QuestionUserHelper::createScheduledQuestionForUser($this->user)->question()->first();

        $questionsList = $this->user->randomUserQuestion('soft', [$unexpectedQuestion1->id, $unexpectedQuestion2->id]);

        $this->assertFalse($questionsList->contains($questionsList));
        $this->assertEmpty($questionsList);
    }

    /**
     * RandomQuestion returns any question if no user is provided
     * Expected : A question not set for the User
     * @group question_user
     * @group randomQuestion
     * @group user
     * @test
     */
    public function randomQuestionWithNoUser(): void
    {
        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        QuestionHelper::newQuestion();

        $questionsList = User::randomQuestions();

        $this->assertFalse($this->user->questions()->get()->contains($questionsList));
    }

    /**
     * RandomQuestion returns any question if
     * There is a user
     * He is in storm mode
     * Expected : A question not set for the User
     * @group question_user
     * @group randomQuestion
     * @group user
     * @test
     */
    public function randomQuestionWithUserInStormMode(): void
    {
        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        QuestionHelper::newQuestion();

        $questionsList = User::randomQuestions('storm', [], Question_user::DEFAULT_BAG_LIMIT ,$this->user);

        $this->assertFalse($this->user->questions()->get()->contains($questionsList));
    }


    /**
     * Question Message returns a message with the next question date
     * Expected : Vous avez répondu à toutes vos questions pour aujourd'hui.
     * La prochaine question sera prévue pour le " . $next_question->next_question_at
     * Check User::NEXT_QUESTION_MESSAGE
     *
     * @group question_user
     * @group questionMessage
     * @group user
     * @test
     */
    public function questionMessageWithExistingNextQuestion(): void
    {
        $nextQuestion = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $nextQuestion->next_question_at = now()->addDays(1);
        $nextQuestion->save();
        $nextQuestion = Question_user::find($nextQuestion->id);

        $this->assertStringContainsString(
            User::NEXT_QUESTION_MESSAGE,
            "Vous avez répondu à toutes vos questions pour aujourd'hui. La prochaine question sera prévue pour le " . $nextQuestion->next_question_at
        );

        $this->assertStringContainsString(
            $nextQuestion->next_question_at,
            User::questionMessage(self::IS_QUESTIONS_LIST_EMPTY, 'soft', $this->user)
        );
    }


    /**
     * Question Message returns a message when no question is scheduled
     * Expected : Aucune question ne vous est assignée pour le moment. Passez en mode Tempête pour ajouter
     * automatiquement les questions à votre Kit
     *
     * Check User::NEXT_QUESTION_MESSAGE_NOT_FOUND
     * @group question_user
     * @group questionMessage
     * @group user
     * @test
     */
    public function questionMessageWithNoNextQuestion(): void
    {
        QuestionUserHelper::removeAllQuestionsForUser($this->user);

        $this->assertEquals(
            User::NEXT_QUESTION_MESSAGE_NOT_FOUND,
            User::questionMessage(self::IS_QUESTIONS_LIST_EMPTY, 'soft', $this->user)
        );
    }

    /**
     * Question Message returns a message when in storm mode but no question has been found
     * Expected : Il n'y a pas de question disponible, vous pouvez en créer en cliquant sur Ajouter des Questions
     *
     * Check User::NEXT_QUESTION_MESSAGE_NOT_FOUND
     * @group question_user
     * @group questionMessage
     * @group user
     * @test
     */
    public function questionMessageWithNoQuestionInStormMode(): void
    {
        QuestionUserHelper::removeAllQuestionsForUser($this->user);

        $this->assertEquals(
            User::RANDOM_QUESTION_MESSAGE_NOT_FOUND,
            User::questionMessage(self::IS_QUESTIONS_LIST_EMPTY, 'storm')
        );
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
