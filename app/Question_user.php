<?php

namespace App;

use Carbon\Carbon;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Question_user.
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $question_id
 * @property int $current_delay
 * @property int $score
 * @property int|null $full_score
 * @property int $number_of_successful_answer
 * @property int $number_of_unsuccessful_answer
 * @property string|null $last_answered_at
 * @property string|null $next_question_at
 * @method static Builder|Question_user newModelQuery()
 * @method static Builder|Question_user newQuery()
 * @method static Builder|Question_user query()
 * @method static Builder|Question_user whereCreatedAt($value)
 * @method static Builder|Question_user whereCurrentDelay($value)
 * @method static Builder|Question_user whereFullScore($value)
 * @method static Builder|Question_user whereId($value)
 * @method static Builder|Question_user whereLastAnsweredAt($value)
 * @method static Builder|Question_user whereNextQuestionAt($value)
 * @method static Builder|Question_user whereNumberOfSuccessfulAnswer($value)
 * @method static Builder|Question_user whereNumberOfUnsuccessfulAnswer($value)
 * @method static Builder|Question_user whereQuestionId($value)
 * @method static Builder|Question_user whereScore($value)
 * @method static Builder|Question_user whereUpdatedAt($value)
 * @method static Builder|Question_user whereUserId($value)
 * @mixin Eloquent
 */
class Question_user extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['user_id', 'question_id', 'current_delay', 'score', 'full_score', 'number_of_successful_answer', 'number_of_unsuccessful_answer', 'last_answered_at', 'next_question_at'];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->full_score = 10;
        $this->score = 10;
        $this->current_delay = 1;
        $this->next_question_at = now();
    }

    /**
     * @return BelongsTo
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @param $question_id
     * @param $user_id
     * @return Builder|Model|object|null
     */
    public static function findFromTuple($question_id, $user_id)
    {
        return self::query()->where('question_id', $question_id)->where('user_id', $user_id);
    }

    /**
     * Update the questionUser row on success
     * @param User $user The user that successfully answered the question
     * @param string $mode Soft : Increase the score and delay. Storm : Do nothing
     * @param bool|null $is_golden_card Whether the question has a bonus or not
     * @return int the new score of the question
     * @throws \Exception
     */
    public function save_success(User $user, string $mode, bool $is_golden_card = false): int
    {
        if ($mode === 'soft') {
            $earned_points = $this->full_score ?: $this->score;
            $this->current_delay++;
            $this->last_answered_at = Carbon::now();
            $this->next_question_at = (new Carbon($this->next_question_at))->addDays($this->current_delay);
            $this->full_score = $this->score * $this->current_delay;
            $this->save();
        } else {
            $earned_points = $this->score;
        }
        $is_golden_card && $earned_points *= $earned_points;

        $user->updateDailyProgress();

        if ($user->questions(true)->count() === $user->daily_objective) {
            $earned_points += 200;
        }

        $user->score += $earned_points;
        $user->save();

        return $earned_points;
    }
}
