<?php

namespace Tests\Feature;

use App\Helpers\QuestionUserHelper;
use App\Helpers\UserHelper;
use App\Question_user;
use App\User;
use App\UserStatistics;
use Carbon\Carbon;
use Tests\TestCase;

class UserStatisticsTest extends TestCase
{
    /**
     * addStatistics creates a new statistics row if no statistics row already exists for this day
     * Expected : A new statistics row for the user, matching the current day
     * Unexpected : Any previous statistics row with a different date than today, but incremented
     * @group userStatistics
     * @group addStatistics
     * @test
     */
    public function addStatisticsCreatesNewStatisticsRow(): void
    {
        $user = UserHelper::newUser();
        $unexpectedUserStatistics = new UserStatistics();
        $unexpectedUserStatistics->created_at = Carbon::today()->subDay();
        $unexpectedUserStatistics->user_id = $user->id;
        $unexpectedUserStatistics->save();
        $this->assertTrue($unexpectedUserStatistics->created_at < Carbon::today());

        UserStatistics::incrementForUser($user->id, 10);
        $expectedUserStatistics = $user->statistics()->latest()->first();
        $this->assertEquals(2, $user->statistics()->count());
        $this->assertNotEquals($expectedUserStatistics, $unexpectedUserStatistics);
        $this->assertEquals(10, $expectedUserStatistics->memorized_questions);
    }

    /**
     * addStatistics updates the current row if there is already an existing row matching the current day
     * Unexpected : A new statistics row for the user, matching the current day
     * Expected : The current, but incremented
     * @group userStatistics
     * @group addStatistics
     * @test
     */
    public function addStatisticsUpdatesTheCurrentStatisticsRow(): void
    {
        $user = UserHelper::newUser();
        $expectedUserStatistics = new UserStatistics();
        $expectedUserStatistics->created_at = Carbon::today();
        $expectedUserStatistics->user_id = $user->id;
        $expectedUserStatistics->memorized_questions = 3;
        $expectedUserStatistics->save();
        $this->assertFalse($expectedUserStatistics->created_at < Carbon::today());

        UserStatistics::incrementForUser($user->id, 13);
        $expectedUserStatistics = UserStatistics::find($expectedUserStatistics->id);
        $this->assertEquals(1, $user->statistics()->count());
        $this->assertEquals(13, $expectedUserStatistics->memorized_questions);
    }

    protected function setUp(): void
    {
        parent::setUp();
        Question_user::query()->forceDelete();
        User::query()->forceDelete();
        UserStatistics::query()->forceDelete();
    }
}
