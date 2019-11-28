<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Changelog extends Model
{
    protected $fillable = ['title', 'text', 'nextstep'];
}
