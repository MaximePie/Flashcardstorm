<?php

namespace Tests;

use App\Answer;
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
        $user = User::query()->firstOr('*', static function () {
            User::create([
                'name' => 'Popol',
                'email' => 'popol@popol.pol',
                'password' => Hash::make('zozo'),
            ]);
        });
        dump(User::query()->first());
        return $user;
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
        $question = factory(Question::class)->make($amount);
        $question->save();
        $correct_answer = Answer::create(['wording' => 'la raclette']);
        $question->answer_id = $correct_answer->id;
        $question->save();

        return $question;
    }
}
