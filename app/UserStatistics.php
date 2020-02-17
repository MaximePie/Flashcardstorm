<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class UserStatistics extends Model
{
    //

    protected $fillable = [
        'user_id', 'memorized_questions',
    ];
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->created_at = Carbon::today();
        if (isset($attributes['user_id'])) {
            $this->memorized_questions = self::query()->where('user_id', $attributes)->latest()->first()->memorized_questions;
            $this->save();
        }
    }
}
