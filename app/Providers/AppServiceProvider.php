<?php

namespace App\Providers;

use App\Changelog;
use App\Question_user;
use App\Observers\QuestionUserObserver;
use App\Observers\ChangelogObserver;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Question_user::observe(QuestionUserObserver::class);
        Changelog::observe(ChangelogObserver::class);
        //
        Schema::defaultStringLength(191);
        if (config('app.env') === 'production') {
            \URL::forceScheme('https');
        }
    }
}
