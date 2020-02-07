<?php

namespace App;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * App\User.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $api_token
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $score
 * @property int|null $daily_objective
 * @property int|null $daily_progress
 * @property string|null $last_daily_updated_at
 * @property-read DatabaseNotificationCollection|DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @method static Builder|User newModelQuery()
 * @method static Builder|User newQuery()
 * @method static Builder|User query()
 * @method static Builder|User whereApiToken($value)
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereDailyObjective($value)
 * @method static Builder|User whereDailyProgress($value)
 * @method static Builder|User whereEmail($value)
 * @method static Builder|User whereEmailVerifiedAt($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User whereLastDailyUpdatedAt($value)
 * @method static Builder|User whereName($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User whereRememberToken($value)
 * @method static Builder|User whereScore($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @mixin Eloquent
 */
class User extends Authenticable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'api_token',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * @param bool $with_delay Whether we only need further questions or all questions
     * @param bool $are_original Wheter we only need original questions or if we also need its reverse version
     * @param bool $are_memorized
     * @return BelongsToMany
     */
    public function questions(bool $with_delay = false, bool $are_original = false, bool $are_memorized = true): BelongsToMany
    {
        $query = $this->BelongsToMany(Question::class, 'question_users')->joinSub(
            Question_user::query(),
            'user_question',
            'user_question.question_id',
            '=',
            'questions.id'
        );

        if (!$are_memorized) {
            $query = $query->where('user_question.isMemorized', false);
        }

        if ($with_delay) {
            $query->whereDate('next_question_at', '<=', now());
        }

        if ($are_original) {
            $query->whereNull('reverse_question_id');
        }

        return $query;
    }

    public function dailyProgress(): array
    {
        $user_progress = [];
        $user_progress['daily_objective'] = $this->daily_objective;
        $user_progress['daily_progress'] = $this->daily_progress;

        return $user_progress;
    }

    public function updateDailyProgress(): void
    {
        $this->daily_progress = $this->daily_objective - $this->questions(true)->count();
    }
}
