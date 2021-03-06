<?php

namespace Tests;

use App\Answer;
use App\Helpers\QuestionHelper;
use App\Question;
use App\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Hash;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public function user(): User
    {
        return User::query()->firstOr('*', static function () {
            return User::create([
                'name' => 'Popol',
                'email' => 'popol@popol.pol',
                'password' => Hash::make('zozo'),
            ]);
        });
    }

    public function createUsers(int $amount): Collection
    {
        $neededUsers = $amount - User::query()->count();

        if ($neededUsers > 0) {
            factory(User::class)->times($neededUsers)->create();
        }

        return User::all();
    }

    public function question(): Question
    {
        $question = factory(Question::class)->make();
        $question->save();
        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $question->answer_id = $correct_answer->id;
        $question->save();

        return $question;
    }

    public function createQuestions(int $amount): Collection
    {
        $question = factory(Question::class)->times($amount)->make();
        $question->each(static function(Question $quest) {
            $correct_answer = Answer::create(['wording' => 'la raclette']);
            $quest->answer_id = $correct_answer->id;
            $quest->save();
        });

        return $question;
    }
}
