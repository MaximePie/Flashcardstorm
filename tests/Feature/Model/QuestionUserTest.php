<?php

namespace Tests\Feature;

use App\Answer;
use App\Helpers\CategoryHelper;
use App\Helpers\QuestionHelper;
use App\Helpers\QuestionUserHelper;
use App\Question;
use App\Question_user;
use App\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Tests\TestCase;

/**
 * @property Question_user questionUser
 * @property User user
 */
class QuestionUserTest extends TestCase
{
    private const INVALID_FULL_SCORE_THRESHOLD = QUESTION_USER::FULL_SCORE_TRESHOLD - 1;

    /***************************
     * CUSTOM METHODS TESTS
     ***************************
     */

    /**
     * Try to memorize a question while having a score UNDER the threshold
     * Expected : Exception "Cannot memorize, threshold not reached"
     * Unwanted : No exception and the question is memorized anyway
     * @group question_user
     * @test
     */
    public function cannotMemorizeQuestionIfScoreIsUnderThreshold()
    {

        $question = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $question->full_score = self::INVALID_FULL_SCORE_THRESHOLD;
        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Cannot set memorized attribute while full score is under threshold");
        $question->isMemorized = true;

        $this->assertNull($question->isMemorized);
    }

    /**
     * Try to memorize a question while having a score SUPERIOR THAN the threshold
     * Expected : The User_Question is well memorized
     * @group question_user
     * @test
     */
    public function canMemorizeQuestionIfScoreHasReachedThreshold()
    {

        $question = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $question->full_score = Question_user::FULL_SCORE_TRESHOLD;
        $question->isMemorized = true;

        $this->assertTrue($question->isMemorized);
    }

    /**
     * isSetForUser() is TRUE if the question is assigned to the user
     * Expected : isSetForUser() should return true
     * @group question_user
     * @group QuestionIsSetForUser
     * @test
     */
    public function isSetForUserReturnsTrueIfTheQuestionIsAssignedToTheUser(): void
    {
        $questionUser = QuestionUserHelper::createScheduledQuestionForUser($this->user);
        $this->assertTrue($questionUser->question()->first()->isSetForUser($this->user));
    }

    /**
     * isSetForUser() is FALSE if the question is not assigned to the user
     * Expected : isSetForUser() should return false
     * @group question_user
     * @group QuestionIsSetForUser
     * @test
     */
    public function isSetForUserReturnsFalseIfTheQuestionIsNotAssignedToTheUser(): void
    {
        $question = QuestionHelper::newQuestion();
        $this->assertFalse($question->isSetForUser($this->user));
    }

    /**
     * Prepared question has the correct answers
     * Expected : The answer wording of the question
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionHasTheAppropriateAnswer(): void
    {

        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        QuestionUserHelper::createScheduledQuestionForUser($this->user);

        /** @var Question $question */
        $question = $this->user->randomQuestion()->first();
        $question = $question->preparedForView();

        $expectedAnswer = $question->answer()->first();

        $this->assertNotNull($expectedAnswer);

        $this->assertEquals($question['answer'], $expectedAnswer->wording);
    }

    /**
     * Prepared question has the attribute is_new if it is NOT set for user
     * Expected : The attribute is_new is set to TRUE
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionIsNewIfQuestionIsNotSetForUser(): void
    {

        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        QuestionHelper::newQuestion();

        /** @var Question $question */
        $question = $this->user->randomQuestion()->first();
        $question = $question->preparedForView($this->user);

        $this->assertNotNull($question);

        $this->assertTrue($question['is_new']);
    }

    /**
     * Prepared question has NOT the attribute is_new if it is set for user
     * Expected : The attribute is_new is set to FALSE
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionIsNotNewIfQuestionIsSetForUser(): void
    {

        QuestionUserHelper::removeAllQuestionsForUser($this->user);
        QuestionUserHelper::createScheduledQuestionForUser($this->user);

        /** @var Question $question */
        $question = $this->user->randomQuestion()->first();
        $question = $question->preparedForView($this->user);

        $this->assertNotNull($question);
        $this->assertFalse($question['is_new']);
    }


    /**
     * Prepared question has NOT the attribute is_new if no user is provided
     * Expected : The attribute is_new is set to FALSE
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionIsNotNewIfThereIsNoUser(): void
    {
        QuestionHelper::newQuestion();

        /** @var Question $question */
        $question = Question::first();
        $question = $question->preparedForView();

        $this->assertNotNull($question);
        $this->assertFalse($question['is_new']);
    }


    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        $this->user = $this->user();
        $user = $this->user;
        $questions = factory(Question::class)->times(5)->make();
        $questions->each(static function (Question $question) use ($user) {
            $correct_answer = Answer::create(['wording' => 'la raclette']);
            $question->answer_id = $correct_answer->id;
            $question->save();
            Question_user::create(['question_id' => $question->id, 'user_id' => $user->id]);
        });
    }
}
