<?php

namespace Tests\Feature;

use App\Answer;
use App\Question;
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
     * Test submit with success
     *
     * @return void
     */
    public function test_is_valid_for(): void
    {
        $question = Question::query()->first();
        $answer = Answer::create(['wording' => 'la raclette']);
        $question->answer()->attach($answer);
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        $this->question = factory(Question::class)->make();
        $this->question->save();
    }
}
