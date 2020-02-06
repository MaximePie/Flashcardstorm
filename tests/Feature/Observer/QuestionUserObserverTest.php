<?php
/**
 * Created by PhpStorm.
 * User: maxime
 * Date: 18/12/19
 * Time: 20:48.
 */

namespace App\Observers;

use App\Answer;
use App\Question;
use App\Question_user;
use App\User;
use Tests\TestCase;

class QuestionUserObserverTest extends TestCase
{
    /**
     * Test that the reverted question is also assigned to a user when he selects a question.
     * @return void
     * @throws \Exception
     */
    public function test_reversed_question_is_assigned_to_user()
    {
        Question_user::query()->forceDelete();

        $answer_1 = Answer::create(['wording' => 'Pikachu']);
        $answer_2 = Answer::create(['wording' => 'Snorlax']);

        $question_1 = Question::create(['wording' => 'haha1', 'answer_id' => $answer_1->id]);
        $question_2 = Question::create(['wording' => 'haha2', 'answer_id' => $answer_2->id]);

        $question_1->createReverseQuestion();

        $user = factory(User::class)->make();

        Question_user::create(['user_id' => $user->id, 'question_id' => $question_1->id]);
        Question_user::create(['user_id' => $user->id, 'question_id' => $question_2->id]);

        $this->assertEquals(3, Question_user::query()->count());
    }
}
