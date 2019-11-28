<?php

use App\Answer;
use App\Category;
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

        $category = CATEGORY::create([
            'name' => 'Anglais',
            'color' => "#0000AA",
            'icon' => 'coffee',
        ]);

        $category->save();

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

        $answer = Answer::create([
            'wording' => 'Nageoire',
        ]);

        $answer->save();

        Question::create([
            'wording' => 'Fin - Anglais',
            'answer_id' => $answer->id,
            'category_id' => $category->id,
        ]);
    }
}
