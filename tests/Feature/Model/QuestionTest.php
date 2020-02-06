<?php

namespace Tests\Feature;

use App\Answer;
use App\Question;
use Tests\TestCase;

/**
 * @property Question question
 */
class QuestionTest extends TestCase
{
    /**
     * Returns an array of valid answers for a question
     * (The original answer is "raclette").
     * @return array valid answers
     */
    public function valid_answers_provider()
    {
        return [
            ['la raclette'],
            ['raclette'],
            ['RacLette'],
            ['Raclette LA'],
            ['Rac  lette'],
        ];
    }

    /**
     * Returns an array of invalid answers for a question
     * (The original answer is "raclette").
     * @return array the invalid answers
     */
    public function invalid_answers_provider()
    {
        return [
            ['ralcette'],
            ['raclettes'],
            ['Rododindron'],
            ['La racclette'],
        ];
    }

    /***************************
     * CUSTOM METHODS TESTS
     ***************************
     */

    /**
     * Test submit with success.
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
     * Test submit with success.
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
     * Test create a reverted question for the current question.
     * @return void
     * @throws \Exception
     */
    public function test_create_reverted_question(): void
    {
        $reverted_question = $this->question->createReverseQuestion();
        self::assertTrue($this->question->isValidWith($reverted_question->wording));
        self::assertTrue($reverted_question->isValidWith($this->question->wording));
        self::assertSame($reverted_question->reverse_question_id, $this->question->id);
        self::assertSame($reverted_question->category_id, $this->question->category_id);
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        $this->question = factory(Question::class)->make();
        $this->question->save();
        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $this->question->answer_id = $correct_answer->id;
        $this->question->save();
    }
}
