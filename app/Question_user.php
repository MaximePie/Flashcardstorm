<?php

namespace App;

use Carbon\Carbon;
use Eloquent;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Question_user.
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property int|null $question_id
 * @property int $current_delay
 * @property int $current_mental_delay
 * @property int $score
 * @property int|null $full_score
 * @property int $number_of_successful_answer
 * @property int $number_of_unsuccessful_answer
 * @property string|null $last_answered_at
 * @property string|null $next_question_at
 * @property string|null $next_mental_question_at
 * @property bool $isMemorized
 * @property bool $is_mentally_memorized
 * @property bool $isInitiated
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
    /** @var int Minimal score to reach for going memorized */
    const FULL_SCORE_TRESHOLD = 100;
    const DEFAULT_BAG_LIMIT = 5;
    const initiationSize = 10;

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
        $this->current_mental_delay = 1;
        $this->next_question_at = now();
        $this->next_mental_question_at = now();
        $this->isMemorized = false;
        $this->is_mentally_memorized = false;
    }


    /**
     * @param bool $isMemorized
     * @throws Exception
     */
    public function setIsMemorizedAttribute(bool $isMemorized): void
    {
        if ($isMemorized === true) {

            if ($this->full_score < self::FULL_SCORE_TRESHOLD) {
                throw new Exception("Cannot set memorized attribute while full score is under threshold");
            }

            $user = User::find($this->user_id);
            UserStatistics::incrementForUser($user->id, $user->memorizedQuestions()->count());

            $this->next_question_at = null;
        }
        $this->attributes['isMemorized'] = $isMemorized;
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
     * @return HasOne
     */
    public function mnemonics()
    {
        return $this->hasOne(Mnemonic::class);
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
     * @param string $mode Soft : Increase the score and delay. Storm : Do nothing
     * @param bool|null $is_golden_card Whether the question has a bonus or not
     * @return int the new score of the question
     */
    public function saveSuccess(string $mode, bool $is_golden_card = false): int
    {
        $user = User::findOrFail($this->user_id);
        if ($mode === 'soft') {
            $earned_points = $this->full_score;
            $this->current_delay++;
            $this->last_answered_at = Carbon::now();
            $this->next_question_at = Carbon::now()->addDays($this->current_delay - 1);

            if ($this->current_delay >= 10) {
                $this->isMemorized = true;
            }

            $this->full_score = $this->score * $this->current_delay;


            $this->save();
        } else {
            $earned_points = $this->score;
        }

        if ($mode === 'mental') {
            $this->current_mental_delay ++;
            $this->next_mental_question_at = Carbon::now()->addDays($this->current_mental_delay - 1);

            if ($this->current_mental_delay >= 10) {
                $this->is_mentally_memorized = true;
            }
        }

        $is_golden_card && $earned_points *= $earned_points;

        $user->score += $earned_points;
        $user->save();
        $user->updateDailyProgress();

        return $earned_points;
    }

}
