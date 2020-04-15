<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class UserStatistics extends Model
{
    protected $fillable = [
        'user_id', 'memorized_questions',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->created_at = Carbon::today();
    }

    /**
     * Creates or increments the current UserStatistics row based on the created_at attribute
     * If latest row was created another day than today => Create a new row
     * Else improve the current one
     * @param Int $userId whose we want to increment progression
     * @param Int $memorizedQuestions by the user
     */
    public static function incrementForUser(Int $userId, Int $memorizedQuestions)
    {
        /** @var User $user */
        $user = User::find($userId);
        if ($user) {
            $latestRow = $user->statistics()->latest()->first();
            if (!$latestRow || $latestRow->created_at < Carbon::today()) {
                $latestRow = new self();
                $latestRow->user_id = $userId;
            }

            $latestRow->memorized_questions = $memorizedQuestions;
            $latestRow->save();
        }
    }
}
