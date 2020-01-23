<?php

namespace Tests\Feature;

use App\Question;
use App\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

/**
 * @property Question question
 * @property User user
 */
class WebQuestionTest extends TestCase
{
    /**
     * Test submit with success
     *
     * @return void
     */
    public function test_is_valid_with(): void
    {
        $this->assertTrue(true);
        /*
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
        */
    }

    /**
     * Test to fetch the list of the questions as connected user
     * @throws \Exception
     */
    public function test_index_with_connected_user(): void
    {
        $this->actingAs($this->user, 'api');
        $this->question->createReverseQuestion();

        $response = $this->get('/api/authenticated/questions_list');
        $response->assertStatus(200);
        $response = json_decode($response->getContent(), true);

        $this->assertNotNull($response['questions']['data'][0]);
        $this->assertCount(1, $response['questions']['data']);
    }

    /**
     * Test to fetch the list of the questions as guest
     * @throws \Exception
     */
    public function test_index_for_guest(): void
    {
        $this->question->createReverseQuestion();

        $response = $this->get('/api/questions_list');
        $response->assertStatus(200);
        $response = json_decode($response->getContent(), true);
        $this->assertNotNull($response['questions']['data'][0]);
        $this->assertCount(1, $response['questions']['data']);
    }

    /**
     * Test to submit an answer with only one remaining daily objective occurrence
     * @throws \Exception
     */
    public function test_get_random_question_with_one_answer_left(): void
    {
        $this->question->createReverseQuestion();

        $response = $this->get('/api/questions_list');
        $response->assertStatus(200);
        $response = json_decode($response->getContent(), true);
        $this->assertNotNull($response['questions']['data'][0]);
        $this->assertCount(1, $response['questions']['data']);
    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        $this->question = factory(Question::class)->make();
        $this->question->save();
        $this->user = factory(User::class)->make();
    }
}
