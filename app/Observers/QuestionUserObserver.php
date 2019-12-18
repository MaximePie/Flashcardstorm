<?php

namespace App\Observers;

use App\Question_user;

class QuestionUserObserver
{
    /**
     * Handle the question_user "created" event.
     *
     * @param  \App\Question_user  $questionUser
     * @return void
     */
    public function created(Question_user $questionUser)
    {
        $question = $questionUser->question()->first();
        $reversed_question = $question->revertedQuestion()->first();
        if ($reversed_question) {
            Question_user::create(['user_id' => $questionUser->user_id, 'question_id' => $reversed_question->id]);
        }
    }

    /**
     * Handle the question_user "updated" event.
     *
     * @param  \App\Question_user  $questionUser
     * @return void
     */
    public function updated(Question_user $questionUser)
    {
        //
    }

    /**
     * Handle the question_user "deleted" event.
     *
     * @param  \App\Question_user  $questionUser
     * @return void
     */
    public function deleted(Question_user $questionUser)
    {
        //
    }

    /**
     * Handle the question_user "restored" event.
     *
     * @param  \App\Question_user  $questionUser
     * @return void
     */
    public function restored(Question_user $questionUser)
    {
        //
    }

    /**
     * Handle the question_user "force deleted" event.
     *
     * @param  \App\Question_user  $questionUser
     * @return void
     */
    public function forceDeleted(Question_user $questionUser)
    {
        //
    }
}
