<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class UserStatistics extends Model
{
    //
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->created_at = Carbon::today();
    }
}
