<?php

use App\Answer;
use App\Category;
use App\Question;
use App\Question_user;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        factory(Category::class)->times(10)->create();
        factory(Answer::class)->times(10)->create();
        factory(Question::class)->times(10)->create();
        factory(User::class)->times(5)->create();
        factory(Question_user::class)->times(5)->create();

        $user = User::query()->where('email', 'maxime.pie@group-hpi.com')->first();
        if (!$user) {
            $user = User::create([
                'name' => 'The Owl',
                'email' => 'maxime.pie@group-hpi.com',
                'email_verified_at' => now(),
                'password' => Hash::make('123'), // password
                'remember_token' => Str::random(10),
                'api_token' => Str::random(60),
            ]);
        }

        $this->createQuestionsForUser($user);

    }

    private function createQuestionsForUser(User $user): void
    {
        Question_user::create([
            'user_id' => $user->id,
            'question_id' => Question::query()->inRandomOrder()->first()->id,
        ]);

        $questionUser = new Question_user();
        $questionUser->user_id = $user->id;
        $questionUser->question_id = Question::query()->inRandomOrder()->first()->id;
        $questionUser->current_delay = 3;
        $questionUser->next_question_at = Carbon::now()->addDays(3);

        $questionUser->save();
    }
}
