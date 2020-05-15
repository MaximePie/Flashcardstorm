<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int question_user_id
 * @property string wording
 */
class Mnemonic extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'question_user_id', 'wording',
    ];


    /**
     * @return BelongsTo
     */
    public function question_user(): BelongsTo
    {
        return $this->belongsTo(Question_user::class);
    }
}
