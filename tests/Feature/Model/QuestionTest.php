<?php

namespace Tests\Feature;

use App\Answer;
use App\Question;
use App\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

/**
 * @property Question question
 */
class QuestionTest extends TestCase
{
    /**
     * Returns an array of valid answers for a question
     * (The original answer is "raclette")
     * @return array valid answers
     */
    public function valid_answers_provider()
    {
        return array(
            array('la raclette'),
            array('raclette'),
            array('RacLette'),
            array('Raclette LA'),
            array('Rac  lette'),
        );
    }

    /**
     * Returns an array of invalid answers for a question
     * (The original answer is "raclette")
     * @return array the invalid answers
     */
    public function invalid_answers_provider()
    {
        return array(
            array('ralcette'),
            array('raclettes'),
            array('Rododindron'),
            array('La racclette'),
        );
    }

    /***************************
     * CUSTOM METHODS TESTS
     ***************************
    */

    /**
     * Test submit with success
     * @dataProvider valid_answers_provider
     * @param string $valid_answer Submitted answer from provider
     * @return void
     */
    public function test_is_valid_for($valid_answer): void
    {
        $this->question = Question::query()->first();
        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $this->question->answer_id = $correct_answer->id;
        $this->question->save();
        self::assertTrue($this->question->isValidWith($valid_answer));
    }

    /**
     * Test submit with success
     * @dataProvider invalid_answers_provider
     * @param string $invalid_answer Submitted answer from provider
     * @return void
     */
    public function test_is_invalid_for($invalid_answer): void
    {
        $this->question = Question::query()->first();
        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $this->question->answer_id = $correct_answer->id;
        $this->question->save();
        self::assertFalse($this->question->isValidWith($invalid_answer));
    }

    /**
     * Test that the user can get the current score for each questions he answered
     * @return void
     */
    public function test_score_by_user(): void
    {
        $user = $this->user();
        dd($user);
        $this->question = Question::query()->first();
        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $this->question->answer_id = $correct_answer->id;
        $this->question->save();
        self::assertFalse($this->question->isValidWith($invalid_answer));
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        $this->question = factory(Question::class)->make();
        $this->question->save();
    }
}
