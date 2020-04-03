<?php

namespace App;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
    const NEXT_QUESTION_MESSAGE = "Vous avez répondu à toutes vos questions pour aujourd'hui. La prochaine question sera prévue pour le ";
    const NEXT_QUESTION_MESSAGE_NOT_FOUND = "Aucune question ne vous est assignée pour le moment. Passez en mode Tempête pour ajouter automatiquement les questions à votre Kit";

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
     * @return BelongsToMany
     */
    public function questions(): BelongsToMany
    {
        return $this->BelongsToMany(Question::class, 'question_users');
    }

    public function addQuestion(Question $question): Question_user
    {
        return Question_user::create(['user_id' => $this->id, 'question_id' => $question->id]);
    }

    /**
     * @return HasMany
     */
    public function statistics(): HasMany
    {
        return $this->hasMany(UserStatistics::class, 'user_id');
    }

    /**
     * @return BelongsToMany
     */
    public function dailyQuestions(): BelongsToMany
    {
        return $this->BelongsToMany(Question::class, 'question_users')
        ->where('question_users.isMemorized', false)
        ->whereDate('question_users.next_question_at', '<=', now());
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
        $this->daily_progress = $this->daily_objective - $this->dailyQuestions()->count();
        $this->save();
    }

    /**
     * Returns the next daily question for the current user
     * @return Question_user|null
     */
    public function nextQuestion(): ?Question_user
    {
        return Question_user::query()
            ->where('user_id', $this->id)
            ->where('next_question_at', '>=', now())
            ->orderBy('next_question_at', 'asc')
            ->first();
    }

    /**
     * Returns a random daily question
     *
     * @param array $alreadyLoadedQuestionIds All ids of already loaded questions
     * @param int $limit The maximum amount of question we should reach
     * @return Collection
     */
    public function scheduledRandomQuestion(array $alreadyLoadedQuestionIds = [], int $limit = Question_user::DEFAULT_BAG_LIMIT): Collection
    {
        return $this->dailyQuestions()
            ->limit($limit)
            ->whereNotIn('question_users.question_id', $alreadyLoadedQuestionIds)
            ->inRandomOrder()
            ->get();
    }

    /**
     * Returns a message based on daily question
     */
    public function nextQuestionMessage()
    {
        $next_question = $this->nextQuestion();
        if ($next_question) {
            return self::NEXT_QUESTION_MESSAGE . $next_question->next_question_at;
        } else {
            return self::NEXT_QUESTION_MESSAGE_NOT_FOUND;
        }
    }
}
