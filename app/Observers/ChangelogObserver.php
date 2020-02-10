<?php


namespace App\Observers;


use App\Changelog;
use \App\Notifications\Changelog as ChangelogNotification;
use App\User;
use Notification;

class ChangelogObserver
{
    /**
     * Handle the changelog "created" event.
     *
     * @param Changelog $changelog
     * @return void
     */
    public function created(Changelog $changelog)
    {
        $users = User::all();

        $notification = new ChangelogNotification();

        Notification::send($users, $notification);
    }
}
