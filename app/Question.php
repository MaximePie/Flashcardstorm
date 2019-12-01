<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property integer $id
 * @property integer $answer_id
 * @property string $wording
 * @property string $details
 * @property string $created_at
 * @property string $updated_at
 * @property int $current_delay
 * @property int $score
 * @property int $full_score
 * @property int $number_of_successful_answer
 * @property int $number_of_unsuccessful_answer
 * @property string $last_answered_at
 * @property string $next_question_at
 * @property Answer $answer
 */
class Question extends Model
{
    /**
     * The "type" of the auto-incrementing ID.
     * 
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['answer_id', 'wording', 'details', 'created_at', 'updated_at', 'current_delay', 'score', 'full_score', 'number_of_successful_answer', 'number_of_unsuccessful_answer', 'last_answered_at', 'next_question_at'];

    /**
     * @return BelongsTo
     */
    public function answer(): BelongsTo
    {
        return $this->belongsTo(Answer::class);
    }

    /**
     * @return BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scoreByUser($user)
    {
        $score = 0;
        $question_user = Question_user::findFromTuple($this->id, $user->id);
        if ($question_user) {
            return $question_user->first()->full_score;
        }
        return $score;
    }

    public function nextQuestionatForUser($user)
    {
        return Question_user::findFromTuple($this->id, $user->id)->first()->next_question_at;
    }


    public function isSetForUser($user): bool
    {
        if (!$user) {
            return false;
        }

        return $this->users()->find($user) !== null;
    }

    public function isValidWith(string $submited_answer)
    {
        $correct_answer = $this->answer()->first()->wording;
        if ($submited_answer === $correct_answer) {
            return true;
        }

        $purged_answer = preg_replace('/\s*/', '', $submited_answer);
        $purged_answer = strtolower($purged_answer);

        $correct_answer = preg_replace('/\s*/', '', $correct_answer);
        $correct_answer = strtolower($correct_answer);

        return $correct_answer === $purged_answer;
    }

    /**
     * @return BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->BelongsToMany(User::class, 'question_users');
    }
}
