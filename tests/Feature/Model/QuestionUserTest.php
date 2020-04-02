<?php

namespace Tests\Feature;

use App\Answer;
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
    const INVALID_FULL_SCORE_TRESHOLD = QUESTION_USER::FULL_SCORE_TRESHOLD - 1;

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
    public function cannotMemorizeQuestionIfScoreIsUnderThreshold() {

        $question = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $question->full_score = self::INVALID_FULL_SCORE_TRESHOLD;
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
    public function canMemorizeQuestionIfScoreHasReachedThreshold() {

        $question = QuestionUserHelper::createIncomingQuestionForUser($this->user);
        $question->full_score = Question_user::FULL_SCORE_TRESHOLD;
        $question->isMemorized = true;

        $this->assertTrue($question->isMemorized);
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        $this->user = $this->user();
        $user = $this->user;
        $questions = factory(Question::class)->times(5)->make();
        $questions->each(static function (Question $question) use ($user){
            $correct_answer = Answer::create(['wording' => 'la raclette']);
            $question->answer_id = $correct_answer->id;
            $question->save();
            Question_user::create(['question_id' => $question->id, 'user_id' => $user->id]);
        });
    }
}
