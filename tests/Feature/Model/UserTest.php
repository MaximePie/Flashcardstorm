<?php

namespace Tests\Feature;

use App\Answer;
use App\Question;
use App\Question_user;
use App\User;
use DateTime;
use Tests\TestCase;

/**
 * @property Question question
 * @property User user
 */
class UserTest extends TestCase
{
    /***************************
     * CUSTOM METHODS TESTS
     ***************************
     */

    /**
     * Test questions are assigned to user
     * @return void
     */
    public function test_questions_for_user(): void
    {
        dump($this->createQuestions(5));

    }

    protected function setUp(): void
    {
        parent::setUp();
        QUESTION::query()->forceDelete();
        User::query()->forceDelete();
        $this->question = $this->question();
        $this->user = $this->user();
    }
}
