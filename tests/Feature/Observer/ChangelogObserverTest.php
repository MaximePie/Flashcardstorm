<?php
/**
 * Created by PhpStorm.
 * User: maxime
 * Date: 18/12/19
 * Time: 20:48.
 */

namespace App\Observers;

use App\Answer;
use App\Changelog;
use App\Question;
use App\Question_user;
use App\User;
use Exception;
use Notification;
use Tests\TestCase;

class ChangelogObserverTest extends TestCase
{
    /**
     * Test that creating a changelog also creates a notification and sends it to users
     * @return void
     * @throws Exception
     */
    public function test_create_changelog_creates_notifications_for_users(): void
    {
        User::query()->each(static function(User $user){
            $user->notifications()->delete();
        });

        $users = $this->user();

        $this->assertEquals(0, $users->unreadNotifications()->count());
        Changelog::create([
            'title' => 'Test title new changelog',
            'text' => 'Test text new changelog',
            'nextstep' => 'Text nextstep new changelog',
        ]);

        $this->assertEquals(1, $users->unreadNotifications()->count());
    }
}
