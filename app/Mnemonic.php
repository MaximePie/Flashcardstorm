<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mnemonic extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'wording', 'question_id',
    ];


    /**
     * @return BelongsTo
     */
    public function question_user(): BelongsTo
    {
        return $this->belongsTo(Question_user::class);
    }
}
