<?php

namespace Tests\Feature;

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
    public function test_submit_with_success(): void
    {
        $this->question->current_delay = 3;
        $this->question->save();

        $response = $this->post('/api/question/submit_answer', [
            'id' => $this->question->id,
            'is_valid' => true,
        ]);

        $response->assertStatus(200);
        $response = json_decode($response->getContent(), true);

        $expected_delay = $response['Question']['current_delay'];
        $this->assertEquals(4, $expected_delay);

        $expected_last_answer_date = Carbon::create($response['Question']['last_answered_at']);
        $is_same_answer_day = $expected_last_answer_date->isSameDay(Carbon::now());
        $this->assertTrue($is_same_answer_day);

        $expected_next_question_date = Carbon::create($response['Question']['next_question_at']);
        $is_same_next_day = $expected_next_question_date->isSameDay(Carbon::now()->addDays(4));
        $this->assertTrue($is_same_next_day);
    }

    /**
     * Test submit with failure
     *
     * @return void
     */
    public function test_submit_with_failure(): void
    {
        $this->question->current_delay = 3;
        $this->question->save();

        $response = $this->post('/api/question/submit_answer', [
            'id' => $this->question->id,
            'is_valid' => false,
        ]);

        $response->assertStatus(200);
        $response = json_decode($response->getContent(), true);

        $expected_delay = $response['Question']['current_delay'];
        $this->assertEquals(3, $expected_delay);
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        $this->question = factory(Question::class)->make();
        $this->question->save();
    }
}
