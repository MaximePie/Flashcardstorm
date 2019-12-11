<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\Question
 *
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
 * @property int|null $user_id
 * @property int|null $category_id
 * @property-read \App\Category|null $category
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\User[] $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereAnswerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereDetails($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question whereWording($value)
 * @mixin \Eloquent
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

        $purged_answer = strtolower($submited_answer);
        $purged_answer = preg_replace('/(\bla|les|le|une|des|un\b)|\s*/', '', $purged_answer);

        $correct_answer = strtolower($correct_answer);
        $correct_answer = preg_replace('/(\bla|les|le|une|des|un\b)|\s*/', '', $correct_answer);

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
