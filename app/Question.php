<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['wording', 'details', 'answer_id'];

    public function answer() {
        return $this->belongsTo(Answer::class);
    }
}
