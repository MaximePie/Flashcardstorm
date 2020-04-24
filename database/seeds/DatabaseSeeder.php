<?php

use App\Answer;
use App\Category;
use App\Question;
use App\Question_user;
use App\User;
use App\Helpers\QuestionUserHelper;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     * @throws Exception
     */
    public function run()
    {
        factory(Category::class)->times(10)->create();
        factory(Answer::class)->times(10)->create();
        factory(Question::class)->times(10)->create();
        factory(User::class)->times(5)->create();
        factory(Question_user::class)->times(5)->create();

        $mainUser = User::query()->where('email', 'maxime.pie@group-hpi.com')->first();
        if (!$mainUser) {
            $mainUser = User::create([
                'name' => 'The Owl',
                'email' => 'maxime.pie@group-hpi.com',
                'email_verified_at' => now(),
                'password' => Hash::make('123'),
                'remember_token' => Str::random(10),
                'api_token' => Str::random(60),
            ]);
        }

        $this->createQuestionForUser($mainUser);

    }

    /** Create questions for the given user
     * @param User $mainUser
     * @throws Exception
     */
    private function createQuestionForUser($mainUser)
    {
        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            QuestionUserHelper::createIncomingQuestionForUser($mainUser);
        }

        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            QuestionUserHelper::createScheduledQuestionForUser($mainUser);
        }

        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            QuestionUserHelper::createMemorizedQuestionsForUser($mainUser);
        }

        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            QuestionUserHelper::createNotInitiatedQuestionForUser($mainUser);
        }
    }
}
