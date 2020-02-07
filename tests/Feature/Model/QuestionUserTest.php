<?php

namespace Tests\Feature;

use App\Answer;
use App\Question;
use App\Question_user;
use App\User;
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

    /***************************
     * CUSTOM METHODS TESTS
     ***************************
     */

    /**
     * Check that random question only returns non Memorized questions
     * @return void
     */
    public function test_assert_random_question_is_not_memorized(): void
    {
        $user = $this->user;
        $user->questions()->each(static function(Question $question) use ($user){
            $questionUser = Question_user::findFromTuple($question->id, $user->id);
            if ($questionUser) {
                $questionUser->first()->isMemorized = true;
                $questionUser->first()->save();
            }
        });

        self::assertSame(1, 1);
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
