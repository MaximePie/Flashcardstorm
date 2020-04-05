<?php

namespace Tests\Feature;

use App\Answer;
use App\Category;
use App\Helpers\CategoryHelper;
use App\Helpers\QuestionHelper;
use App\Helpers\QuestionUserHelper;
use App\Question;
use App\Question_user;
use App\User;
use Carbon\Carbon;
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
    private const IS_GOLDEN_CARD = true;
    private const IS_NOT_GOLDEN_CARD = false;

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
        $question = $this->user->randomUserQuestion()->first();
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
        $question = $this->user->randomUserQuestion()->first();
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
        $question = $this->user->randomUserQuestion()->first();
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

    /**
     * Prepared question matches all the additional answers
     * Expected : All the additional answers in additional_answers attribute
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionHasAdditionalAnswers(): void
    {
        $multipleChoiceQuestion = QuestionHelper::newMCQ();

        /** @var Question $question */
        $question = Question::find($multipleChoiceQuestion)->first();

        $question = $question->preparedForView();

        $expectedAnswers = $question->answer()->first()->additional_answers;

        $this->assertNotNull($question['additionalAnswers']);
        $this->assertEquals($question['additionalAnswers'], $expectedAnswers);
    }

    /**
     * Prepared question has empty additional answers if they are no additional answers available
     * Expected : Additional answers attribute should be NULL
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionIsNullIfNoAdditionalAnswerAreAvailable(): void
    {
        $question = QuestionHelper::newQuestion();

        /** @var Question $question */
        $question = Question::find($question)->first();

        $question = $question->preparedForView();

        $this->assertNull($question['additionalAnswers']);
    }

    /**
     * Prepared question returns the appropriate category
     * Expected : The category of the question
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionReturnsAppropriateCategory(): void
    {
        CategoryHelper::newCategory();
        $question = QuestionHelper::newQuestion();

        /** @var Question $question */
        $question = Question::find($question)->first();
        $question = $question->preparedForView();

        $expectedCategory = Category::find($question->category)->first();

        $this->assertNotNull($question['category']);
        $this->assertEquals($question['category'], $expectedCategory);
    }

    /**
     * Prepared question category is null if there are no category assigned to the question
     * Unexpected : A category
     * @group question_user
     * @group QuestionUserPrepareForView
     * @test
     */
    public function preparedQuestionReturnsNoCategoryWhenCategoryFieldIsNull(): void
    {
        CategoryHelper::newCategory();
        $question = QuestionHelper::newQuestion();
        $question->category_id = null;
        $question->save();

        /** @var Question $question */
        $question = Question::find($question)->first();
        $question = $question->preparedForView();


        $this->assertNull($question['category']);
    }

    /**
     * Save success updates the appropriate fields for soft mode
     * Expected : UserScore is equal to full_score before it is updated
     * Expected : CurrentDelay is incremented
     * Expected : LastAnswerAt is set to now
     * Expected : NextQuestionAt is set to now + current delay
     * Expected : $expectedFullScore is set to the new current delay times the question base score
     * @group question_user
     * @group saveSuccess
     * @test
     */
    public function saveSuccessUpdatesTheFieldsInSoftMode(): void
    {
        $savedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user);
        $expectedUserScore = $this->user->score + $savedQuestion->full_score;
        $expectedCurrentDelay = $savedQuestion->current_delay + 1;
        $expectedLastAnsweredAt = Carbon::now();
        $expectedNextQuestionAt = Carbon::now()->addDays($savedQuestion->current_delay);
        $expectedFullScore = $expectedCurrentDelay * $savedQuestion->score;

        $savedQuestion->saveSuccess($this->user, 'soft');

        $this->assertEquals($expectedUserScore, $this->user->score);
        $this->assertEquals($expectedCurrentDelay, $savedQuestion->current_delay);
        $this->assertTrue($expectedLastAnsweredAt->isSameDay($savedQuestion->last_answered_at));
        $this->assertTrue($expectedNextQuestionAt->isSameDay($savedQuestion->next_question_at));
        $this->assertEquals($expectedFullScore, $savedQuestion->full_score);
        $this->assertFalse($savedQuestion->isMemorized);
    }

    /**
     * Save success memorizes a question if its full score is greater than 100
     * Expected : isMemorized is true
     * @group question_user
     * @group saveSuccess
     * @test
     */
    public function saveSuccessMemorizesAQuestion(): void
    {
        $savedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user);
        $savedQuestion->full_score = 100;
        $savedQuestion->current_delay = 10;

        $savedQuestion->saveSuccess($this->user, 'soft');

        $this->assertTrue($savedQuestion->isMemorized);
    }

    /**
     * Save success add 10 points on storm mode
     * Expected : user score is augmented by 10
     * @group question_user
     * @group saveSuccess
     * @test
     */
    public function saveSuccessAddPointsOnStormMode(): void
    {
        $savedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user);
        $expectedUserScore = $this->user->score + 10;
        $savedQuestion->saveSuccess($this->user, 'soft');

        $this->assertEquals($expectedUserScore, $this->user->score);
    }

    /**
     * Save success with golden card attribute
     * Expected : earned points is multiplied itself
     * @group question_user
     * @group saveSuccess
     * @test
     */
    public function saveSuccessWithGoldenCardMultipliesTheEarnedPoints(): void
    {
        $savedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user);
        $expectedUserScore = $this->user->score + ($savedQuestion->full_score * $savedQuestion->full_score);
        $savedQuestion->saveSuccess($this->user, 'soft', self::IS_GOLDEN_CARD);

        $this->assertEquals($expectedUserScore, $this->user->score);
    }

    /**
     * Save success with golden card attribute set to FALSE should not increase earned points
     * Expected : earned points is left by itself
     * Unexpected : earned points is multiplied by itself
     * @group question_user
     * @group saveSuccess
     * @test
     */
    public function saveSuccessWithNoGoldenCardShouldNotIncreaseEarnedPoints(): void
    {
        $savedQuestion = QuestionUserHelper::createScheduledQuestionForUser($this->user);
        $unexpectedUserScore = $this->user->score + ($savedQuestion->full_score * $savedQuestion->full_score);
        $expectedUserScore = $this->user->score + ($savedQuestion->full_score);
        $savedQuestion->saveSuccess($this->user, 'soft', self::IS_NOT_GOLDEN_CARD);

        $this->assertEquals($expectedUserScore, $this->user->score);
        $this->assertNotEquals($unexpectedUserScore, $this->user->score);
    }

    /**
     * A new question_user has its full_score automatically set to its score
     * Expected : Full score is equal to score
     * @group question_user
     * @test
     */
    public function newQuestionUserHasFullScoreEqualToScore(): void
    {
        $questionUser = QuestionUserHelper::createScheduledQuestionForUser($this->user);
        $this->assertEquals($questionUser->score, $questionUser->full_score);
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
