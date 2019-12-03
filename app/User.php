<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    // TODO #17 Créer une migration pour l'utilisateur et lui ajouter une colonne "score"

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'api_token'
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
     * @param bool $with_delay
     * @return BelongsToMany
     */
    public function questions(bool $with_delay = false): BelongsToMany
    {
        $query = $this->BelongsToMany(Question::class, 'question_users');
        if ($with_delay) {
            $query->whereDate('next_question_at', '<=', now());
        }
        return $query;
    }

    /**
     * @return Question|null
     */
    public function nextQuestion(): ?Question
    {
        return $this->questions()->orderBy('next_question_at', 'asc')->first();
    }

    public function dailyProgress() {
        $user_progress = [];
        $user_progress['daily_objective'] = $this->daily_objective;
        $user_progress['daily_progress'] = $this->daily_progress;

        return $user_progress;
    }

    public function updateDailyProgress() {
        $this->daily_progress = $this->daily_objective - $this->questions(true)->count();
    }
}
