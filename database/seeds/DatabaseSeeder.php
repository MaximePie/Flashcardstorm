<?php

use App\Answer;
use App\Category;
use App\Mnemonic;
use App\QuestEntity;
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
        factory(Category::class)->times(random_int(5, 20))->create();
        factory(Answer::class)->times(random_int(5, 20))->create();
        factory(Question::class)->times(random_int(5, 20))->create();
        factory(User::class)->times(random_int(5, 15))->create();
        factory(Question_user::class)->times(random_int(5, 15))->create();
        factory(Mnemonic::class)->times(random_int(5, 15))->create();

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
        $this->createQuestEntitiesForUser($mainUser);
    }

    /** Create questions for the given user
     * @param User $mainUser
     * @throws Exception
     */
    private function createQuestionForUser(User $mainUser)
    {
        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            QuestionUserHelper::createIncomingQuestionForUser($mainUser);
        }

        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            $questionUser = QuestionUserHelper::createScheduledQuestionForUser($mainUser);
            QuestionUserHelper::createMnemonicForQuestionUser($questionUser);
        }

        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            QuestionUserHelper::createMemorizedQuestionsForUser($mainUser);
        }

        for ($questionIndex = 0; $questionIndex < random_int(1, 20); $questionIndex += 1) {
            QuestionUserHelper::createNotInitiatedQuestionForUser($mainUser);
        }
    }

    /**
     * Creates the entities associated to the user for the quest
     * @param User $user The user we want to create a hero for
     * @throws Exception
     */
    private function createQuestEntitiesForUser(User $user)
    {
        // Creating hero entity
        $health = random_int(10, 200);
        QuestEntity::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'current_health' => $health,
            'max_health' => $health,
            'attack' => random_int(3,10),
            'current_experience' => random_int(3,100),
            'to_next_level_experience' => random_int(1, 200),
            'level' => 1,
        ]);

        // Creating monster entity
        $health = random_int(3, 20);
        QuestEntity::create([
            'name' => 'Le gros méchant loup',
            'current_health' => $health,
            'max_health' => $health,
            'attack' => random_int(1,3),
            'current_experience' => random_int(3,100),
            'level' => 1,
        ]);
    }
}
