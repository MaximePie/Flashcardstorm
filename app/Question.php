<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    protected $fillable = ['wording', 'details', 'answer_id'];

    public function answer(): BelongsTo
    {
        return $this->belongsTo(Answer::class);
    }

    // TODO - Create fullScore method which will return a sum of every question scores

    // TODO - Create scopeTodoQuestions  scope which will return every questions the user has not already answered (Today > next_question_at)

}
