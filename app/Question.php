<?php

namespace App;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Question OriginalsOnly()
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
    protected $fillable = [
        'answer_id',
        'category_id',
        'wording',
        'details',
        'created_at',
        'updated_at',
        'current_delay',
        'score',
        'full_score',
        'number_of_successful_answer',
        'number_of_unsuccessful_answer',
        'last_answered_at',
        'next_question_at',
        'reverse_question_id',
    ];

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

    /**
     * @return HasOne
     */
    public function revertedQuestion(): HasOne
    {
        return $this->hasOne(Question::class, 'reverse_question_id');
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

        if ($this->is_reverse) {
            $correct_answer = $this->wording;
        }

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

    /**
     * Generate a random number to determine if the question will give a bonus or not
     */
    public function tryGoldenCard(): void {
        try {
            $this->is_golden_card = random_int(0, config('app.golden_card_ratio')) === 1;
        } catch (Exception $e) {
            throw new \RuntimeException('Error generating the random golden card');
        }
    }

    /**
     * Scope a query to only include popular users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOriginalsOnly($query)
    {
        return $query->whereNull('reverse_question_id');
    }

    /**
     * Make the reverse version of the question
     * @throws Exception
     */
    public function createReverseQuestion(): Question {
        if (!Question::find('reverse_question_id')) {
            $reverted_answer = Answer::create([
                'wording' => $this->wording,
            ]);

            $reverted_answer->save();
            $question = Question::create([
                'wording' => $this->answer()->first()->wording,
                'reverse_question_id' => $this->id,
                'category_id' => $this->category_id,
                'answer_id' => $reverted_answer->id,
            ]);
            $question->save();
            return $question;
        }
        else {
            throw new \RuntimeException('Error, the inverted question already exists for this one');
        }
    }
}
