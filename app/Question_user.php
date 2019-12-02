<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        $this->next_question_at = now();
    }

    /**
     * @param $question_id
     * @param $user_id
     * @return \Illuminate\Database\Eloquent\Builder|Model|object|null
     */
    public static function findFromTuple($question_id, $user_id)
    {
        return self::query()->where('question_id', $question_id)->where('user_id', $user_id);
    }

    public function save_success($user, $mode, $is_golden_card) {
        if ($mode === 'soft') {
            $earned_points = $this->full_score ?: $this->score;
            $this->current_delay ++;
            $this->last_answered_at = Carbon::now();
            $this->next_question_at = Carbon::now()->addDays($this->current_delay);
            $this->full_score = $this->score*$this->current_delay;
            $this->save();
        }
        else {
            $earned_points = $this->score;
        }
        $is_golden_card && $earned_points *= $earned_points;

        $user->score += $earned_points;
        $user->save();

        return $earned_points;
    }
}
