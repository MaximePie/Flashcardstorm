<?php

use App\Answer;
use App\Question;
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
        $answer = Answer::create([
            'wording' => 'Coq',
        ]);

        $answer->save();

        Question::create([
            'wording' => 'Gallus en celte',
            'answer_id' => $answer->id
        ]);

        $answer = Answer::create([
            'wording' => '1789',
        ]);

        $answer->save();

        Question::create([
            'wording' => 'Année de la prise de la Bastille',
            'answer_id' => $answer->id
        ]);
    }
}
