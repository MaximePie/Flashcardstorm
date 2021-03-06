<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int attack
 * @property int current_health
 * @property int max_health
 */
class QuestEntity extends Model
{

    /**
     * @var array
     */
    protected $fillable = [
        "name",
        "user_id",
        "current_health",
        "max_health",
        "attack",
        "current_experience",
        "to_next_level_experience",
        "level",
    ];

    /**
     * Returns the associated user to the current entity, can be null
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
