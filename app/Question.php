<?php

namespace App;

use Eloquent;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use RuntimeException;

/**
 * App\Question.
 *
 * @property int $id
 * @property int $answer_id
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
 * @property-read Category|null $category
 * @property-read Collection|User[] $users
 * @property-read int|null $users_count
 * @method static Builder|Question newModelQuery()
 * @method static Builder|Question newQuery()
 * @method static Builder|Question query()
 * @method static Builder|Question OriginalsOnly()
 * @method static Builder|Question whereAnswerId($value)
 * @method static Builder|Question whereCategoryId($value)
 * @method static Builder|Question whereCreatedAt($value)
 * @method static Builder|Question whereDetails($value)
 * @method static Builder|Question whereId($value)
 * @method static Builder|Question whereUpdatedAt($value)
 * @method static Builder|Question whereUserId($value)
 * @method static Builder|Question whereWording($value)
 * @mixin Eloquent
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
     * @return BelongsTo:
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
        return $this->hasOne(__CLASS__, 'reverse_question_id');
    }

    /**
     * @param  User $user
     * @return int
     */
    public function scoreByUser(User $user): int
    {
        $score = 0;
        $question_user = Question_user::findFromTuple($this->id, $user->id);
        if ($question_user) {
            return $question_user->first()->full_score;
        }

        return $score;
    }

    /**
     * Next question At for a given user.
     * @param  User $user
     * @return string
     */
    public function nextQuestionAtForUser(User $user): ?string
    {
        $nextQuestionAt = Question_user::findFromTuple($this->id, $user->id);
        if ($nextQuestionAt) {
            return $nextQuestionAt->first()->next_question_at;
        }

        return null;
    }

    /**
     * Check if the question is set for the given user.
     * @param $user User
     * @return bool
     */
    public function isSetForUser(User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->users()->find($user) !== null;
    }

    /**
     * Check if the answer is correct for the current question.
     * @param string $submitted_answer
     * @return bool
     */
    public function isValidWith(string $submitted_answer): bool
    {
        $correct_answer = $this->answer()->first()->wording;

        if ($this->is_reverse) {
            $correct_answer = $this->wording;
        }

        if ($submitted_answer === $correct_answer) {
            return true;
        }

        $purged_answer = strtolower($submitted_answer);
        $purged_answer = preg_replace('/(\bla|les|le|une|des|un\b)|\s*/', '', $purged_answer);

        $correct_answer = strtolower($correct_answer);
        $correct_answer = preg_replace('/(\bla|les|le|une|des|un\b)|\s*/', '', $correct_answer);

        return $correct_answer === $purged_answer;
    }

    /**
     * Returns the users attached to the question.
     * @return BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->BelongsToMany(User::class, 'question_users');
    }

    /**
     * Generate a random number to determine if the question will give a bonus or not.
     */
    public function tryGoldenCard(): void
    {
        try {
            $this->is_golden_card = random_int(0, config('app.golden_card_ratio')) === 1;
        } catch (Exception $e) {
            throw new RuntimeException('Error generating the random golden card');
        }
    }

    /**
     * Scope a query to only include popular users.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeOriginalsOnly(Builder $query): Builder
    {
        return $query->whereNull('reverse_question_id');
    }

    /**
     * Make the reverse version of the question.
     * @throws Exception
     */
    public function createReverseQuestion(): Question
    {
        if (! self::find('reverse_question_id')) {
            $reverted_answer = Answer::create([
                'wording' => $this->wording,
            ]);

            $reverted_answer->save();
            $question = self::create([
                'wording' => $this->answer()->first()->wording,
                'reverse_question_id' => $this->id,
                'category_id' => $this->category_id,
                'answer_id' => $reverted_answer->id,
            ]);
            $question->save();

            return $question;
        }

        throw new RuntimeException('Error, the inverted question already exists for this one');
    }


    /**
     * Prepares to be displayed on front by adding the appropriate fields
     * @param User $user The user that has to answer the question
     * @return $this
     */
    public function preparedForView(User $user = null): self
    {
        $answer = $this->answer()->first();
        if ($answer) {
            $this['answer'] = $answer->wording;
        }

        $this['is_new'] = ($user && !$this->isSetForUser($user)) ?: false;

        return $this;
    }
}
