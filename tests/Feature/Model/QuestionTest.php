<?php

namespace Tests\Feature;

use App\Answer;
use App\Helpers\QuestionHelper;
use App\Question;
use App\Question_user;
use DateTime;
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
            ['le raclette'],
            ['les raclette'],
            ['l\'raclette'],
            ['raclette'],
            ['RacLette'],
            ['Rac  lette'],
            ['Rac-lette'],
            ['To Raclette'],
            ['The Raclette'],
            ['A Raclette'],
            ['An Raclette'],
            ['racletté'],
            ['raclettè'],
            ['raclettê'],
            ['raclettë'],
            ['räclette'],
            ['râclette'],
            ['raclêtte'],
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
        $question = QuestionHelper::newQuestion();

        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $question->answer_id = $correct_answer->id;
        $question->save();
        parent::assertTrue($question->isValidWith($valid_answer));
    }

    /**
     * Test submit with success.
     * @dataProvider invalid_answers_provider
     * @param string $invalid_answer Submitted answer from provider
     * @return void
     */
    public function test_is_invalid_for($invalid_answer): void
    {
        $question = QuestionHelper::newQuestion();

        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $question->answer_id = $correct_answer->id;
        $question->save();
        self::assertFalse($question->isValidWith($invalid_answer));
    }

    /**
     * Test create a reverted question for the current question.
     * @return void
     * @throws \Exception
     */
    public function test_create_reverted_question(): void
    {
        $question = QuestionHelper::newQuestion();
        $reverted_question = $question->createReverseQuestion();
        self::assertTrue($question->isValidWith($reverted_question->wording));
        self::assertTrue($reverted_question->isValidWith($question->wording));
        self::assertSame($reverted_question->reverse_question_id, $question->id);
        self::assertSame($reverted_question->category_id, $question->category_id);
    }


    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
    }
}
